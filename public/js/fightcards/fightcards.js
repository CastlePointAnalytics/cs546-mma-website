$(document).ready(() => {
  $(".pickemForm").submit(function (event) {
    event.preventDefault();
    //We get all the fighter ids that are checked
    let fighters = [];
    $("input[type='radio']:checked").each(function () {
      // console.log(id);
      // console.log($(this).attr("id"));
      fighters.push([$(this).attr("id").slice(0, -7)]);
    });

    if (fighters.length === 0) {
      alert("You must select at least one fighter before clicking submit!");
    } else {
      if ($("#logged-in").text() == "true") {
        let currentURL = window.location.pathname.substr(12);
        updatePickem(fighters, currentURL);
        alert("Pickem submitted!");
      } else {
        alert("You must be logged in to submit pickems!");
      }
    }
    //console.log(fighter);
  });
});

function updatePickem(fighters, currentURL) {
  console.log(fighters);
  $.ajax({
    url: "/user/updatePickem",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      id: currentURL,
      fighters: fighters,
    }),
  });
}
