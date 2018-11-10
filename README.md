# Tweeter Project

_Grogger_ is a basic clone of Twitter, catering to a slightly... scurvier... demographic.

![Grogger](/public/images/screenshot.png)

## Usage

- Clone this repository
- `npm install`
- Two options for running:
  - `npm run local` to simply start the server with `nodemon`
  - `npm run dev` to start the server along with live page reloading (requires the LiveReload extension for Chrome) and recompiling of Sass
- The server will connect to a MongoDB instance hosted on MLab. The authorization is hardcoded for simplicity, as the database exists solely for this project.
- Direct your browser to [http://localhost:8080](http://localhost:8080)
- Enjoy. :)

## Dependencies

- A browser that supports the ES6/ES2015 Javascript specification
- Node 5.10.x or above
- Express
- MongoDB
- Pirate Name Generator because why the hell not?
- Chance
- md5

## Development Dependencies

- Nodemon
- Node-sass
- LiveReload
- Parallelshell

The latter allows `npm run dev` to start the other three and monitor them so that if one ends/crashes all of them will stop. This was helpful, at least on my machine, because simply using `nodemon & node-sass & livereload` would leave the other processes running silently in the background until I killed them.

## Assets

The imagery and overall theme were lovingly borrowed from Lucasarts' "Monkey Island" games.

- Melee Island background - [Reddit](https://www.reddit.com/r/gaming/comments/d20fh/have_3_widescreen_monitors_heres_a_monkey_island/)

- Sprites - [The Spriter's Resource](https://www.spriters-resource.com/pc_computer/secretofmonkeyisland/sheet/26970/)