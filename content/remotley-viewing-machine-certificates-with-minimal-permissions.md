Title: Remotely Viewing Machine Certificates With Minimal Permissions
Date: 2012-04-11 20:18
Tags: Security, PKI, Mysteries Solved, PowerShell, Active Directory
Category: Microsoft
Slug: remotley-viewing-machine-certificates-with-minimal-permissions
OldSlug: remotley-viewing-machine-certificates

We've started remotely monitoring our certificate stores on critical
servers, and wanted the monitoring software to be able to remotely
connect to our servers' personal certificate stores.  
I quickly found a script to enumerate all certificates in a specific
store on a remote computer:  
~~~powershell
function Get-Cert( $computer=$env:computername ){
$ro=[System.Security.Cryptography.X509Certificates.OpenFlags]"ReadOnly"
$lm=[System.Security.Cryptography.X509Certificates.StoreLocation]"LocalMachine"
$store=new-object System.Security.Cryptography.X509Certificates.X509Store("\\$computer\root",$lm)
$store.Open($ro)
$store.Certificates
}
~~~

However, as long as the user was not an administrator, it got "access is denied" whenever it tried to open the store (`$store.Open`).  
Since I don't want the monitoring software to have local admin rights on our servers (BAD habit), I tried troubleshooting the problem.  
I found out that the script works **locally** for every user, so it must be some sort of a remoting issue.  
After two hours of troubleshooting I found the problem -
non-administrators, by default, can't execute remote queries against the registry, which is where certificates are stored by default (as told by ProcMon while querying locally).  
So after granting the monitoring software remote registry permissions, according to [kb314837](http://support.microsoft.com/kb/314837),
suddenly opening the remote store worked perfectly.  
I could rage about it not being documented anywhere, but if everything was properly documented my work will be really boring... Have fun remote-querying!
