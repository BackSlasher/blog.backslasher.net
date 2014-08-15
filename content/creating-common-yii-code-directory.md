Title: Creating a common Yii code directory
Date: 2012-03-23 20:51
Category: FOSS
Tags: PHP, Yii
Slug: creating-common-yii-code-directory
OldSlug: creating-common-yii-code-directory

Yii natively supports code recycling, by allowing you to store common code in modules, widgets etc.  
However, to share code between applications, you still have to copy the files from one application to another. Right? **Wrong!**  
I recently created a common code directory (wittingly called "my-yii") where I store all of my common code.  
To access it from other applications, I added the following line to the `index.php` file (you should add it to your application's `yiic.php` if relevant), just before the application creation:  
~~~~php
<? Yii::setPathOfAlias('my-yii', dirname(__FILE__).'/../my-yii'); ?>
~~~~

Now you can use all of the code contained in your common directory, as
long as you append "my-yii" to the inclusion directory, thusly:

~~~~php
<? $mailer = Yii::createComponent('my-yii.extensions.mailer.EMailer'); ?>
~~~~
