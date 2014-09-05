Title: Disabling "generate Publisher Evidence" using scripts
Date: 2014-01-28 10:35
Category: Microsoft
Tags: Scripts, Windows, .NET framework, XML, PowerShell
Slug: disabling-generate-publisher-evidence
OldSlug: disabling-generate-publisher-evidence

I found the script we were using to disable authenticode on our machines, [a feature that causes great suffering](|filename|/stsadm-new-spsite-is-slow.md) (and dll-loading-delays) to workstations not connected to the Internet when using various Microsoft products (i.e. SQL Management Studio, SharePoint).  
Note the line at the end - the script tries to find all `machine.config`
files on the local machine, but you might want to modify other files
(remote machines, only version 4 etc.).  
Also, this script modifies windows configuration files, so make sure to
test critical systems afterwards (perhaps reboot the
server).<a name="more"></a>  

~~~~powershell
function Modify-Config([string]$filename,[string]$backupDir="~"){
 Write-Verbose "Loading XML $filename"
 $doc = new-object xml
 $doc.load($filename)
 Write-Verbose 'Locating parent node (/configuration/runtime)'
 $parent = $doc.SelectSingleNode('/configuration/runtime')
 if(!$parent){Write-Error 'Non-default xml. Stopping'}
 else{
  Write-Verbose 'Locating child node (generatePublisherEvidence)'
  $child = $parent.generatePublisherEvidence
  if(!$child){
   Write-Verbose 'Creating child node'
   $child = $doc.CreateElement('generatePublisherEvidence')
   $parent.AppendChild($child)
  }

  Write-Verbose 'Checking attribute "enabled"'
  if($child.enabled -ne $false){
   if(!$child.enabled){
    Write-Verbose 'Creating node "enabled"'
    $att = $doc.CreateAttribute('enabled')
    $child.Attributes.Append($att)
   }

   Write-Verbose 'Setting "enabled" to "false"'
   $child.enabled = $false

   # If modified, save
   Write-Verbose 'Backing up file'
   if($backupDir) {cp $filename -dest $backupDir}

   Write-Verbose 'Saving file'
   $doc.save($filename)
  }
 }
}

('Framework','Framework64') | %{"$env:windir\Microsoft.NET\$_"} | ?{test-path $_} | %{ls $_ -fi 'v*' | ?{$_.mode -like 'd*'}} | select -exp fullname | %{"$_\CONFIG\machine.config"} | ?{test-path $_} | %{Modify-Config $_}
~~~~
