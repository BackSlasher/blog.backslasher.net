Title: Wget in PowerShell v3
Date: 2013-03-14 21:20
Tags: HTTP, SharePoint, Scripts, PowerShell, HTML
Slug: wget-in-powershell-v3
OldSlug: wget-in-powershell-v3

<p>
I've been envying my \*nix brethren for having
[Wget](http://en.wikipedia.org/wiki/Wget) for a long time. To get the
contents of a web page or download a file using http I had to use
workarounds that took more than one command - either creating a new
System.Net.WebRequest or using a BITS module.  
Well - Since I started using PowerShell v3 I can be lazy once more,
thanks to
[Invoke-WebRequest](http://technet.microsoft.com/en-us/library/hh849901.aspx).  
For example, say you want to fetch the contents of my blog's frontpage:  

~~~~ {.brush:ps}
(Invoke-WebRequest 'http://oneboredadmin.com').Content
~~~~

Or maybe you'd like just the title?  

~~~~ {.brush:ps}
(Invoke-WebRequest 'http://oneboredadmin.com').ParsedHtml.title
~~~~

Or if I want to download google's logo to a file:  

~~~~ {.brush:ps}
Invoke-WebRequest 'https://www.google.com/images/srpr/logo4w.png' -OutFile ~\Desktop\omgLogo.png
~~~~

Proxying through Fiddler was never easier:  

~~~~ {.brush:ps}
Invoke-WebRequest 'http://Some.Site.com' -Proxy 'http://localhost:8888'
~~~~

And lastly, if you want to hit your SharePoint site's homepage, but you
need to use kerberos authentication:  

~~~~ {.brush:ps}
Invoke-WebRequest 'http://SharepointServer/BestSite' -UseDefaultCredentials
~~~~

Easy webbing!

</p>

