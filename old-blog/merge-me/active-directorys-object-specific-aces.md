Title: Active Directory's Object Specific ACEs and PowerShell
Date: 2011-11-24 09:36
Tags: Security, Scripts, PowerShell, Active Directory
Slug: active-directorys-object-specific-aces
OldSlug: active-directorys-object-specific-aces

I recently checked the option of handing out AD permissions through
PowerShell scripts, and I found out that setting object-specific ACEs is
not trivial scriptwise. For those of you who don't know it, Active
Directory ACE (access control entries) are different from your regular
ACEs (for example, NTFS), because they can be used to grant permissions
only on specific types of objects, and to propagate only to specific
types of child objects.  
  

  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
  [![](http://2.bp.blogspot.com/-zdSNV1z0OQo/Ts3y9Mzy9JI/AAAAAAAABAQ/eFuSWYz-vRs/s400/ObjectSpecificACE-UI.png)](http://2.bp.blogspot.com/-zdSNV1z0OQo/Ts3y9Mzy9JI/AAAAAAAABAQ/eFuSWYz-vRs/s1600/ObjectSpecificACE-UI.png)

  Pic1 - Granting Everyone the right  
 to create **Computer Objects** in **child OUs**
  --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

<table cellpadding="0" cellspacing="0" class="tr-caption-container" style="margin-left: auto; margin-right: auto; text-align: center;">
<tbody>
<tr>
<td style="text-align: center;">
[![](http://1.bp.blogspot.com/-HxykZijS-ws/Ts35EMz7LgI/AAAAAAAABAY/bMG6sgyLPE4/s400/ObjectSpecificACE-UI2.png)](http://1.bp.blogspot.com/-HxykZijS-ws/Ts35EMz7LgI/AAAAAAAABAY/bMG6sgyLPE4/s1600/ObjectSpecificACE-UI2.png)

</td>
</tr>
<tr>
<td class="tr-caption" style="text-align: center;">
Pic2 - Granting Everyone the right   
to reset passwords, but only to **Computer objects**

</td>
<td class="tr-caption" style="text-align: center;">
</td>
<td class="tr-caption" style="text-align: center;">
</td>
<td class="tr-caption" style="text-align: center;">
  

</td>
</tr>
</tbody>
</table>
  

<div style="clear: both;">

</div>

The question is - how do I replicate this in PowerShell?  
After granting the "create computer objects in child OUs" right (pic1)
and loading the Active Directory module, If I fetch all of the relevant
permissions thusly:  

~~~~ {.brush: .ps}
get-acl 'AD:\OU=Domain Controllers,Dc=contoso,DC=com' | select -exp Access | ?{$_.IdentityReference -match 'Everyone'}
~~~~

I get the following output:

    ActiveDirectoryRights : CreateChild, DeleteChildInheritanceType       : DescendentsObjectType            : bf967a86-0de6-11d0-a285-00aa003049e2InheritedObjectType   : bf967aa5-0de6-11d0-a285-00aa003049e2ObjectFlags           : ObjectAceTypePresent, InheritedObjectAceTypePresentAccessControlType     : AllowIdentityReference     : EveryoneIsInherited           : FalseInheritanceFlags      : ContainerInheritPropagationFlags      : InheritOnly

Note that the "ActiveDirectoryRights" granted are "CreateChild" and
"DeleteChild", which are generic, NTFS-ish rights. The interesting parts
here are ObjectType and InheritedObjectType. Both contain well known IDs
representing AD object types. All object type guids are available in the
schema partition, on the property "schemaIDGUID". To look up for the
object type matching "bf967a86-0de6-11d0-a285-00aa003049e2", you should
invoke this code:

~~~~ {.brush: .ps}
$RawGuid = ([guid]'00299570-246d-11d0-a768-00aa006e0529').toByteArray();get-adobject -fi {schemaIDGUID -eq $rawGuid} -SearchBase (Get-ADRootDSE).schemaNamingContext -prop schemaIDGUID | Select name,@{Name='schemaIDGUID';Expression={[guid]$_.schemaIDGUID}}
~~~~

And now we discover that the field "ObjectType" contains the
SchemaIDGUID of "computer":

    name                                                        schemaIDGUID----                                                        ------------Computer                                                    bf967a86-0de6-11d0-a285-00aa003049e2

In a similar method we can find that "InheritedObjectType" contains
"Organizational-Unit". In order to create your own ACE, you simply have
to find the right IDs to put in those fields, and continue to set the
ACL normally. Have a safe directory!

</p>

