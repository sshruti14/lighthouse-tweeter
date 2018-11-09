"use strict";

const Chance = require("chance");
const chance = new Chance();

const pirateNameGenerator = require("pirate-name-generator");

const md5 = require('md5');

module.exports = {

  generateRandomUser: () => {
    const gender    = chance.gender();
    // const firstName = chance.first({gender: gender});
    // const lastName  = chance.last();
    const generatedName = pirateNameGenerator().match(/(\w+) '[^']+' (\w+)/);
    console.log(generatedName);
    const firstName = generatedName[1];
    const lastName = generatedName[2];
    const userName  = firstName + " " + lastName;

    let userHandle = "@";
    if (Math.random() > 0.5) {
      let prefix    = chance.prefix({gender: gender});
      prefix = prefix.replace(".", "");
      userHandle += prefix;
    }

    userHandle += lastName;

    if (Math.random() > 0.5) {
      const suffix = Math.round(Math.random() * 100);
      userHandle += suffix;
    }

    const avatarUrlPrefix = `https://vanillicon.com/${md5(userHandle)}`;
    const avatars = {
      small:   `${avatarUrlPrefix}_50.png`,
      regular: `${avatarUrlPrefix}.png`,
      large:   `${avatarUrlPrefix}_200.png`
    }

    return {
      name: userName,
      handle: userHandle,
      avatars: avatars
    };
  }
};
