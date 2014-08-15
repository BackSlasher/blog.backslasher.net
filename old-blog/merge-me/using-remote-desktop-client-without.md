Title: Using Remote Desktop Client without Network Level Authentication
Date: 2013-11-12 18:07
Author: Nitzan Raz (noreply@blogger.com)
Tags: Security, Windows, Terminal Server
Slug: using-remote-desktop-client-without
OldSlug: using-remote-desktop-client-without

Whenever I use Remote Desktop to connect to an NT6+ (Windows Vista /
Windows Server 2008 and later) machine, I use Network Level
Authentication, meaning that authentication with the server is performed
before session is created (contrary to first connecting to the server
and using its GUI to enter the credentials). Usually this is a good
behavior, saving me from man-in-the-middle attacks.  
However, sometimes I wish to disable it at the client level, usually for
troubleshooting.  
Turns out it's not that easy. One can mandate NLA by using the
"Advanced" tab, under "Server Authentication":  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-DOIXiA-KCYA/UoEPKHcWHuI/AAAAAAAAEEs/bebkNw2lao0/s320/RDPwithoutNLA1.png)](http://1.bp.blogspot.com/-DOIXiA-KCYA/UoEPKHcWHuI/AAAAAAAAEEs/bebkNw2lao0/s1600/RDPwithoutNLA1.png)

</div>

  
but in order to avoid using it completely, you have to save your
connection as an RDP file using "Save As":  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-5bsp4obbkjs/UoEPKHChLNI/AAAAAAAAEE4/_Wx3oAriwNY/s320/RDPwithoutNLA2.png)](http://3.bp.blogspot.com/-5bsp4obbkjs/UoEPKHChLNI/AAAAAAAAEE4/_Wx3oAriwNY/s1600/RDPwithoutNLA2.png)

</div>

  
And then edit the file using notepad and add the line:

~~~~ {.brush:text}
enablecredsspsupport:i:0
~~~~

Sources:  
<http://technet.microsoft.com/en-us/library/ff393716%28v=ws.10%29.aspx>  
<http://support.microsoft.com/kb/941641>

</p>

