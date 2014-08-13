Title: Checking for conflicting oIDs
Date: 2010-12-24 22:16
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, PowerShell, Active Directory
Slug: checking-for-conflicting-oids

<p>
Hi everyone.  
I got word that this script was useful for some other IT team, so it's
definitely blog-worthy!  
<span style="font-size: large;">The story</span>  
<span style="font-size: large;"><span style="font-size: small;">I've
inherited some AD forests with their schema extended by in-house
software, using oIDs belonging to an MS pool, meaning that those numbers
might be used by future schema extensions by MS and friends. A very
uneasy situation, because whenever I want to extend the schema we get a
PFE to hold our hand while doing it, in case there's a conflict. When we
prepared the schema for a 2008R2 DC, I've created this nifty script to
search for our schema entries and compare their oIDs to the ones in the
ldf files that adPrep is using, to see if there are any
conflicts.</span></span>  
<span style="font-size: large;"><span style="font-size: small;">Of
course, this script is no replacement to backing up the forest, and
maybe extending the schema in a lab before doing the real deal - It'll
just help you see if there are obvious conflicts.</span></span>  
<span style="font-size: large;"><span
style="font-size: small;">Enjoy!</span></span>  
  
<span style="font-size: large;"><span
style="font-size: small;"></span></span>  
<span style="font-size: large;">The script</span>  
  

~~~~ {.brush: .ps}
<#.SYNOPSISChecks for conflicting OIDs in the current AD Schema and some ldf files.DESCRIPTIONThis script should be used to examine piratly-extended schemas (ones that were extended with oID not belonging to an isolated pool) before further extending them.This script collects all oIDs from the schema partition of the current forest, and from all .ldf files in a specified folders, and tries to find conflicting ones.If found, the conflicting AD object is presented..EXAMPLECheck-ConflictingOIDs.ps1 -objectPattern 'MyApp*' -ldfPath 'C:\OCS 2007R2\'Compares all objects starting with "MyApp" with all .ldf files found in "C:\OCS 2007R2\".LINKMy Blog: http://OneBoredAdmin.blogspot.com#>param([string]$objectPattern = '*',[string]$ldfPath = '.')# Get all OIDs from ADipmo active*pushd ad:\ls *schem* | cd$ADIs = ls  | ?{$_.name -like $objectPattern} | ?{$_.objectClass -eq 'classSchema'} | Get-ADObject -prop 'governsId' | select Name,@{Name='uID' ;Expression= {$_.governsId}}$ADIs += ls  | ?{$_.name -like $objectPattern} | ?{$_.objectClass -eq 'attributeSchema'} | Get-ADObject -prop 'attributeID' | select Name,@{Name= 'uID';Expression= {$_.attributeID}}popd# Get all OIDs from Filepushd $ldfPath$files = ls *.ldf;$FSIs = $files | Get-Content | ?{$_ -match '(governsID)|(attributeID):'} | %{$_ -replace '^.+: ',''}popd;# Compare all AD-OIDs to FS-OIDs$bFound = $false$ADIs | %{if($FSIs -contains $_.uID) {    if(!$bFound) {        $bFound = $true;        write-host 'CONFLICT FOUND!'        }    $_;    }}
~~~~

</p>

