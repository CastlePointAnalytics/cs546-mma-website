let matchUpForm = document.getElementById("matchUpForm");
let fighter1 = document.getElementById("fighter1");
let fighter2 = document.getElementById("fighter2");

if (matchUpForm) {
    matchUpForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (fighter1.value == "Choose Fighter") {
            // display error that you must choose a fighter
        } else {
        }

        if (fighter2.value == "Choose Fighter") {
            // display error that you must choose a fighter
        } else {
        }

        if (
            fighter1.value != "Choose Fighter" &&
            fighter1.value == fighter2.value
        ) {
            // display error that you cannot choose the same fighter
        } else {
        }
    });
}
