Title: Applying SPWebConfigModification objects safely
Date: 2013-03-01 18:47
Tags: ASP.net, SharePoint, Scripts, Web.Config, PowerShell
Slug: applying-spwebconfigmodification
OldSlug: applying-spwebconfigmodification

Hi.  
My SharePoint team and I wanted to move to
[SPWebConfigModification](http://msdn.microsoft.com/en-us/library/microsoft.sharepoint.administration.spwebconfigmodification.aspx)
rather that just modifying the web.config file manually, but I was
always worried that applying faulty modifications will ruin my file.
Why?  
<span style="font-size: large;">How SPWebConfigModification objects
work</span>  
Some code requires you to modify the SharePoint web application's
web.config file. SharePoint handles some modifications automatically,
such as SafeControl entries for controls deployed via WSPs. But you
might want to add an SQL connection string, or some custom HTTP modules
(axd files).  
You can obviously change the web.config files manually, but:  

-   It's easy to lose track of your modifications
-   Every new server's config has to be updated manually
-   You could get inconsistent config files between your servers

Microsoft's solution - SPWebConfigModification! These objects are stored
inside the SPWebApplication, and every one of them represents a single
modification to its parent's web.config file. It has four important
properties:  

+--------------------------------------+--------------------------------------+
| Type                                 | What type of modification is         |
|                                      | defined. It can be:\                 |
|                                      | -   **EnsureChildNode:** Adds an     |
|                                      |     element as a child to the        |
|                                      |     specified parent (i.e.           |
|                                      |     \<parent\>\<bla                  |
|                                      |     blu="bli"\>\</parent\>)          |
|                                      | -   **EnsureAttribute:** Adds an     |
|                                      |     attribute to the parent (i.e.    |
|                                      |     \<parent blu="bli" \>). The      |
|                                      |     attribute can already exist.     |
|                                      | -   **EnsureSection:** Adds a        |
|                                      |     section as a child to the        |
|                                      |     specified parent. A "section" is |
|                                      |     an empty element, and removing   |
|                                      |     the SPWebConfigModification      |
|                                      |     won't remove the element, so I   |
|                                      |     don't use it.                    |
+--------------------------------------+--------------------------------------+
| Path                                 | An XPath expression pointing the     |
|                                      | modification's parent.\              |
|                                      | Used only when removing the          |
|                                      | modification                         |
+--------------------------------------+--------------------------------------+
| Name                                 | The name of the modification.\       |
|                                      | If its type is EnsureChildNode, it's |
|                                      | an XPath executed on the parent and  |
|                                      | used to locate the node when it      |
|                                      | needs to be removed.\                |
|                                      | If its type is EnsureAttribute, it's |
|                                      | simply the attribute's name.         |
+--------------------------------------+--------------------------------------+
| Value                                | The actual modification. If it's an  |
|                                      | EnsureChildNode, it's the entire     |
|                                      | node (\< item                        |
|                                      | attribute="value"\>\<stuff\>\</item\ |
|                                      | >)\                                  |
|                                      | If its type is EnsureAttribute, it's |
|                                      | simply the attribute's value         |
+--------------------------------------+--------------------------------------+

  
There are many complaints about SPWebConfigModifications that can be
easily found by googling (binging?) SPWebConfigModifications, but my
biggest problem with it was that it was simply unsafe to use -
SharePoint offers no validation for these objects.  
You may find yourself with modifications that weren't applied due to a
missing parent, or modifications that won't be deleted from the
web.config because the name isn't written correctly (the XPath returns
nothing, or the wrong node), and without SharePoint admitting that the
modifications failed to execute.  
After some research, I built this script.  
Using this script will help make sure your SPWebConfigModifications
won't break, either now or during their removal. You can even use a
blank CSV to validate your current modifications!  
  
<span style="font-size: large;">The inner workings</span>  
Apply-WebConfigModifications applies web.config modifications (duh) from
a csv file thusly:  

<ol>
<li>
Finds all relevant SPWebApplications

</li>
<li>
For every one, loads a CSV file containing all of the web modifications
required on the web application

</li>
<li>
Fetches all existing web modifications from the web application

</li>
<li>
Creates an action list, classifying each modification as either add,
delete or unchanged (instead of updating it deletes and adds the
modification again, probably safer)

</li>
<li>
Loads the local web.config, and simulates the web modification process,
making sure for each modification:

</li>
1.  If the modification should be added, that no element matching the
    path/name XPath already exists, and that after adding the element, a
    single element matching the XPath exists.
2.  If it should be deleted / unchanged, that a single element matching
    the path/name exists.

It also actually performs those actions (without saving the file,
obviously), and makes sure that there are no clashing modifications (for
example, that an element that's about to be removed isn't used by a new
element).

<li>
The user gets a report of every modification and its errors, and if the
user approves, the web modifications are actually updated in the
SharePoint farm (removals first, additions later)

</li>
<li>
A mutex (added to the SPFarm's property bag) is used to make sure that
only one script runs at a time.

</li>
</ol>
<span style="font-weight: normal;"><span
style="font-size: large;">Additional features:</span></span>  

-   Interactive mode - can be disabled when executing using a scheduled
    task or another non-interactive way, which then applies the
    modifications if there are no errors, and aborts if there are
-   Force, which applies the modifications even if there are errors

<span style="font-size: large;"><span
style="font-weight: normal;">Parameters: </span></span>  

-   **WebAppUrls**- An array of urls, names or port numbers (e.g. '80')
    that need their WebConfigModifications updated. Each webapp will
    need to have a matching file in the source directory called
    WebWEBAPPNAME.csv
-   **SourceDir** - The directory containing the CSV files
-   **Interactive** - Ask the user if there are simulation errors (or
    automatically abort instead)
-   **testInternaly**- Simulate changes to the web.config before
    actually applying the modifications
-   **whatIf**- Actually apply the modifications
-   **Force**- Ignore simulation errors and apply anyway
-   **ShowUnchanged**- Report unchanged values to the console (or just
    the changed ones).
-   **UseMutex**- Use the mutex system
-   **MutexPhrase**- The PropertyBag key used for the mutex
-   **ModificationString**- The owner of the new SPWebConfigModification
    objects

<span style="font-size: large;">Migrating to
SPWebConfigModifications:</span>  
Moving to WebConfigModifications is complicated for whoever is
responsible to maintain the web.config, and nerve-stretching for the
sysadmin. You have to make sure that:  

-   All modifications are tested in pre-production environments, in
    order to avoid last-moment changes in the file
-   No one should be allowed to modify the web.config manually, or via
    means other than SPWebConfigModifications - even other programs or
    via the IIS console. Inconsistency can ruin the modifications, as
    they might be applied differently to different servers around your
    farm. You can try finding the modification that the software is
    supposed to do, and adding it in the csv.
-   Each modification file is applied to a different web application -
    create multiple CSVs if needed

  

And for the script in all its wonder:  

~~~~ {.brush:ps}
param([string[]]$WebAppUrls=@('80'),[Parameter(Mandatory=$true)][string]$SourceDir = 'C:\temp\Config\',[bool]$Interactive=$true,#Tests[bool]$testInternaly=$true,[Switch]$whatIf=$false,[Switch]$Force=$false,[bool]$ShowUnchanged=$true,#Mutex[bool]$UseMutex=$true,[string]$MutexPhrase='OBAWebConfigModifications',#Modification[string]$ModificationString='OBA')if(!(gsnp |?{$_.name -match 'sharepoint'})) {asnp *sharepoint*}#$ErrorActionPreference = 'stop'function Wait-ConfigTimerJob([string]$webAppUrl,[string]$Action){$stop = new-object diagnostics.stopwatch    $stop.Start()    while(Get-SPTimerjob job-webconfig-modification){        $waitTime = $stop.Elapsed.ToString() -replace '\.\d+$',''        Write-Progress "Applying Modifications - $webAppUrl - $Action" "Waiting for modification to finish for $waitTime" -PercentComplete ($sec % 100)        Start-Sleep -sec 1    }}function Get-NodeParent($doc,$node,$errorAction){$parents = @($doc.SelectNodes($node.Path));if($parents.Count -eq 0) {Write-Error 'No matching parent found' -ErrorAction:$errorAction}elseif($parents.Count -gt 1) {Write-Error 'Too many parents found' -ErrorAction:$errorAction}else {$parents[0]}}function Compare-Node($n1,$n2){(($n1.Path -ceq $n2.Path) -and($n1.Name -ceq $n2.Name) -and($n1.Value -ceq $n2.Value) -and($n1.Type.toString() -ceq $n2.Type.toString()))}if($UseMutex -and !($whatIf)){    # Check mutex    if((Get-SPFarm).Properties.ContainsKey($MutexPhrase)) {        # Extract mutex        $currentMutex = ConvertFrom-CSV ((Get-SPFarm).Properties[$MutexPhrase])        Write-Warning $currentMutex -WarningAction 'Inquire'    }        # Apply mutex    $myMutex = 'a' | select @{Name='pID';Expression={$pID}},                            @{Name='UserName';Expression={$env:Username}},                            @{Name='Server';Expression={$env:ComputerName}},                            @{Name='StartTime';Expression={[datetime]::Now.ToString('hh:mm:ss')}}    (Get-SPFarm).Properties[$MutexPhrase] = (ConvertTo-Csv $myMutex)}##STARTforeach($webAppUrl in $webAppUrls){try{    # Load config    if($webAppUrl -match '^\d+$') {        $candidates = @(Get-SPWebApplication | ?{([uri]($_.url)).port -eq $webAppUrl})        if ($candidates.count -eq 1) {$webApp = $candidates[0]}        elseif($candidates.count -eq 0) {continue; <#Skip this port#>}        else {write-error 'No single matching WebApp found' -ErrorAction 'stop'}    }else {$webApp = Get-SPWebApplication $webAppUrl}    $configPath = join-path ($webApp.IisSettings[[Microsoft.SharePoint.Administration.SPUrlZone]'Default'].Path) 'web.config'    $config = [xml]([IO.File]::ReadAllText($configPath))    # Find modificationsFile    $modificationsFile = join-path $SourceDir ('Web'+$webAppUrl+'.csv')    if(!(Test-Path $modificationsFile)) {write-error "Excpected file '$modificationsFile' not found for $webAppUrl" -ErrorAction 'stop'}        # Load modifications from file    $newModifications = @(Import-Csv $modificationsFile | ?{$_.Path})    # Load current modifications    $currentModifications = $webApp.WebConfigModifications    # Create action list        # Remove entries found in currentModifications but not in newModifications        $actionList = @();        $currentModifications | ?{$cur = $_; !($newModifications | ?{Compare-node $cur $_})} | %{        #$objNew = new-object object;        $objNew = $_ | select Path,Name,Type,Value,@{Name='WebApp';Expression={$webAppUrl}}        $objNew | Add-Member NoteProperty 'Action' 'Remove'        $objNew | Add-Member NoteProperty 'Err' ''        $actionList+=$objNew;        }                # Add entries found in newModifications but not in currentModifications        if($newModifications.count){                $newModifications | ?{$new = $_; !($currentModifications | ?{Compare-node $new $_})} | %{            #$objNew = new-object object;            $objNew = $_ | select Path,Name,Type,Value,@{Name='WebApp';Expression={$webAppUrl}}            $objNew | Add-Member NoteProperty 'Action' 'Add'            $objNew | Add-Member NoteProperty 'Err' ''            $actionList+=$objNew;            }        }        # Mark entries found in both        $currentModifications | ?{$cur = $_; ($newModifications | ?{Compare-node $cur $_})} | %{            $objNew = $_ | select Path,Name,Type,Value,@{Name='WebApp';Expression={$webAppUrl}}            $objNew | Add-Member NoteProperty 'Action' 'Unchanged'            $objNew | Add-Member NoteProperty 'Err' ''            $actionList+=$objNew        }    # Simulate actions on $config    if($testInternaly){        # Remove nodes        $actionList | ?{$_.Action -eq 'Remove'} | %{            $action = $_;            try{                $parent = Get-NodeParent $config $_                if($parent -eq $null) {$_.err+='Parent not found'}                else{                    if($_.type -eq 'EnsureAttribute') {                        $item = $parent.Attributes.GetNamedItem($_.name)                        if($item) {<#Fake remove, because has no effect#>}                        else {$_.err+='Attribute not found'}                    }                    elseif($_.type -eq 'EnsureChildNode'){                        $items = @($parent.SelectNodes($_.name));                        if($items.count -eq 0) {$_.err='Child node not found'}                        elseif($items.count -gt 1){$_.err+='Too many matching child nodes found'}                        else {                            $item = $items[0];                            # Remove item                            $parent.RemoveChild($item) | out-null;                        }                    }                    else{$_.err+='Invalid type'}                }            }            catch{$action.err+=$_}            if($_.err) {Write-Error $_.err}        }                # Add nodes        $actionList | ?{$_.Action -eq 'Add'} | %{            $action = $_;            try{                $parent = Get-NodeParent $config $_;                if($parent -eq $null) {$_.err+='Parent not found'}                else{                    if($_.type -eq 'EnsureAttribute') {                        # Adding has no effect                    }                    elseif($_.type -eq 'EnsureChildNode'){                        $items = @($parent.SelectNodes($_.name));                        if($items.count -eq 0) {                            $parent.innerXml+=$_.Value                            # Make sure now node exists!                            if(!$parent.SelectNodes($_.name).count) {                                $_.err+='Node was added, but was not found by name.'                            }                        }                        else{$_.err+='Matching child node already exists'}                    }                    else{$_.err+='Invalid type'}                }            }            catch{$action.err+=$_}            if($_.err) {Write-Error $_.err}        }                # Verify existing nodes        $actionList | ?{$_.Action -eq 'Unchanged'} | %{            $action = $_;            try{                $parent = Get-NodeParent $config $_;                if($parent -eq $null) {$_.err+='Parent not found'}                else{                    if($_.type -eq 'EnsureAttribute') {                        # Make sure attribute still exists                        if($parent.Attributes.GetNamedItem($_.name) -eq $null){                            $_.err+='Attribute is missing'                        }                    }                    elseif($_.type -eq 'EnsureChildNode'){                        $items = @($parent.SelectNodes($_.name));                        if($items.count -eq 0) {                            $_.err+='Name not found'                        }                        elseif($items.count -eq 1){                            # Do nothing, success finding node                        }else{                            $_.err+='Duplicate names detected'                        }                    }                    else{$_.err+='Invalid type'}                }            }            catch{$action.err+=$_}            if($_.err) {Write-Error $_.err}        }            }    # Review results    $actionList | ?{$ShowUnchanged -or ($_.Action -ne 'Unchanged')}    if(!$ShowUnchanged){        $hiddenCount = $actionList | ?{$_.Action -eq 'Unchanged'} | measure | select -exp count        if($hiddenCount -gt 0) {Write-Warning ("There are $hiddenCount unchanged values hidden") -WarningAction 'Continue';}    }        $errorCount = (@($ActionList | ?{$_.Err}).Count)    if($Interactive){        Write-Warning ("There are $errorCount errors during simulation. Proceed?") -WarningAction 'Inquire'        }    else{        if($errorCount) {            if(!$Force){                throw "Found $errorCount errors. Aborting"            }else{                Write-Warning "Found $errorCount errors. Carrying on because FORCE is specified"            }        }else {            # Do nothing, modifications will be applied        }    }    # Remove / Add SPWebConfigModifications    if($whatIf){        Write-Host 'Whatif: applying changes'    }else{        #Remove nodes        if($UseMutex){            # Extract mutex            $currentMutex = ConvertFrom-CSV ((Get-SPFarm).Properties[$MutexPhrase])            if($myMutex.toString() -ne $currentMutex.toString()){                Write-Warning ("Wrong mutex is present :"+$currentMutex) -WarningAction 'Inquire';            }        }        $actionList | ?{$_.Action -eq 'Remove'} | %{            $action = $_;            #$removables = @($webApp.WebConfigModifications | ?{($_.Path -eq $Action.Path) -and ($_.Name -eq $Action.Name) -and ($_.Value -eq $Action.Value) -and ($_.Type.toString() -eq $Action.Type.toString())})            $removables = @($webApp.WebConfigModifications | ?{Compare-Node $_ $Action})            if($removables.count -eq 0) {write-error 'Could not find matching WebConfigModification' -ErrorAction 'Inquire'}            else {$removables | %{$webApp.WebConfigModifications.Remove($_) | out-null}}        }                #Apply        $method = [microsoft.Sharepoint.Administration.SPServiceCollection].getMethod('GetValue',[string]).MakeGenericMethod([Microsoft.Sharepoint.administration.SPWebService])        $service = $method.Invoke($webApp.Farm.Services,'')        $webapp.Update()        $service.ApplyWebConfigModifications()                Wait-ConfigTimerJob $webApp.url 'Removing'                $actionList | ?{$_.Action -eq 'Add'} | %{            $modification = new-object 'Microsoft.SharePoint.Administration.SPWebConfigModification';            $modification.Name = $_.Name            $modification.Path = $_.Path            $modification.Value = $_.Value            $modification.Type = $_.Type            $modification.Owner = $ModificationString            $webApp.WebConfigModifications.Add($modification);        }                #Apply        $method = [microsoft.Sharepoint.Administration.SPServiceCollection].getMethod('GetValue',[string]).MakeGenericMethod([Microsoft.Sharepoint.administration.SPWebService])        $service = $method.Invoke($webApp.Farm.Services,'')        $webapp.Update()        $service.ApplyWebConfigModifications()                Wait-ConfigTimerJob $webApp.url 'Adding'    }##END}catch{$_}}if($UseMutex){    (Get-SPFarm).Properties.Remove($MutexPhrase)}
~~~~

Happy Scripting!

</p>

