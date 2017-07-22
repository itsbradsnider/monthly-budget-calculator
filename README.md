# Monthly Budget Calculator
My fun little project that I use to plan our monthly family budget.

## Intro
I previously used an online budget calculator provided by our bank, but it was one-time-use only (ie: didn't store any inputted data) and had to be re-done every time I had a change to make. That was annoying, so I made my own.  

## Setup
I run the app on a local server setup on a home computer via [MAMP](https://www.mamp.info/en/) and didn't really build it to do more than live in that setting.

**PHP**<br>
The PHP files are largely used to transport data between the browser and the underlying MySQL database, and to template the HTML output in a couple spots. The templating files I've included in the /includes directory, and the data transport files I've included in the /utils directory.

**JAVASCRIPT**<br>
There is a single Javascript file which creates a Calculator object and adds it to the window object on page load with a basic API. The file in the repo is what would be the development version - normally I would minify the file with Grunt or Codekit or something for production. The app also relies on jQuery because it's just so easy to move around the DOM that way...

**CSS**<br>
I haven't included any CSS in the repo as (for my installation of it) I'm just using the out-of-the-box styles of Bootstrap 4. The idea of adding **_that_** to the repo seemed kinda odd...

**MYSQL**<br>
The database holds state and the app assumes access to the following tables:
- TODO (sorry)
