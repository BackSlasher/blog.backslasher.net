Title: Lowercasing PTR records in DNS
Date: 2011-02-26 18:51
Author: Nitzan Raz (noreply@blogger.com)
Tags: DNS, Scripts, PowerShell
Slug: lowercasing-ptr-records-in-dns

<p>
Hi.  
Recently, one of the IT crowd informed me that he can't delete some of
his PTR records through the DNS management console (dnsmgmt.msc). The
record would appear to be deleted, but it'll still show up after
refreshing. After some quick Googling I found
[kb842127](http://support.microsoft.com/kb/842127), which says that PTR
records with uppercase characters in the host name can't be deleted. The
KB offers a hotfix (included with 2003sp1) that stops Windows from
creating such records, but doesn't handle existing ones. Microsoft
suggests using some Middle-Ages method with exporting the records to a
file, manually editing it, and scripting the deletion / recreation.  
I thought that their method was tiring, so I made this script. It'll
search for PTR records containing uppercase characters, delete them
using dnscmd.exe (because using WMI won't work) and create a lowercase
version.  
**Note:** This script won't take into account TTLs, timestamps and other
record attributes.  

~~~~ {.brush: .ps}
param(# If no DC is specified, find one$dc = [system.directoryservices.activedirectory.domaincontroller]::FindOne((new-object System.DirectoryServices.ActiveDirectory.DirectoryContext 'Domain')).Name,[bool]$forReal=$true)$reg = [regex]'[A-Z]';$recs = @(gwmi -comp $dc -namespace 'root/microsoftdns' 'MicrosoftDNS_PTRType' | ?{$reg.IsMatch($_.RecordData)})if($recs) {$recs | %{    $container = $_.ContainerName; # 1.in-addr.arpa    $record = $_.RecordData; # CompName.contoso.com.    $lowerRecord = $_.RecordData.tolower()    $owner = $_.OwnerName; # 4.3.2.1.in-addr.arpa    $shortOwner = $owner.subString(0,$owner.length - $container.length - 1); # 4.3.2    if($forReal) {dnscmd $dc /RecordDelete "$container." $shortOwner PTR /f | out-null}    if($forReal){([wmiclass]"\\$dc\root\MicrosoftDNS:MicrosoftDNS_PTRType").CreateInstanceFromPropertyData($DNSServer,$container,$owner,$null,$null,$lowerRecord) | out-null}    $ret = new-object object;    $ret | add-member NoteProperty 'InArpa' $owner;    $ret | add-member NoteProperty 'From' $record;    $ret | add-member NoteProperty 'To' $lowerRecord;    $ret | add-member NoteProperty 'ForReal' $forReal;    $ret} }
~~~~

Enjoy!

</p>

