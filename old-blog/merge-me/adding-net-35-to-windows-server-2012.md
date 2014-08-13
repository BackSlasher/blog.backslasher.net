Title: Adding .net 3.5 to a Windows Server 2012 template
Date: 2013-06-28 10:48
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, Windows, Virtualization, PowerShell
Slug: adding-net-35-to-windows-server-2012

I was approached by some colleagues building a new VM template for
Windows Server 2012 who wanted some help with .NET framework 3.5.  
  
<span style="font-size: large;">The .NET oddity</span>  
As anyone who messed a bit with Windows Server 2012 knows, the .NET
framework 3.5 is one of two features (along with PowerShell v2, contrary
to v3) whose status is "removed", meaning it's not installed <span
style="font-weight: bold;">and</span> the installation sources aren't
available in the Windows directory, so that in order to install it you
have to supply an installation source - either the "sources" folder from
the CD or access to the Microsoft Update service (and no, WSUS won't do
for now).   
  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-MsLzFPaAVx4/Uc1nnQW854I/AAAAAAAADpQ/fxAKHo-euwg/s320/AddNet1.png)](http://1.bp.blogspot.com/-MsLzFPaAVx4/Uc1nnQW854I/AAAAAAAADpQ/fxAKHo-euwg/s1003/AddNet1.png)

</div>

  

<div class="separator" style="clear: both; text-align: center;">

</div>

<span style="font-size: large;">Why I care</span>  
Contrary to Microsoft's optimistic view of the software world, almost
all modern .NET-based software run on version 3.5-, not on 4+, so I'm
going to have to install this feature on a lot of servers.  
  
<span style="font-size: large;">What we did</span>  
At first I saw two options:  

-   Avoid installing the feature, causing myself a serious amount of
    work (either some manual action or complicated scripting) every time
    I want to create a VM with .NET 3.5,
-   Install the feature on the template, causing all VMs to come
    equipped with the feature and relying on my colleagues (and
    future-self) to remove the feature where it's not needed (requires a
    restart) or expose the VM to unnecessary security/performance
    issues.

After some thinking and tinkering, I came up with a 3rd option - I'll
install the feature on the template then immediately remove it, changing
its state from "removed" to "available", thus making the feature itself
unavailable, but the installation sources present in Windows' "sources"
folder, meaning it can be easily installed in the future without
external media!  
  
<span style="font-size: large;">The Steps</span>  

1.  Get a model VM (clean setup of Windows Server 2012 is best)
2.  Make sure you have the additional sources. If you're connected to
    the internet, you're set. If not, get the "sources\\sxs" directory
    from the installation CD
3.  Add the feature and immediately remove it

~~~~ {.brush:ps}
Add-WindowsFeature Net-Framework-Core -Sources "SXSDIRECTORY"Remove-WindowsFeature Net-Framework-Core
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-3mFGWx30NhE/Uc1n09Iaq_I/AAAAAAAADpY/-9o4zFRH_-0/s320/AddNet2.png)](http://1.bp.blogspot.com/-3mFGWx30NhE/Uc1n09Iaq_I/AAAAAAAADpY/-9o4zFRH_-0/s1007/AddNet2.png)

</div>

4.  Restart the machine and verify

~~~~ {.brush:ps}
Restart-Computer...Get-WindowsFeature Net-Framework-Core
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-XIEZ-pv9Tqc/Uc1n_WctaeI/AAAAAAAADpg/Tci0C8BfZJQ/s320/AddNet3.png)](http://3.bp.blogspot.com/-XIEZ-pv9Tqc/Uc1n_WctaeI/AAAAAAAADpg/Tci0C8BfZJQ/s1006/AddNet3.png)

</div>

That's it!   
  

</p>

