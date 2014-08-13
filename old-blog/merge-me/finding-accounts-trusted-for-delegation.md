Title: Finding Accounts Trusted for Delegation
Date: 2014-06-23 13:10
Author: Nitzan Raz (noreply@blogger.com)
Tags: Kerberos, Security, Scripts, Windows, Delegation, PowerShell, One-Liner, Active Directory
Slug: finding-accounts-trusted-for-delegation

As part of a security audit, I was asked to help in finding all accounts
marked with "Trusted for Delegation"  
  
<span style="font-size: large;">What is "Trust for Delegation"</span>  
You can try reading the [TechNet
Article](http://technet.microsoft.com/en-us/library/cc739740%28v=ws.10%29.aspx),
but in short - delegation (also known as kerberos double-hop) is
allowing a service to impersonate clients in order to access other
services, e.g. allowing an ASP.NET site to pull CRM records via CRM web
service, using the client's credentials (and so showing only records
relevant to the client).<a name="more"></a>  
  
<span style="font-size: large;">The Risk</span>  
Accounts that are trusted for delegation can access other services in
the domain (e.g. Active Directory, Exchange, in-house software that uses
kerberos authentication, external software using ADFS) without the
user's explicit action or consent (sometimes without him even accessing
the system, see next paragraph) and without any limits or indication
that it's not the original user.  
Some configurations also allow the delegate access to any service in the
domain (as opposed to specified ones) or giving the delegate access
without the user actually accessing the delegate in the first place
(read on).  
To sum it up, delegation must be used sparingly due to its dangerous
nature.  
  
<span style="font-size: large;">Technical Implementation and
Quirks</span>  
Delegation is all about an application getting a kerberos TGS (Ticket
Granting Service) for another resource, using the client's identity
(allowing the server to impersonate the client for that resource).  
[![](http://4.bp.blogspot.com/-ta4MUI67Zms/UuEiZf1pd2I/AAAAAAAAEVw/2Ji2IZRDWqY/s320/kerbDelegationDialog.jpg)](http://4.bp.blogspot.com/-ta4MUI67Zms/UuEiZf1pd2I/AAAAAAAAEVw/2Ji2IZRDWqY/s1600/kerbDelegationDialog.jpg)  
Delegation configuration is saved like that:  

<div>

<table>
<tbody>
<tr>
<th>
Configuration
</th>
<th>
UserAccountControl & 0x80000 (TRUSTED\_FOR\_DELEGATION)
</th>
<th>
UserAccountControl & 0x100000
(TRUSTED\_TO\_AUTHENTICATE\_FOR\_DELEGATION)
</th>
<th>
msDS-AllowedToDelegateTo
</th>
</tr>
<tr>
<td>
Do not trust this user for delegation
</td>
<td>
X
</td>
<td>
X
</td>
<td>
X
</td>
</tr>
<tr>
<td>
Trust this user for delegation to any service (Kerberos only)
</td>
<td>
V
</td>
<td>
X
</td>
<td>
X
</td>
</tr>
<tr>
<td>
Trust this user for delegation for specified services only (Kerberos)
</td>
<td>
X
</td>
<td>
X
</td>
<td>
V (a list of destination SPNs)
</td>
</tr>
<tr>
<td>
Trust this user for delegation for specified services only (Any
authentication protocol)
</td>
<td>
X
</td>
<td>
V
</td>
<td>
V (a list of destination SPNs)
</td>
</tr>
</tbody>
</table>

</div>

-   **When "Any protocol" is enabled**, services don't need to present
    an existing kerberos TGS, but can fabricate one using only the
    user's id. (Source:
    [Technet](http://msdn.microsoft.com/en-us/library/ff650469.aspx))  
   This method is designed to accommodate services that don't use
    kerberos authentication (e.g. websites that use forms
    authentication), but has a very serious implication - accounts
    allowed to do so don't have to present any proof that a specific
    user has even accessed the system - they can create any TGS out of
    thin air.
-   **When constrained to specific services**, the resulting TGS is
    itself delegation-constrained to those services, so to allow a
    "triple hop" like this:  
   S1 \> S2 \> S3  
   S1 must be configured either to allow delegation to any service or
    to S2 **AND** S3.
-   **For really sensitive accounts** (such as domain admins), one can
    mark "Account is sensitive and cannot be delegated" to prevent AD
    allowing any form of delegation with this account. This account will
    suffer reduced functionality on applications requiring delegation to
    work (like the site described earlier).

  
<span style="font-size: large;">Finding Allowed Accounts</span>  
Although PowerShell's module for Active Directory has some calculated
variables for delegation (e.g. TrustedForDelegation), they can't be used
to filter ADObject (only ADUSer or ADComputer), so I built my own script
to find trusted-for-delegation accounts:   

~~~~ {.prettyprint .lang-ps1}
Get-ADObject -fi {(msDS-AllowedToDelegateTo -like '*') -or (UserAccountControl -band 0x0080000) -or (UserAccountControl -band 0x1000000)} -prop samAccountName,msDS-AllowedToBeDelegateTo,servicePrincipalName,userAccountControl `| select DistinguishedName,ObjectClass,samAccountName,servicePrincipalName, @{name='DelegationStatus';expression={if($_.UserAccountControl -band 0x80000){'AllServices'}else{'SpecificServices'}}, @{name='AllowedProtocols';expression={if($_.UserAccountControl -band 0x1000000){'Any'}else{'Kerberos'}}, @{name='DestinationServices';expression={$_.'msDS-AllowedToDelegateTo'}}
~~~~

</p>

