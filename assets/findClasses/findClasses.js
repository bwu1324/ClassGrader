
function search () {
    var schoolSearch = document.getElementById('school-input').value
    var classSearch = document.getElementById('class-input').value

    window.location.replace('/findClasses/?school=' + schoolSearch + '&class=' + classSearch)
}