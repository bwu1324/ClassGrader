function timestampToDate(timestamp) {
    var a = new Date(timestamp);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    var year = a.getFullYear()
    var month = months[a.getMonth()]
    var date = a.getDate()

    var time = date + '-' + month + ' ' + year
    return time
}

function startReview () {
    document.getElementById("new-review").style.visibility = "visible"
}

function closeReview () {
    document.getElementById("new-review").style.visibility = "hidden"
}

function review () {
    const data = {                                                  // grab data
        overallRating: document.getElementById('overall').value,
        contentRating: document.getElementById('content').value,
        homeworkRating: document.getElementById('homework').value,
        teacherRating: document.getElementById('teacher').value,
        review: document.getElementById('review-text').value,
        date: timestampToDate(Date.now())
    }

    var xhr = new XMLHttpRequest();                                 // create http request and send it
    xhr.open("POST", "", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    xhr.onreadystatechange = function () {                          // wait for response
        if (xhr.readyState == 4) {
            const response = xhr.responseText
            if (response === 'fail') {                            // alert when there is an issue or username exists
                alert('There was an error saving your review')
            } else {
                window.location.reload()
            }
        }
    };
}