function logout(){
    document.cookie = "session=; expires=" + +new Date + "; domain=" + document.domain + "; path=/";
    window.location.replace('/index')
};