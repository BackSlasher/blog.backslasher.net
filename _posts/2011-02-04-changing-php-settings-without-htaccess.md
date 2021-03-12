---
title: Changing php settings without .htaccess or php.ini
categories:
- FOSS
tags:
  - Programming
  - PHP
---

I'm doing a little developing in PHP as a hobby, and I got some task involving free hosting in [FreeHostingCloud.com](http://www.freehostingcloud.com/).  
Since I'm just starting to learn PHP 5, I have a lot of errors. All kinds of them. And it took me a while to understand that errors aren't being displayed onscreen because the `display_errors` flag was off.  
Google told me that I should change this flag using the `.htaccess` file, if it's an Apache module, or the `php.ini` file, if it's a FastCGI implementation (which it is).  
  
  
### The Problem
Since it's a free hosting package, I can't access the `php.ini` file or change the php-wrapper file, that tells the server where to find `php.ini`.
### The Solution
I was beginning to think that I'll have to deal with having no errors on screen at all, until I found `ini_set`. It's a function that sets a PHP flag for the duration of the script. So now I've added to my `base.php` (the PHP file I include in every page) the following command:
~~~~php
<? ini_set('display_errors', 1); ?>
~~~~
As long I set it before every page (even before my `phpinfo` page),
everything turns out OK!  
  
### One Last Thing
For those just starting with PHP, you can find out a lot about your environment (flags, libraries, PHP version...) by creating a page that only contains this instruction (except `ini_set`, of course!):
~~~~ php
<? phpinfo(); ?>
~~~~
You'll get a detailed report of your php environment. Remember to take it off once the site becomes production.

Happy PHPing!
