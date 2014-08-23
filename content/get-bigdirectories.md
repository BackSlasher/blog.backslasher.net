Title: Get-BigDirectories
Date: 2010-07-29 10:23
Category: Microsoft
Tags: Scripts, FileSystem, PowerShell
Slug: get-bigdirectories
OldSlug: get-bigdirectories

**Note**: This script is better than just `ls -rec | measure`, because measure measures only one field, and when iterating over many files and directories, every iteration counts.

Whenever our roaming profiles folder gets too big, we have to prune the
profiles that are both old and heavy. Using windows explorer, it's easy
enough to see the size of a specific folder, but the `last modified`
date is misleading, because files in that folder may have changed while
the folder stayed the same. PowerShell to the rescue!  

~~~powershell
<#
.SYNOPSIS
Searches and possibly deletes old and big folders
 
.DESCRIPTION
This script recursively checks folders for files, marking for every first-level folder
the sum of all of it's files size, and the latest WriteTime of a file.
If required, the script deletes folders that are both old enough and big enough.
 
.PARAMETER Path
The location of the folder to scan. Default is current folder.
 
.PARAMETER Delete
Whether to delete the matching folders, or just to point them out
 
.PARAMETER MinSizeMB
The minimum size of a folder to be deleted, in MBs. Default is 5MB
 
.PARAMETER MinYearsOld
The minimum age of a folder to be deleted, in years. Default is 1 year
 
.LINK
My Blog: http://OneBoredAdmin.blogspot.com
#>
param(
[string]$Path='.',
[bool]$Delete=$false,
[int]$MinSizeMB=5,
[int]$MinYearsOld=1
)
pushd $Path
$res = $null
ls . | %{
 
$totalSize = 0;
$lastModified = $_.LastWriteTime;
ls $_ -Recurse | %{$totalSize+=$_.Length;if($lastModified -lt $_.LastWriteTime){$lastModified = $_.LastWriteTime} }      
$_ | Add-Member -MemberType noteproperty 'TotalSizeMB' (($totalSize/1024/1024).toString('F'));
$_ | Add-Member -MemberType noteproperty 'LastModified' $lastModified;
$del = ((([int]$_.TotalSizeMB) -ge $MinSizeMB) -and ($_.LastModified.addYears($MinYearsOld) -le [datetime]::now))
$_ | Add-Member -MemberType noteproperty 'ShouldDelete' $del;
if($Delete -and $del){rm $_ -Recurse -Force;$_;}
$_;
} | tee -var 'res' | select name,TotalSizeMB,LastModified,ShouldDelete | out-gridview
popd;
~~~
