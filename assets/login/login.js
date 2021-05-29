
function login () {
    const data = {                                                  // grab username and password
        username: document.getElementById('username-input').value,
        password: document.getElementById('password-input').value
    }

    let error = false;

    if (data.username === "") {
        document.getElementById('username-tooltip').textContent = "Username cannot be blank!"
        document.getElementById('username-tooltip').style.visibility = "visible";
        error = true;
    }
    else {
        document.getElementById('username-tooltip').style.visibility = "hidden";
    }
    if (error) {
        return
    }

    var xhr = new XMLHttpRequest();                                 // create http request and send it
    xhr.open("POST", "./", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function () {                          // wait for response
        if (xhr.readyState == 4) {
            const response = xhr.responseText
            if (response === 'fail') {                            // alert when there is an issue or username exists
                document.getElementById('password-tooltip').textContent = "Incorrect Username or Password!"
                document.getElementById('password-tooltip').style.visibility = "visible"
            } else {
                document.cookie = "session=" + response + "; path=/; httpOnly: false";  // otherwise, set session cookie and redirect to profile
                window.location.replace('../profile')
            }
        }
    };
}