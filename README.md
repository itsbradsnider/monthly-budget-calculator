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
The database holds state and the app requires the following MYSQL table names and structures:

**--Tables--**

**budget_category**
```
CREATE TABLE `budget_category` (
  `id` int(1) NOT NULL,
  `category` varchar(100) NOT NULL,
  `type` varchar(30) NOT NULL,
  `recommended_percentage` int(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
<br>

**budget_names**
```
CREATE TABLE `budget_names` (
  `id` int(1) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edited` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
<br>

**expense_lines**
```
CREATE TABLE `expense_lines` (
  `id` int(1) NOT NULL,
  `user` int(3) NOT NULL,
  `budget_name` int(3) NOT NULL,
  `budget_category` int(3) NOT NULL,
  `description` varchar(100) NOT NULL,
  `amount` float NOT NULL,
  `frequency` int(3) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_edited` datetime NOT NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
<br>

**frequency**
```
CREATE TABLE `frequency` (
  `id` int(1) NOT NULL,
  `description` varchar(100) NOT NULL,
  `value_multiplied_by` int(2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
<br>

**users**
<br>
_Note: I added the users table because I thought at some point I may want more than
one user for the app, but there is no functionality currently built in that
allows you to create or switch to or delete different users._
```
CREATE TABLE `users` (
  `id` int(1) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```
<br>

**--Indexes--**

**budget_category**
```
ALTER TABLE `budget_category`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);
```
<br>

**budget_names**
```
ALTER TABLE `budget_names`
  ADD PRIMARY KEY (`id`),
  ADD KEY `name` (`name`);
```
<br>

**expense_lines**
```
ALTER TABLE `expense_lines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `budget_name` (`budget_name`),
  ADD KEY `frequency` (`frequency`),
  ADD KEY `budget_category` (`budget_category`),
  ADD KEY `user` (`user`);
```
<br>

**frequency**
```
ALTER TABLE `frequency`
  ADD PRIMARY KEY (`id`),
  ADD KEY `description` (`description`);
```
<br>

**users**
```
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);
```
<br>

**--Constraints--**

**expense_lines**
```
ALTER TABLE `expense_lines`
  ADD CONSTRAINT `budget_category` FOREIGN KEY (`budget_category`) REFERENCES `budget_category` (`id`),
  ADD CONSTRAINT `budget_name` FOREIGN KEY (`budget_name`) REFERENCES `budget_names` (`id`),
  ADD CONSTRAINT `frequency` FOREIGN KEY (`frequency`) REFERENCES `frequency` (`id`),
  ADD CONSTRAINT `user` FOREIGN KEY (`user`) REFERENCES `users` (`id`);
```
