Title: Opening Group Policy Management Editor from the Command Line
Date: 2013-03-19 18:12
Tags: Group Policy, Programming, Scripts, PowerShell, Active Directory
Slug: opening-group-policy-management-editor
OldSlug: opening-group-policy-management-editor

<p>
Yesterday I wanted to open the Group Policy editor (or "Group Policy
Management Editor") for a specific GP object through PowerShell, but
there is no "Edit-GPO" cmdlet. I quickly checked from the task manager
how the GPMC opens the editor, and made my own:  

~~~~ {.brush:ps}
function Edit-GPO([guid]$guid){$domain = Get-ADDomain# Operate on PDC to help consistency$server=$domain.PDCEmulator$PoliciesPath=("CN=Policies,"+$domain.SystemsContainer)$GPPath= "LDAP://{0}/CN={{{1}}},{2}" -f $server,$guid,$PoliciesPath#$GPPathgpme.msc "/GPOBJECT:`"$GPPath`""}
~~~~

My function binds to the PDC for the same reason the GPMC does - it
helps consistency. If you don't like it, you can modify the "\$server"
variable to point at something else.  
For example, this is how you open the gpme for the default domain
policy:  

~~~~ {.brush:ps}
Get-GPO 'Default Domain Policy' | %{Edit-GPO $_.Id}
~~~~

And this is how you open it for every GP with user settings enabled:  

~~~~ {.brush:ps}
Get-GPO -All | ?{$_.GpoStatus -band ([Microsoft.GroupPolicy.GpoStatus]::ComputerSettingsDisabled)} | %{Edit-GPO $_.Id}
~~~~

As always, the possibilities are endless.  
  
G'day!

</p>

