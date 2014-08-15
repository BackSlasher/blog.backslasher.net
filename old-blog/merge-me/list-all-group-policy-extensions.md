Title: List all Group Policy Extensions Registered
Date: 2014-01-10 20:25
Tags: Group Policy, Scripts, Windows, PowerShell, Registry, One-Liner, Active Directory
Slug: list-all-group-policy-extensions
OldSlug: list-all-group-policy-extensions

<p>
I use this script to see all GP extensions that my computer can
process:  

~~~~ {.prettyprint .lang-posh}
ls 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon\GPExtensions' | select `    @{name='Guid';expression={[guid]$_.pschildname}}    @{name='Name';expression={$_.GetValue('')}}    @{name='DllName';expression={$_.GetValue('DllName')}}    @{name='ProcessWhenNoChanges';expression={!$_.GetValue('NoGPOListChanges')}}    @{name='IsUserPolicy';expression={!$_.GetValue('NoUserPolicy')}}
~~~~

Group Policy Extensions are the parts that apply the information found
in Group Policy objects to the computer / user. While most settings are
done via "Administrative Templates", there are other extensions (48
counted on my Windows 8 workstation).  
Each extension registers a dll (the code that reads data from the GPO
and actually applies it), a GUID, a friendly name (some don't) and
instructions whether it's also a user policy (like "Deployed Printers",
unlike "IPsec") and if it wants to process the Group Policy even if no
settings were changed since last time ("Folder Redirection" does,
"Internet Explorer Branding" doesn't).  
**Note:** The last two values are stored as inversions (e.g.
"NoUserPolicy") but I "fixed" them when parsing the key.   
Further reading:  
[Writing a Group Policy
Extension](http://msdn.microsoft.com/en-us/library/aa375118%28v=vs.85%29.aspx)
(not our case, but still has some useful data)

</p>

