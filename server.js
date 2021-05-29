const express = require('express')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const argon2 = require('argon2')
const fs = require('fs')
const { fork } = require('child_process')

const secret = '0439868ec28dab59' //crypto.randomBytes(16)          // generate random server secret key for encrypting cookies

// takes in session cookie, returns stringified json data
function decryptCookie(data) {
    try {
        data = JSON.parse(Buffer.from(data, 'base64').toString('ascii'))
        const iv = Buffer.from(data.iv)
        const decipher = crypto.createDecipheriv('aes-128-cbc', secret, iv)

        let decrypted = decipher.update(data.data, 'hex', 'utf8')
        decrypted += decipher.final('utf8')
        return decrypted
    } catch (error) {
        return undefined
    }
}

// takes in stringified user data, returns session cookie
function encryptCookie(data) {
    try {
        const iv = crypto.randomBytes(16)
        const cipher = crypto.createCipheriv('aes-128-cbc', secret, iv)

        let encrypted = cipher.update(data, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        return Buffer.from(JSON.stringify({ data: encrypted, iv: iv })).toString('base64')
    } catch (error) {
        return undefined
    }
}

// takes in username, returns session cookie
function createCookie(user) {
    const data = JSON.parse(fs.readFileSync('./userData/' + user + '.json'))
    const userData = {
        username: data.username,
        hash: data.hash
    }
    return encryptCookie(JSON.stringify(userData))
}

// takes in session cookie, return promise. resolves to user object if found, undefined it not
function authUser(session) {
    return new Promise((resolve) => {
        try {
            const user = JSON.parse(decryptCookie(session))
            fs.access('./userData/' + user.username + '.json', (err) => {
                if (err) {
                    resolve(undefined)
                    return
                }
                fs.readFile('./userData/' + user.username + '.json', (error, data) => {
                    if (error) {
                        resolve(undefined)
                        return
                    }
                    resolve(JSON.parse(data))
                })
            })
        } catch { resolve(undefined) }
    })
}

// takes in username, returns user object if found, undefined if not
function findUser(username) {
    return new Promise((resolve) => {
        try {
            fs.access('./userData/' + username + '.json', (err) => {
                if (err) {
                    resolve(undefined)
                    return
                }
                fs.readFile('./userData/' + username + '.json', (error, data) => {
                    if (error) {
                        resolve(undefined)
                        return
                    }
                    resolve(JSON.parse(data))
                })
            })
        } catch { resolve(undefined) }
    })
}

function sha(input) { return crypto.createHash('sha256').update(input).digest('hex') }

// setting up express
const app = express()

app.set('view engine', 'ejs')
app.use(express.static('./assets'))
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


// homepage
app.get('/index', async (req, res) => {
    // check if user has valid session cookie, redirect to profile if yes
    const user = await authUser(req.cookies.session)
    if (user) { res.render('index-loggedin') }

    // otherwise, render page
    else { res.render('index') }
})

app.get('/signup', async (req, res) => {
    // check if user has valid session cookie, redirect to profile if yes
    const user = await authUser(req.cookies.session)
    if (user) { res.redirect('/profile') }

    //otherwise, render page
    else { res.render('signup') }
})

// login page
app.get('/login', async (req, res) => {
    // check if user has valid session cookie, redirect to profile if yes
    const user = await authUser(req.cookies.session)
    if (user) { res.redirect('/profile') }

    // otherwise, render page
    else { res.render('login') }
})

// login page
app.get('/profile', async (req, res) => {
    // check if user has valid session cookie, redirect to profile if yes
    const user = await authUser(req.cookies.session)
    if (user) {
        var reviews = []
        for (let i = 0; i < user.ratings.length; i++) {
            try { reviews.push(JSON.parse(fs.readFileSync('./ratings/' + user.ratings[i] + '.json'))) } catch {}
        }

        res.render('profile', { user: user, ratings: reviews})
    }

    // otherwise, render page
    else { res.redirect('login') }
})

app.get('/findClasses', async (req, res) => {
    var found = []
    var search = false
    if (req.query.school) {
        search = true
        var classes = fs.readdirSync('./classes')
        for (let i = 0; i < classes.length; i++) {
            var thisClass = fs.readFileSync('./classes/' + classes[i])

            if (thisClass.school === req.query.school) {
                found.push(thisClass)
            }
        }

        if (req.query.class) {
            for (let i = 0; i < found.length; i++) {
                if (req.query.class !== found.className) {
                    found.splice(i, 1)
                }
            }
        }
    }
    // check if user has valid session cookie, redirect to profile if yes
    const user = await authUser(req.cookies.session)
    if (user) { res.render('findClasses-loggedin', { found: found, search: req.query }) }

    // otherwise, render page
    else { res.render('findClasses', { found: found, search: req.query}) }
})

app.get('/newClass', async (req, res) => {
    // check if user has valid session cookie
    const user = await authUser(req.cookies.session)
    if (user) { 
        console.log(user)
        res.render('newClass') 
    }

    // otherwise, redirect page
    else { res.redirect('../login') }
})

// login form post req
app.post('/login', async (req, res) => {
    // grab the data
    const data = req.body

    // read the file, if error, it doesn't exist, send fail
    fs.readFile('./userData/' + data.username + '.json', async (err, user) => {
        if (err) {
            res.send('fail')
            return
        }

        // otherwise, check if passwords match
        try {
            const hash = JSON.parse(user).hash

            // compare
            if (await argon2.verify(hash, data.password)) {
                // if success, send session cookie
                res.send(createCookie(data.username))

            } else { res.send('fail') }  // otherwise, send fail

        } catch (err) { res.send('fail') }
    })
})

// signup form post req
app.post('/signup', (req, res) => {
    // grab the data
    const data = req.body

    console.log(data)
    // read the file, if error, it doesn't exist, new user can be created
    fs.access('./userData/' + data.username + '.json', async (err) => {
        if (err) {
            try {
                // hash the password
                const hash = await argon2.hash(data.password)

                // new user object
                const newUser = {
                    username: data.username,
                    hash: hash,
                    school: data.school,
                    ratings: []
                }

                // save user data,  apologize if things go wrong
                fs.writeFile('./userData/' + data.username + '.json', JSON.stringify(newUser), (error) => {
                    if (error) {
                        res.send('error')
                    }

                    // otherwise, send session cookie
                    else { res.send(createCookie(data.username)) }
                })

            } catch (err) { res.send('error') }

        } else { res.send('exists') } // file could be read, therefore user alread exists, new user cannot be created
    })
})

// new rating post req
app.post('/:class/newRating', (req, res) => {
    console.log(req.params.newRating)
})

app.listen(8080)    // start the server