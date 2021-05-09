$(document).ready(() => {
  $(".pickemForm").submit(function (event) {
    event.preventDefault();
    let id = $(this).attr("id");
    console.log(id);
    let parent = $(this);
    //Get name of fightcard

    let fightCardTitle = $("#title").text();
    //We get all the fighter ids that are checked
    let fighters = [];
    $("input[type='radio']:checked").each(function () {
      // console.log(id);
      // console.log($(this).attr("id"));
      fighters.push($(this).attr("id").slice(0, -7));
    });
    console.log(fighters);
    //console.log(fighter);

    // $.ajax({
    //   url: "/user/updatePickem",
    //   method: "POST",
    //   contentType: "application/json",
    //   data: JSON.stringify({
    //     title: fightCardTitle,
    //     name: fighter,
    //   }),
    // });
  });
});
