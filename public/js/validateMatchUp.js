let matchUpForm = document.getElementById("matchUpForm");
let fighter1 = document.getElementById("fighter1");
let fighter2 = document.getElementById("fighter2");
let fighter1Error = document.getElementById("fighter1Error");
let fighter2Error = document.getElementById("fighter2Error");
let sameFighterError = document.getElementById("sameFighterError");

if (matchUpForm) {
    matchUpForm.addEventListener("submit", (event) => {
        // Checks that a valid option has been selected for fighter 1
        if (fighter1.value == "default") {
            // display error that you must choose a fighter
            event.preventDefault();
            fighter1Error.hidden = false;
        } else {
            // input is valid, hide error
            fighter1Error.hidden = true;
        }

        // checks that a valid option has been selected for fighter 2
        if (fighter2.value == "default") {
            // display error that you must choose a fighter
            event.preventDefault();
            fighter2Error.hidden = false;
        } else {
            // input is valid, hide error
            fighter2Error.hidden = true;
        }

        // Checks that the two inputs are not the same fighter
        // NOTE: will only display if the inputs are not the default values
        if (fighter1.value != "default" && fighter1.value == fighter2.value) {
            // display error that you cannot choose the same fighter
            event.preventDefault();
            sameFighterError.hidden = false;
        } else {
            // inputs are not the same, hide error
            sameFighterError.hidden = true;
        }

        // checks that all errors are hidden
        // if (
        //     !(
        //         fighter1Error.hidden &&
        //         fighter2Error.hidden &&
        //         sameFighterError.hidden
        //     )
        // ) {
        //     // potentially add new fightCard here client side?
        // }
    });
}
