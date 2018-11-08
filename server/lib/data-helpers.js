"use strict";

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      db.collection("tweets").insertOne(newTweet, callback);
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(since, callback) {

      db.collection("tweets").find().toArray( (err, tweets) => {

        const sortNewestFirst = (a, b) => a.created_at - b.created_at;
        const newerThan =
          (tweet) => Number(tweet.created_at) > Number(since);

        let out = tweets.sort(sortNewestFirst);
        if (since) out = out.filter(newerThan);

        callback(null, out);

      });
    }

  };
};
