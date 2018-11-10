const globals = {
  MAX_TWEET_LENGTH: 140,
  LAST_FETCHED: null,
  UPDATE_TWEETS_RATE: 5000,
  IMG_AWARD: "/images/spoils.png",
  IMG_DRINKTO: "/images/drinkto.png",
  IMG_FLAG: "/images/flag.png"
};


function formattedAge(uTime) {
  return moment(uTime).fromNow();
}


// Accepts a tweet object and returns a JQuery object of the
// generated DOM structure
function createTweetElement(tweet) {

  return $("<article>")
    .addClass("tweet container")
    .append(
      $("<header>")
        .addClass("tweet-header")
        .append(
          $("<img>")
            .addClass("tweet-avatar")
            .attr("src", tweet.user.avatars.regular),
          $("<h2>")
            .addClass("tweet-username")
            .text(tweet.user.name),
          $("<span>")
            .addClass("tweet-handle")
            .text(tweet.user.handle)
        ),
      $("<section>")
        .addClass("tweet-text")
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
                .addClass("tweet-footer-img tweet-award")
                .attr("src", globals.IMG_AWARD)
                .attr("alt", "Give 'em a share of yer spoils")
                .attr("title", "Give 'em a share of yer spoils")
            ),
          $("<a>")
            .attr("href", "#")
            .append(
              $("<img>")
                .addClass("tweet-footer-img tweet-drink")
                .attr("src", globals.IMG_DRINKTO)
                .attr("alt", "Drink to that")
                .attr("title", "Drink to that")
            ),
          $("<a>")
            .attr("href", "#")
            .append(
              $("<img>")
                .addClass("tweet-footer-img tweet-flag")
                .attr("src", globals.IMG_FLAG)
                .attr("alt", "Raise the jolly roger")
                .attr("title", "Raise the jolly roger")
            )
        )
    );
}


// Return an array of tweets rendered for the DOM from
// an array of tweet objects
function renderTweets(data) {

  let elements = [];

  let i = data.length - 1;
  do {
    elements.push(createTweetElement(data[i]));
  } while (i--);

  return elements;

}


function appendElements(elements) {
  $(".tweets-wrapper").append(elements);
}


function prependElements(elements) {
  $(".tweets-wrapper").prepend(elements);
}


function validateTweet(text) {

  const elm = $(".new-tweet-validation");

  if (text === "") {
    // alert("Forget to type something there, friend?");
    elm.addClass("new-tweet-validation-error");
    elm.text("Ye'r lookin' a bit empty, friend");
    return;
  } else if (text.length > globals.MAX_TWEET_LENGTH) {
    // alert("So yeah... that character counter? It's there for a reason, and it's red for a reason.");
    elm.addClass("new-tweet-validation-error");
    elm.text("This be a mug o' grog, not a keg");
    return;
  }

  elm.removeClass("new-tweet-validation-error");
  return true;

}


function updateTweets() {
  fetchTweets(loadNewTweets);
}


function submitTweet(event) {

  event.preventDefault();

  const textArea = $(".new-tweet-text");

  const text = textArea.val();

  if (!validateTweet(text)) return;

  textArea.val("");

  $.ajax(
    "/tweets", {
      method: "POST",
      data: "text=" + text
    })
    .then( setTimeout(updateTweets, 500) );

}


function toggleNewTweet() {

  const elm = $(".new-tweet");
  elm.toggleClass("new-tweet-closed");

  if (!elm.hasClass("new-tweet-closed")) $(".new-tweet-text").focus();

}


function updateCharCounter() {

  const elm = $(".new-tweet-text");
  const charsLeft = globals.MAX_TWEET_LENGTH - elm.val().length;
  const counter = $(".new-tweet-counter");

  counter.text(charsLeft);

  (charsLeft < 0)
    ? counter.addClass("new-tweet-counter-invalid")
    : counter.removeClass("new-tweet-counter-invalid");

}


function loadNewTweets(data) {
  prependElements(renderTweets(data));
}


function loadTweets(data) {
  appendElements(renderTweets(data));
}


function restartPolling() {

  window.clearTimeout(globals.fetchTimeout);
  globals.fetchTimeout = setTimeout(
    updateTweets, globals.UPDATE_TWEETS_RATE);

}


// Request all tweets created since the last fetch
function fetchTweets(cb) {

  const since = globals.LAST_FETCHED;

  $.ajax(
    "/tweets", {
      method: "GET",
      data: ((since) ? "since=" + globals.LAST_FETCHED : "")})
    .then( data => {

      if (data.length) {

        // Filtering again for cases where two fetches were sent off very
        // close together and the same new tweet comes back twice
        const filtered = data.filter(tweet => tweet.created_at > globals.LAST_FETCHED);

        cb(filtered);

        const last = filtered[filtered.length-1];
        globals.LAST_FETCHED = last.created_at;

      }

      restartPolling();

    });

}


function attachListeners() {

  $(".new-tweet-form").on("submit", submitTweet);
  $(".nav-bar-compose").on("click", toggleNewTweet);
  $(".new-tweet-text").on("input", updateCharCounter);

}


$( () => {
  fetchTweets(loadTweets);
  attachListeners();

});