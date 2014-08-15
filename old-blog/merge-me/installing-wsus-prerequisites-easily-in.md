Title: Installing WSUS Prerequisites Easily in a Disconnected Server
Date: 2012-04-27 08:08
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, PowerShell, WSUS
Slug: installing-wsus-prerequisites-easily-in
OldSlug: installing-wsus-prerequisites-easily-in

<p>
Our company has an internet-isolated environment, and I was requested to
create a WSUS infrastructure there.  
The most annoying thing about installing a disconnected WSUS server is
that you can't do it via the server manager (because it requires a
working internet connection) but rather through an exe file, and that
file won't install the prerequisites, just complain that some of them
are missing (without informing you which ones), compared to the
automatic prerequisite installation of the server manager.  
Well, problem solved through the power of scripting!  
The following line of code will install all of WSUS's windows-related
components without actually installing WSUS through the "ServerManager"
module:  

~~~~ {.brush:ps}
ipmo ServerManager;Get-WindowsFeature OOB-WSUS | select -exp DependsOn | Add-WindowsFeature
~~~~

</p>

