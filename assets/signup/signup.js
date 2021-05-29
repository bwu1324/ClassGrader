
function signup() {
    const data = {                                                  // grab form data
        username: document.getElementById('username-input').value,
        password: document.getElementById('password-input').value,
        confirmPassword: document.getElementById('passwordConfirm-input').value,
        school: document.getElementById('school-input').value
    }

    console.log(data)
    let error = false

    if (data.confirmPassword !== data.password) {
        document.getElementById('password-tooltip').style.visibility = "visible";
        error = true;
    } else {
        document.getElementById('password-tooltip').style.visibility = "hidden";
    }

    if (data.username === "") {
        document.getElementById('username-tooltip').style.visibility = "visible";
        error = true;
    } else {
        document.getElementById('username-tooltip').style.visibility = "hidden";
    }

    if (error) { return }

    var xhr = new XMLHttpRequest();                                 // create http request and send it
    xhr.open("POST", "./", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function () {                           // wait for response
        if (xhr.readyState == 4) {
            const response = xhr.responseText
            if (response === 'error') {                            // alert when there is an issue or username exists
                alert('There was an error with creating your account, we apologize for the inconvinience')
            } else if (response === 'exists') {
                document.getElementById('usernameTooltip').textContent = "An account with this username already exists!"
                document.getElementById('usernameTooltip').style.visibility = "visible"
            } else {
                document.cookie = "session=" + response + "; path=/; httpOnly: false";  // otherwise, set session cookie and redirect to profile
                window.location.replace('../profile')
            }
        }
    };
}