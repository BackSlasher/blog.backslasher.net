Title: Extending Yii's Web Application Creation
Date: 2012-03-24 18:01
Author: Nitzan Raz (noreply@blogger.com)
Tags: PHP, Yii
Slug: extending-yiis-web-application-creation

I found out that after creating my Yii Applications through Yiic.bat, I
tend to modify the same things in all of them (adding ".htaccess" files
for pretty urls (no index.php), adding a reference for my custom modules
directory, etc.), so I decided to try and override the WebApp command
with one of my own. There might be better methods, but it's also good
practice.  
My steps were as follows:  

<ol>
<li>
Copy the following files from the framework directory to a side
directory (which I named "myWebApp"):yiic,yiic.bat,yiic.php

</li>
<li>
In yiic.php, modify the "require\_once" to reference the actual location
of yii.php

</li>
<li>
Create the following directories in the side directory:

</li>
-   cli/commands
-   cli/views/webapp

<li>
Copy the file "cli/commands/WebAppCommand.php" from the framework
directory into your "cli/commands" directory. Be sure to rename it. I
chose "myWebAppCommand.php"

</li>
<li>
Open the copied file.

</li>
<ol>
<li>
Change the class name to match the file name. In my case -
"MyWebAppCommand"

</li>
<li>
Change it to extend "WebAppCommand", in order to have access to the
original application generation code. 

</li>
<li>
Just before the class deceleration, manually import the original
WebAppCommand file (autoload won't find it) using the following
statement:  

~~~~ {.brush:php}
Yii::import('system.cli.commands.WebAppCommand');
~~~~

</li>
<li>
Modify the class to your liking. Sadly, the "UI" and the file copy logic
are located at the same method (**run**), so it's either copying the
entire method to your clone, or missing out on the entire logic of the
application. Assuming you "steal" the run method, you should do one of
the following

</li>
-   Also copy the template web site, found at cli/views/webapp to your
    side directory (at the same path!)
-   Modify the line that tells Yii where to find the source files:  
   Instead of

    ~~~~ {.brush:php}
    $sourceDir=realpath(dirname(__FILE__).'/../views/webapp');
    ~~~~

      
   Use

    ~~~~ {.brush:php}
    $sourceDir=realpath(Yii::getPathOfAlias('system').'/cli/views/webapp');
    ~~~~

      

<li>
Further customize the file. The most common things to do:

</li>
-   Copy additional files - Create your own webapp directory and copy it
    after copying the original one
-   Add customization callback - copy one of "generate\*" methods and
    add appropriate callback in the "run" method.

</ol>
</ol>
Happy hacking!

</p>

