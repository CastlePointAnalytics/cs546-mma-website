$(document).ready(() => {
  $(".pickemForm").submit(function (event) {
    event.preventDefault();
    //Get name of fightcard
    let fightCardTitle = $("#title").text();
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
      updatePickem(fightCardTitle, fighters);
    }
    //console.log(fighter);
  });
});

function updatePickem(fightCardTitle, fighters) {
  $.ajax({
    url: "/user/updatePickem",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({
      title: fightCardTitle,
      fighters: fighters,
    }),
  });
}
