
function create () {
    const data = {                                                  // grab username and password
        school: document.getElementById('school-input').value,
        class: document.getElementById('class-input').value,
        teacher: document.getElementById('teacher-input').value
    }

    let error = false;

    if (data.school === "") {
        document.getElementById('school-tooltip').style.visibility = "visible";
        error = true;
    }
    if (data.class === "") {
        document.getElementById('class-tooltip').style.visibility = "visible";
        error = true;
    }
    if (data.teacher === "") {
        document.getElementById('teacher-tooltip').style.visibility = "visible";
        error = true;
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
            if (response === 'exists') {                            // alert when there is an issue or username exists
                document.getElementById('teacher-tooltip').textContent = "Class already exists!"
                document.getElementById('teacher-tooltip').style.visibility = "visible"
            } else {
                window.location.replace('/classes/' + response)
            }
        }
    };
}