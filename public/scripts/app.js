/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const tweetData = [

  {
    "user": {
      "name": "Newton",
      "avatars": {
        "small":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_50.png",
        "regular": "https://vanillicon.com/788e533873e80d2002fa14e1412b4188.png",
        "large":   "https://vanillicon.com/788e533873e80d2002fa14e1412b4188_200.png"
      },
      "handle": "@SirIsaac"
    },
    "content": {
      "text": "If I have seen further it is by standing on the shoulders of giants"
    },
    "created_at": 1461116232227
  },
  {
    "user": {
      "name": "Calvin",
      "avatars": {
        "small":   "https://avatar.amuniversal.com/user_avatars/avatars_gocomicsver3/2973000/2973830/avatar_10c9bbbaddcd_128.png",
        "regular": "https://avatar.amuniversal.com/user_avatars/avatars_gocomicsver3/2973000/2973830/avatar_10c9bbbaddcd_128.png",
        "large":   "https://avatar.amuniversal.com/user_avatars/avatars_gocomicsver3/2973000/2973830/avatar_10c9bbbaddcd_128.png"
      },
      "handle": "@Spiff"
    },
    "content": {
      "text": "Some days even my lucky rocket-ship underpants don't help."
    },
    "created_at": 820368000000
  },
  {
    "user": {
      "name": "Descartes",
      "avatars": {
        "small":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_50.png",
        "regular": "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc.png",
        "large":   "https://vanillicon.com/7b89b0d8280b93e2ba68841436c0bebc_200.png"
      },
      "handle": "@rd" },
    "content": {
      "text": "Je pense , donc je suis"
    },
    "created_at": 1460113909088
  },
  {
    "user": {
      "name": "Johann von Goethe",
      "avatars": {
        "small":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_50.png",
        "regular": "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1.png",
        "large":   "https://vanillicon.com/d55cf8e18b47d4baaf60c006a0de39e1_200.png"
      },
      "handle": "@johann49"
    },
    "content": {
      "text": "Es ist nichts schrecklicher als eine tätige Unwissenheit."
    },
    "created_at": 1461003796368
  }

];


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

function getTweets() {
  return tweetData.sort((a,b) => b.created_at - a.created_at);
}

function renderTweets() {

  let $parent = $(".content-area");

  let elements = [];

  getTweets().forEach( tweet => {
    elements.push( createTweetElement(tweet) );
  });

  $parent.append(elements);

}


$( () => {
  renderTweets();
});