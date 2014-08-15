Title: Testing Local Facebook Applications with ABE
Date: 2014-06-23 12:59
Tags: Security, Facebook, Development, NoScript, Firefox
Slug: testing-local-facebook-applications
OldSlug: testing-local-facebook-applications

I'm using Firefox with [NoScript](http://noscript.net/), which is the
AdBlock of scripts - allowing you to selectively block scripts according
to various rules (e.g. block all scripts from analytics.google.com), and
additionally helps protecting you from XSS ([cross site
scripting](http://en.wikipedia.org/wiki/Cross-site_scripting)).  
One of the components in NoScript is ABE ([Application Boundaries
Enforcer](http://noscript.net/abe/)), which I see as a replacement for
Internet Explorer's zones.  
It comes populated with one rule - preventing non-local sites from
accessing local resources (for example, preventing www.evilsite.com from
invoking file:///etc/group to learn about your local groups).  
Problem is, when developing Facebook applications, you usually want to
run the application locally (because it's much easier to modify and
debug), but still view it from the Facebook website (because Facebook
populates your site with some needed variables that way).  
When I tried doing that in firefox, I found out that ABE was protecting
me:  

<div class="separator" style="clear: both; text-align: center;">

</div>

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-0yrPii1L0eU/U2dUKDl8BaI/AAAAAAAAFLE/48GKLCykVuQ/s1600/FB-Abe-Blocking.png)](http://4.bp.blogspot.com/-0yrPii1L0eU/U2dUKDl8BaI/AAAAAAAAFLE/48GKLCykVuQ/s1600/FB-Abe-Blocking.png)

</div>

<div class="separator" style="clear: both; text-align: center;">

</div>

<a name="more"></a>My immediate thought was to disable ABE while
developing, but I've decided to take this opportunity to learn how it
works.  
I saw the different rule looks like this:

~~~~ {.prettyprint}
# Prevent Internet sites from requesting LAN resources.Site LOCALAccept from LOCALDeny
~~~~

And after adding this rule above it:

~~~~ {.prettyprint}
# The "." are at the beginning on purpose!Site .Local-Computer.FQDNAccept ALL from .facebook.com
~~~~

ABE no longer blocked it:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-SlUHSUFV5ow/U2dURMrFrvI/AAAAAAAAFLM/h_IACAhbZsc/s1600/FB-Abe-Allowing.png)](http://3.bp.blogspot.com/-SlUHSUFV5ow/U2dURMrFrvI/AAAAAAAAFLM/h_IACAhbZsc/s1600/FB-Abe-Allowing.png)

</div>

 Now I have my own bugs to deal with :)  
  

</p>

