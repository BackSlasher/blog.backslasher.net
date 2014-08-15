Title: Auto-Sorting Computers in WSUS
Date: 2010-08-04 05:03
Tags: Scripts, PowerShell, WSUS
Slug: auto-sorting-computers-in-wsus
OldSlug: auto-sorting-computers-in-wsus

<p>
Hello.  
When I installed my first WSUS server, I liked the idea of
auto-assigning computers into different WSUS groups according to domains
using the group policy's settings. However, it's a bummer to find out
that you can only assign every computer to**one** group using GP (and
not being able to manually assign), or avoid GP groups **at all** and
assign computers manually. Eventually I ended up creating this PS
script, that checks for unassigned computers nightly, and assigns them
to the right groups:  
  

~~~~ {.brush: .ps}
<#.SYNOPSISSorts unassigned WSUS clients into domain-matching groups.DescriptionThis scripts loops over all unassigned computer records in WSUS, and assigns each one to the group with a name matching it's single-lable domain name, if such a group exists..EXAMPLESort-WSUSComputers.ps1 'WSUS1'.LINKMy Blog: http://OneBoredAdmin.blogspot.com#>param([parameter(Mandatory=$true)][string]$wsusServer)$dnsDomain = $env:USERDNSDOMAIN;$Domain = $env:USERDOMAIN;$topDomain = $dnsDomain -replace ('^'+[regex]::escape($Domain)),''$ErrorActionPreference = 'stop';[reflection.assembly]::LoadWithPartialName("Microsoft.UpdateServices.Administration")$wsus = [Microsoft.UpdateServices.Administration.AdminProxy]::GetUpdateServer($wsusServer,$false);# locate the "unassigned" group$Unassigned = ($wsus.GetComputerTargetGroups() | ?{$_.Name -eq 'Unassigned Computers'}).GetComputerTargets();$Unassigned | %{    $Domain = ($_.FullDomainName -replace '(^[^\.]+\.)|('+[regex]::escape($topDomain)+'$)','');        # Find the matching group    $Group = ($wsus.GetComputerTargetGroups() | ?{$_.Name -eq $Domain});        # Add the computer    if($Group) {$Group.AddComputerTarget($_)}}
~~~~

</p>

