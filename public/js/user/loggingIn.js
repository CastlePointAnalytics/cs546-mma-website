function checkLogin() {
    let username = document.getElementById("username");
    let password = document.getElementById("password");
    if (username.value == "" && password.value == "") {
        alert("Please enter a username and password.");
        return;
    }
    if (username.value == "") {
        alert("Please enter a username.");
        return;
    }
    if (password.value == "") {
        alert("Please enter a password.");
        return;
    }

    if (typeof username.value != 'string') {
        alert("Please enter a valid username or signup.");
    }
}

document.addEventListener("DOMContentLoaded", function(event) { 
    //fib.js is being loaded.
    console.log(" Hellooo  There");
    let loginForm = document.getElementById("login-form");
    console.log(loginForm);
    loginForm.addEventListener("submit", checkLogin, false);
});