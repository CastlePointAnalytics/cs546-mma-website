function checkSignUp(event) {
    let firstName = document.getElementById("signUpFirstName");
    let lastName = document.getElementById("signUpLastName");
    let age = document.getElementById("signUpAge");
    let country = document.getElementById("countrySelection");
    let username = document.getElementById("signUpUsername");
    let password = document.getElementById("signUpPassword");
    let passwordAgain = document.getElementById("signUpPasswordAgain");

    if (firstName.value == "") {
        event.preventDefault();
        alert("Please enter a first name.");
        return;
    }
    if (lastName.value == "") {
        event.preventDefault();
        alert("Please enter a last name.");
        return;
    }
    if (!age.value || Number.isInteger(age.value) ||age.value<18 || age.value>130) {
        event.preventDefault();
        alert("Please enter a valid age (18+).");
        return;
    }
    if (country.value == "default") {
        event.preventDefault();
        alert("Please select a country.");
        return;
    }
    if (username.value == "") {
        event.preventDefault();
        alert("Please enter a username.");
        return;
    }
    if (password.value == "") {
        event.preventDefault();
        alert("Please enter a password.");
        return;
    }

    if (passwordAgain.value == "") {
        event.preventDefault();
        alert("Please re-enter password.");
        return;
    }
    if (password.value !== passwordAgain.value) {
        event.preventDefault();
        alert("Passwords do not match!");
        return;
    }
    console.log("something right");
}

document.addEventListener("DOMContentLoaded", function(event) { 
    let signupForm = document.getElementById("signUp-form");
    signupForm.addEventListener("submit", checkSignUp, false);
});