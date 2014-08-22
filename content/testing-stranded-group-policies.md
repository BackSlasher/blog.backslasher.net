Title: Testing stranded group policies
Date: 2010-08-18 16:13
Category: Microsoft
Tags: Group Policy, NTFRS, PowerShell, Active Directory
Slug: testing-stranded-group-policies
OldSlug: testing-stranded-group-policies

Ever had GPO Version differences between the AD and the Sysvol? Sure,
you might have a healthy FRS/DFSR architecture, but the replication takes
time. It's annoying to check if the GP object is now OK on every server,
because one would have to point the GPMC to every DC and check the
version numbers...  
My soultion - this nifty script. It's essentially grabbing the GP object
through `Get-GPO` from every DC there is, and comparing its AD and Sysvol
versions (for both `computer` and `user`), and pointing out if this DC's version
is mismatched. Run this script once, and you'll know how the GP's doing
on every (accessible) DC.  
  

~~~~powershell
if(-not gmo GroupPolicy) {ipmo GroupPolicy}
<#
.SYNOPSIS
Gets a GPO object from every DC in the domain, and looks for stranded GPOs
 
.Description
This function discovers all DCs in your domain, gets the GPO specified for every DC, and for every object checks all 4 versions (DS/Sysvol and Computer/User) to see if a gpo is only partially updated on a DC.
 
.Parameter GPOName
 
.EXAMPLE
Test-StrandedGPO 'Some Policy Name'
.LINK
My Blog: http://OneBoredAdmin.blogspot.com
#>
function Test-StrandedGPO
{
    param(
    [parameter(Mandatory=$true)]
    [string]$GPOName
    )
     
    # Get all DCs
    $DCs = ([directoryservices.directorysearcher]'(&(&(&(sAMAccountType=805306369)(useraccountcontrol:1.2.840.113556.1.4.804:=67117056))))').findAll() | %{$_.Properties['cn'][0]}
     
    # For every DC, get the GP object
    $GPObjects = $DCs | %{
        $temp = Get-GPO -Name $GPOName -Server $_
        $temp | Add-Member NoteProperty 'Server' $_;
        $temp;
        };
    $server = $_;
    # For every GP object, check if the version is consistent
    $GPObjects | %{
        $objRet = new-object object;
        $objRet | add-member NoteProperty 'DisplayName' ($_.DisplayName)
        $objRet | add-member NoteProperty 'Server' ($_.Server)
        $objRet | add-member NoteProperty 'ComputerDS' ($_.Computer.DSVersion)
        $objRet | add-member NoteProperty 'ComputerSys' ($_.Computer.SysvolVersion)
        $objRet | add-member NoteProperty 'UserDS' ($_.User.DSVersion)
        $objRet | add-member NoteProperty 'UserSys' ($_.User.SysvolVersion)
        [bool] $VMismatch = !(($_.Computer.DSVersion -eq $_.Computer.SysvolVersion) -and ($_.User.DSVersion -eq $_.User.SysvolVersion))
        $objRet | add-member NoteProperty 'VersionMismatch' ($VMismatch)
         
        $objRet
    }
}
~~~~
