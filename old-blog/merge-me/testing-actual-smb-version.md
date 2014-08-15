Title: Testing actual SMB version
Date: 2013-02-14 07:52
Tags: Mysteries Solved, Scripts, NetApp, SMB, FileSystem, PowerShell, CIFS, Performance
Slug: testing-actual-smb-version
OldSlug: testing-actual-smb-version

Ever since I got employed in my present company, I've been told that our
NetApp Filer supports SMB2 when used as NAS.   
I was always skeptic of that (due to high transfer times and being
unable to cancel mid-file) but had no easy way of testing (I guess I
could use Network Monitor, but I wasn't THAT skeptic), but I recently
learned that in Windows 8 it's super easy!  
[Jose Barreto's
post](http://blogs.technet.com/b/josebda/archive/2012/06/06/windows-server-2012-which-version-of-the-smb-protocol-smb-1-0-smb-2-0-smb-2-1-or-smb-3-0-you-are-using-on-your-file-server.aspx)
taught me a little trick:  

1.  Open PowerShell as an administrator (on a Windows 8 / Windows Server
    2012 machine)
2.  Perform an SMB operation against the file server (my Filer) like
    this:   

    ~~~~ {.brush:ps}
    ls \\Netapp\stupidShare
    ~~~~

3.  Execute the command "Get-SmbConnection", filter for sessions to the
    file server and look at "Dialect":  

    ~~~~ {.brush:ps}
    Get-SmbConnection -server Netapp | fl
    ~~~~

    The result should look like this:  

        ServerName : NetappShareName  : stupidShareUserName   : Domain\OBACredential : Domain.Domains\OBADialect    : 1.50NumOpens   : 0

As you can see, my suspicions were correct! My Windows 8 machine (that
definitely supports SMB3 and SMB2) and the NetApp Filer eventually
negotiated on SMB1, probably indicating that the Filer doesn't support
SMB2 (at least at the moment).  
No one can fool me with SMB versions anymore!  
  
P.S.: Check out Jose's post for SMB support matrix, version difference
and some complex diagram with a raptor (no kidding).

</p>

