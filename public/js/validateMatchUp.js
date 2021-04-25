let matchUpForm = document.getElementById("matchUpForm");
let fighter1 = document.getElementById("fighter1");
let fighter2 = document.getElementById("fighter2");
let fighter1Error = document.getElementById("fighter1Error");
let fighter2Error = document.getElementById("fighter2Error");
let sameFighterError = document.getElementById("sameFighterError");

if (matchUpForm) {
    matchUpForm.addEventListener("submit", (event) => {
        if (fighter1.value == "Choose Fighter") {
            // display error that you must choose a fighter
            event.preventDefault();
            fighter1Error.hidden = false;
        } else {
            fighter1Error.hidden = true;
        }

        if (fighter2.value == "Choose Fighter") {
            // display error that you must choose a fighter
            event.preventDefault();
            fighter2Error.hidden = false;
        } else {
            fighter2Error.hidden = true;
        }

        if (
            fighter1.value != "Choose Fighter" &&
            fighter1.value == fighter2.value
        ) {
            // display error that you cannot choose the same fighter
            event.preventDefault();
            sameFighterError.hidden = false;
        } else {
            sameFighterError.hidden = true;
        }
    });
}
