---
title: Opening Group Policy Management Editor from the Command Line
categories:
- Microsoft
tags:
  - Group Policy
  - Programming
  - Scripts
  - PowerShell
  - Active Directory
---

Yesterday I wanted to open the Group Policy editor (or "Group Policy
Management Editor") for a specific GP object through PowerShell, but
there is no "Edit-GPO" cmdlet. I quickly checked from the task manager
how the GPMC opens the editor, and made my own:

~~~powershell
function Edit-GPO([guid]$guid){
$domain = Get-ADDomain
# Operate on PDC to help consistency
$server=$domain.PDCEmulator
$PoliciesPath=("CN=Policies,"+$domain.SystemsContainer)
$GPPath= "LDAP://{0}/CN={1},{2}" -f $server,$guid,$PoliciesPath
#$GPPath
gpme.msc "/GPOBJECT:`"$GPPath`""
}
~~~

My function binds to the PDC for the same reason the GPMC does - it
helps consistency. If you don't like it, you can modify the `$server`
variable to point at something else.  
For example, this is how you open the gpme for the default domain
policy:  

~~~powershell
Get-GPO 'Default Domain Policy' | %{Edit-GPO $_.Id}
~~~

And this is how you open it for every GP with user settings enabled:  

~~~powershell
Get-GPO -All | ?{$_.GpoStatus -band ([Microsoft.GroupPolicy.GpoStatus]::ComputerSettingsDisabled)} | %{Edit-GPO $_.Id}
~~~
