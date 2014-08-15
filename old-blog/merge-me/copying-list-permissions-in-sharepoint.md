Title: Copying List Permissions in SharePoint 2010
Date: 2013-01-05 17:31
Tags: SharePoint, Scripts, PowerShell
Slug: copying-list-permissions-in-sharepoint
OldSlug: copying-list-permissions-in-sharepoint

I just wrote a small script to copy permissions from one SharePoint list
to the other.  
<span style="font-size: large;">Things to consider:</span>  

-   **Custom permission levels are not preserved:** For some reason, my
    method of copying permissions isn't custom-permission-level
    friendly. The customized permissions will still be copied, but an
    auto-generated permission level will be used.
-   **Only same-web list tested:** I only tested copying permissions
    between two lists in the same web (site). If you tweak the script to
    work on lists from different sites, make sure to test it first!

  
<span style="font-size: large;">The script:</span>  

~~~~ {.brush:ps}
param(    [uri]$webAddress = 'http://server/site/url',    $sourceTitle = 'SourceListTitle',    $destTitle = 'DestinationListTitle',    # Reset permissions on child objects (items)?    [bool]$resetChildObjects=$false)$web = get-spweb $webAddress.ToString()$srcList = $web.lists[$sourceTitle]$dstList = $web.lists[$destTitle]if($srcList.Permissions.Inherited){    $dstList.ResetRoleInheritance()}else{    $dstList.BreakRoleInheritance($false,$resetChildObjects)    $srcList.Permissions | %{        $dstList.Permissions.Add($_.Member,$_.PermissionMask)    }}$dstList.Update()
~~~~

</p>

