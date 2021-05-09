$(document).ready(() => {
  $("#pickemForm").submit(function (event) {
    //Get name of fightcard
    event.preventDefault();
    let fightCardTitle = $("#title").text();
    //Get fightcard id
    let fighter = "";
    $("input[type='radio']:checked").each(function () {
      if ($(this).is(":checked")) {
        fighter = $(this).parent().text().trim();
      }
    });
    console.log(fighter);

    $.ajax({
      url: "/user/updatePickem",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        title: fightCardTitle,
        name: fighter,
      }),
    });
  });
});
