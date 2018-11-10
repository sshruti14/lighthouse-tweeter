/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const globals = {
  MAX_TWEET_LENGTH: 140,
  LAST_FETCHED: null,
  UPDATE_TWEETS_RATE: 5000,
  IMG_AWARD: "/images/spoils.png",
  IMG_DRINKTO: "/images/drinkto.png",
  IMG_FLAG: "/images/flag.png"
};

function formattedAge(uTime) {

  //  const now = new Date();
  //  const since = new Date(uTime);

  //return new Date(uTime).toDateString();

  return moment(uTime).fromNow();

}


function createTweetElement(tweet) {

  return $("<article>")
    .addClass("tweet container")
    .append(
      $("<header>")
        .addClass("tweet-header")
        .append(
          $("<img>")
            .addClass("avatar")
            .attr("src", tweet.user.avatars.regular),
          $("<h2>")
            .text(tweet.user.name),
          $("<span>")
            .addClass("handle")
            .text(tweet.user.handle)
        ),
      $("<section>")
        .text(tweet.content.text),
      $("<footer>")
        .addClass("tweet-footer")
        .append(
          $("<span>")
            .addClass("tweet-age")
            .text(formattedAge(tweet.created_at)),
          $("<a>")
            .attr("href", "#")
            .append(
              $("<img>")
                .addClass("tweet-award")
                .attr("src", globals.IMG_AWARD)
                .attr("alt", "Give 'em a share of yer spoils")
                .attr("title", "Give 'em a share of yer spoils")
            ),
          $("<a>")
            .attr("href", "#")
            .append(
              $("<img>")
                .addClass("tweet-drink")
                .attr("src", globals.IMG_DRINKTO)
                .attr("alt", "Drink to that")
                .attr("title", "Drink to that")
            ),
          $("<a>")
            .attr("href", "#")
            .append(
              $("<img>")
                .addClass("tweet-flag")
                .attr("src", globals.IMG_FLAG)
                .attr("alt", "Raise the jolly roger")
                .attr("title", "Raise the jolly roger")
            )
        )
    );

}

function sortedTweets(tweets) {
  return tweets.sort((a,b) => b.created_at - a.created_at);
}

function renderTweets(data) {

  let elements = [];

  sortedTweets(data).forEach( tweet => {
    elements.push( createTweetElement(tweet) );
  });

  return elements;

}

function appendElements(elements) {
  $(".tweets-wrapper").append(elements);
}

function prependElements(elements) {
  $(".tweets-wrapper").prepend(elements);
}

function loadNewTweets(data) {

  // const newTweets = sortedTweets(
  //   data.filter( entry => {
  //     return entry.created_at > globals.LAST_FETCHED;
  //   })
  // );

  // console.log("filtered:");
  // console.log(newTweets);

  const newElements = renderTweets(data);
  prependElements(newElements);

}


function validateTweet(text) {

  const elm = $(".validation");

  if (text === "") {
    // alert("Forget to type something there, friend?");
    elm.addClass("validation-error");
    elm.text("Ye'r lookin' a bit empty, friend");
    return;
  } else if (text.length > globals.MAX_TWEET_LENGTH) {
    // alert("So yeah... that character counter? It's there for a reason, and it's red for a reason.");
    elm.addClass("validation-error");
    elm.text("This be a mug o' grog, not a keg");
    return;
  }

  elm.removeClass("validation-error");
  return true;

}

function updateTweets() {

  fetchTweets(loadNewTweets);

}

function submitTweet(event) {

  event.preventDefault();

  const text = $("#tweet-text").val();

  if (!validateTweet(text)) return;

  $.ajax(
    "/tweets", {
      method: "POST",
      data: "text=" + text
    })
    .then( setTimeout(updateTweets, 500) );

}

function attachListeners() {

  $(".new-tweet form").on("submit", submitTweet);

  $(".compose").on("click", event => {
    const elm = $(".new-tweet");
    elm.toggleClass("closed");

    if (!elm.hasClass("closed")) $("#tweet-text").focus();

  });

  $(".new-tweet textarea").on("input", null, null, function (event) {

    const charsLeft = globals.MAX_TWEET_LENGTH - this.value.length;
    const counter = $(this).siblings(".counter")[0];

    counter.innerText = charsLeft;

    (charsLeft < 0)
      ? counter.classList.add("counter-invalid")
      : counter.classList.remove("counter-invalid");

  });

}


function loadTweets(data) {
  appendElements(renderTweets(data));
}

function restartPolling() {

  window.clearTimeout(globals.fetchTimeout);
  globals.fetchTimeout = setTimeout(
    updateTweets, globals.UPDATE_TWEETS_RATE);

}

function fetchTweets(cb) {

  const since = globals.LAST_FETCHED;

  $.ajax(
    "/tweets", {
      method: "GET",
      data: ((since) ? "since=" + globals.LAST_FETCHED : "")})
    .then( data => {

      if (data.length) {

        cb(data);

        const last = data[0];
        globals.LAST_FETCHED = last.created_at;

      }

      restartPolling();

    });

}


$( () => {

  fetchTweets(loadTweets);

  attachListeners();

});