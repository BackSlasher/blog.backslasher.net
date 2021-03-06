---
title: Installing WSUS Prerequisites Easily in a Disconnected Server
categories:
- Microsoft
tags:
  - Scripts
  - PowerShell
  - WSUS
---

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
components without actually installing WSUS through the `ServerManager`
module:  

~~~~powershell
ipmo ServerManager;
Get-WindowsFeature OOB-WSUS | select -exp DependsOn | Add-WindowsFeature
~~~~
