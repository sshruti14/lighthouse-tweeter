$(document).ready(() => {

  const MAX_TWEET_LENGTH = 140;

  $(".new-tweet textarea").on("input", null, null, function (event) {

    const charsLeft = MAX_TWEET_LENGTH - this.value.length;
    const counter = $(this).siblings(".counter")[0];

    counter.innerText = charsLeft;

    (charsLeft < 0)
      ? counter.classList.add("counter-invalid")
      : counter.classList.remove("counter-invalid");

  });

});