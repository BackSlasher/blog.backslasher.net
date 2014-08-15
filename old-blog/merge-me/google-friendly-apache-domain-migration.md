Title: Google Friendly Apache Domain Migration
Date: 2011-07-26 15:10
Author: Nitzan Raz (noreply@blogger.com)
Tags: Apache
Slug: google-friendly-apache-domain-migration
OldSlug: google-friendly-apache-domain-migration

Hi.  
I recently migrated a domain for a client, and did it like a noob (as in
simply copying the db and files, making sure everything's working, and
then shutting down the old site). As a result, Google's pageranks were
lost, old links were broken and ghost pages were found on Google
searches.  
After googling around, I found out what I **should** have done, and made
my own action list.  
**Note:** While this list contains Apache and Google specific steps, you
can certainly research and replace them with equivalent steps for your
scenario.  
Also, Google's change of address only works for root domains (not
bla.othersite.com)  
<span style="font-size: large;">1. Prepare destination
environment</span>   
Copy files, dbs etc from to the new site, and make sure it's working.  
Change whatever absolute (http://bla.com/file) URLs you have in your
site to point to the new domain   
Before you get to the next stage, make sure your new site is up to date
(dbs updated etc).  
<span style="font-size: large;">2. Prepare to redirect the old
site</span>  
Make sure
[mod\_rewrite](http://httpd.apache.org/docs/2.2/mod/mod_rewrite.html) is
enabled on the old server. Almost all modern Apache hosts have it
enabled.  
Rename / wipe the old site's root directory (including deleting sub
directories). Of course you should back up the files if you delete them.
  
<span style="font-size: large;">3. Preform the actual
redirection</span>  
Create the .htaccess in the root directory, and set it to contain:  

<div style="border: 1px solid black;">

\<ifmodule mod\_rewrite.c\>  
RewriteEngine On  
RewriteCond %{REQUEST\_FILENAME} !-f  
RewriteRule \^(.\*)\$ http://NEWDOMAIN.COM/\$1 [R=301,L]  
\</ifmodule\>

</div>

This will cause mod\_rewrite to redirect all requests to the new domain,
except for files that exist in the old site (that's what the
RewriteConds do, "f" is for files). It's useful because that way you can
keep Google Webmaster Tools' validation file on the old domain, but it
won't be served on the new one.  
Test the redirection by:  

1.  Trying to access the old site and getting redirected to the new
    (working) site
2.  Putting a file on the old site (such as test.txt) and successfully
    downloading it (via oldsite.com/test.txt)

<span style="font-size: large;">4. Verify sites in Google Webmaster
Tools</span>  
If you haven't done so already, add both sites to [Google Webmaster
Tools](http://www.google.com/webmasters/tools/) (it's free!) and
validate them according to the site. It's preferable to use the html
file validation.  
<span style="font-size: large;">5. Post a change of address</span>  
Via Webmaster Tools:  

1.  Open the old site's dashboard
2.  Click "Site Configuration" -\> "Change of Address"
3.  Verify the checklist. Should be overlapping with mine.
4.  Select the new site from the dropdown below and submit

  
That's it! Make sure to check Webmaster tools every few days to look for
things such as crawl errors or incoming links pointing to the old
domain, and make sure to google the old and new site to see if Google's
db has updated.  
.htaccess code taken from
[StackOverflow](http://stackoverflow.com/questions/6531188/old-to-new-301-redirect-parameters-for-better-google-migration)  
Happy migrating!

</p>

