---
title: Wget in PowerShell v3
categories:
- Microsoft
tags:
  - HTTP
  - SharePoint
  - Scripts
  - PowerShell
  - HTML
---
	
I've been envying my \*nix brethren for having
[Wget](http://en.wikipedia.org/wiki/Wget) for a long time. To get the
contents of a web page or download a file using http I had to use
workarounds that took more than one command - either creating a new
System.Net.WebRequest or using a BITS module.  
Well - Since I started using PowerShell v3 I can be lazy once more,
thanks to
[Invoke-WebRequest](http://technet.microsoft.com/en-us/library/hh849901.aspx).  
For example, say you want to fetch the contents of my blog's frontpage:  
~~~~powershell
(Invoke-WebRequest 'http://backslasher.net').Content
~~~~

Or maybe you'd like just the title?  
~~~~powershell
(Invoke-WebRequest 'http://backslasher.net').ParsedHtml.title
~~~~

Or if I want to download google's logo to a file:  
~~~~powershell
Invoke-WebRequest 'https://www.google.com/images/srpr/logo4w.png' -OutFile ~\Desktop\omgLogo.png
~~~~

Proxying through Fiddler was never easier:  
~~~~powershell
Invoke-WebRequest 'http://Some.Site.com' -Proxy 'http://localhost:8888'
~~~~

And lastly, if you want to hit your SharePoint site's homepage, but you
need to use kerberos authentication:  

~~~~powershell
Invoke-WebRequest 'http://SharepointServer/BestSite' -UseDefaultCredentials
~~~~

Easy webbing!
