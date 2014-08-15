Title: 2008 Clusters can't change password
Date: 2011-01-12 19:32
Tags: Failover Cluster, Active Directory
Slug: 2008-clusters-cant-change-password
OldSlug: 2008-clusters-cant-change-password

Hi.  
Last week MS's PFE Moti Bani and me solved a problem that bugged me for
\~ a year - since the day we've started deploying 2008 clusters in our
production environment:  
**2008+ Clusters can't update their CNO and VCO accounts' passwords.**  
The error, as shown in the cluster administrator, was:  
*"Cluster network name resource 'Cluster Name' cannot be brought online.
The computer object associated with the resource could not be updated in
domain '' for the following reason:  
Unable to update password for computer account.  
  
The text for the associated error code is: Access is denied.  
  
  
The cluster identity '' may lack permissions required to update the
object. Please work with your domain administrator to ensure that the
cluster identity can update computer objects in the domain."*  
  
  
  
And in the cluster logs:  
*"????????.????????::2010/??/??-??:??:??.??? ERR   [RES] Network Name :
Unable to update password for computer account on DC \\\\., status 5."*  
  
  
  
Although this issue isn't critical, it was annoying to see it piling up
in the CluAdmin.msc and the opsMgr console, and it was quite disturbing
to know that somewhere, computer accounts are sitting there with year+
passwords, decreasing my domain's overall security.  
Last month we've decided this problem is worth some PFE hours, and
started troubleshooting it.  
Among the actions we've tried were:  

-   Adding permissions to the cluster/node accounts on the CNO,
    eventually trying "everyone: full control" (only for 5 minutes, I
    swear!)
-   Enabling auditing on the AD and the cluster nodes, trying to study
    that annoying "access denied". Nothing showed up on our logs
-   Activating ADSI auditing and event tracing

Eventually, Moti noticed that some of the ACLs on some of my AD
containers were messed up:  
The "authenticated users: read,read permissions, read all properties"
ACEs on the domain root, cn=builtin, cn=computers and cn=users were
blanked out (not missing, mind you). Within 5 minutes from fixing those
ACEs (and replicating), all of the cluster accounts in my production env
changed their password!   
Our latest theory is that the cluster tried to LDP bind to the AD to
check if the account is locked before attempting to change the password
through ADSI. The LDP bind destination was one of those containers, and
because the LDP bind failed (no read permission or whatever) the cluster
gave up on changing the password altogether... What a day.

</p>

