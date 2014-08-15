Title: Dumping your MySQL db using PHP
Date: 2011-05-28 12:54
Author: Nitzan Raz (noreply@blogger.com)
Tags: PHP, SQL, Backups
Slug: dumping-your-mysql-db-using-php
OldSlug: dumping-your-mysql-db-using-php
Category: Foss

Hi.  
One of my clients asked me to be able to take manual backups of his DB,
and because he wasn't so technologically-inclined, using the hosting
company's interface wasn't an option. So I created a small PHP page that
uses **mysqldump** to dump the site's db in a downloadable way. The
interesting part is:  

~~~php
<?
// Make sure user is allowed to dump the DB. We don't want everyone getting a copy of our data!
if (UserIsAdmin()) {
 // Replace variables with your own values
 $user='SQLUSER';
 $password='SQLPASSWORD';
 $db='SQLDATABASE';
 $host='SQLSERVER';
 $command = "mysqldump --user $user --password=$password --host $host".
 " --create-options $db".
 $arr = null;
 // Execute
 exec($command,$arr);
 $res = implode('
', $arr);
 // Make the resulting input look like a downloadable file. Remove these if you wish
 header('Content-Type: text/plain; charset=utf-8');
 header('Content-Disposition: attachment;filename="backup.sql"');
 echo $res; 
}
?>
~~~

And that's it!  
Of course this script only works if you can execute stuff on your host.  
You can give it its own page, or make it a part of a bigger one.  
Enjoy!
