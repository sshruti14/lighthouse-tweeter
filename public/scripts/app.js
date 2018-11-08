/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


const globals = {
  MAX_TWEET_LENGTH: 140,
  LAST_FETCHED: 0,
  UPDATE_TWEETS_RATE: 5000
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
        .append(
          $("<span>")
            .addClass("tweet-age")
            .text(formattedAge(tweet.created_at))
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

  const newTweets = sortedTweets(
    data.filter( entry => {
      return entry.created_at > globals.LAST_FETCHED;
    })
  );

  console.log("filtered:");
  console.log(newTweets);

  if (newTweets.length > 0) {
    const newElements = renderTweets(newTweets);
    prependElements(newElements);
  }

}


function validateTweet(text) {

  if (text === "") {
    alert("Forget to type something there, friend?");
    return;
  } else if (text.length > globals.MAX_TWEET_LENGTH) {
    alert("So yeah... that character counter? It's there for a reason, and it's red for a reason.");
    return;
  }

  return true;

}

function updateTweets() {

  console.log("checking for updates...");
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
    $(".new-tweet").toggleClass("closed");
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

  $.ajax(
    "/tweets", {method: "GET"})
    .then( data => {
      cb(data);
      const last = sortedTweets(data)[0];
      globals.LAST_FETCHED = last.created_at;

      restartPolling();

    });

}




$( () => {

  fetchTweets(loadTweets);

  attachListeners();

});