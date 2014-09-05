Title: Stsadm / new SPSite is slow
Date: 2010-12-14 09:18
Category: Microsoft
Tags: Programming, PKI, Mysteries Solved, SharePoint, Scripts, PowerShell, Performance
Slug: stsadm-new-spsite-is-slow
OldSlug: stsadm-new-spsite-is-slow

**Update:** Get the script [here](|filename|/disabling-generate-publisher-evidence.md)  
### The Story
A couple of days ago, developer extraordinaire [Itay
Shakury](http://blogs.microsoft.co.il/blogs/itaysk/) was doing
performance tuning on one of our SharePoint applications, and came to me with
a problem - creating a new SPSite object took about 30 secs. The
stranger part was that **only the first creation of SPSite in every
appDomain is slow**.  
We've tried the usual things:  

-   Using SQL Profiler to check for DB-delays. Nope, all queries were as
    quick as a fox
-   Perfmoning the servers to death, looking for CPU/memory/disk spikes.
    No luck again

By the way, we used this bit of code to check exactly how slow the
SPSite creation is:  

~~~~powershell
function Log-Message($Message) {[DateTime]::Now.ToString('[hh:mm:ss.fff]')+" $Message"}
$Url = 'http://SERVER/Url';
Log-Message 'Loading Assembly'
[Reflection.Assembly]::LoadWithPartialName('Microsoft.Sharepoint') | Out-Null;
Log-Message 'Creating SPSite'
$Site = new-object Microsoft.Sharepoint.SPSite $Url
Log-Message 'Finished'
~~~~
  
Now I did some thinkning. What happens only one time in an AppDomain? I
thought of 3 things:  

-   **Poorly written singletons**. If that were the case, people all
    around the world would be having problems, and not just us.
-   **Connections to DBs**. Using SQL Profiler we found out that the
    connection to the ConfigDB only happens in the last of the 30
    seconds, meaning the DB is not to blame...
-   **Lazy loading**. (Spoiler: This is it) For those of us who forgot
    what it is, lazy loading is "don't look for / load dlls until the
    first time they're actually needed". How can we check that<span
    style="font-size: 125%;"><span class="Unicode">‽</span></span>

I suddenly remembered some problem I hadn't run into myself, but is
famous in my team:  
SQL Server Management Studio was slow to load ([KB918644](http://support.microsoft.com/?kbid=918644)). It happened
because the studio's assemblies (dlls) were digitally signed by MS using
Authenticode, that uses some sort of SSL-like certificates, and the
studio was trying to check MS's CRL (Certificate Revocation List) to
make sure the digisignature isn't revoked. Because we work in a
disconnected environment, it couldn't succeed.  
I've decided to NetMon the sever, and sure enough, my script was
DNS-querying for `crl.microsoft.com`, and obviously failing.  
After solving this issue, as a bonus, my `Stsadm.exe` commands were WAY
faster. Until now, it would take the process about 1 min to tell me I
have the wrong input, and I would die a little bit inside.  
  
### Possible Solutions
#### 1. Allow access to crl.microsoft.com
If you're lucky(?) enough to be working in a blocked, not disconnected
environment, consider simply allowing traffic to the crl site through
your proxy/firewall/whatever.  
  
#### 2. Stop checking for CRLs
If you ouldn't care less if someone stole MS's certificate and created an evil
`harepoint.dll` just kidding. We all fear that), you can tell Windows to
stop checking for CRLs altogether.  
**The user-specific way:**  
**Note:** This setting affects all software run by that user. You shouldn't use turn it off if this user on this server is used to process smartcard logons, for
example.  
Either turn off `Inetcpl.cpl > Advanced > Security > Check for publisher's certificate revocation` Or set
this regkey:
~~~registry
HKCU\Software\Microsoft\Windows\CurrentVersion\WinTrust\Trust Providers\Software Publishing:State=00023e00
~~~
**Another note:** Iv'e seen people scripting something to change the settings for all keys under `HKEY_USERS`. While this **seems** ok, it will actually change settings for all new users (through `.DEFAULT`) and for all existing users **with their registry hive currently loaded. Not all users have their hive
loaded at every moment!** If you're into automation, you're better off
with using Group Policy Preferences (use user preferences, and
server-name-based targeting).
**The machine / app specific way:**  
Use the machine/app/web.config to disable generation of publisher evidence,
the CRL-related process, thusly:
~~~xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
      <runtime>
              <generatePublisherEvidence enabled="false"/>
      </runtime>
</configuration>
~~~
(Of course you don't blank your .config files, only add this setting)
**Update (27/12):** Apparently, on x64 machines, you should change **both**the x86 and the x64 .config files.  
**Update (28/1/14):** I uploaded [the script](|filename|/disabling-generate-publisher-evidence.md) we used  
#### 3. Fetch the CRLs yourself
If the CRLs stored in the server's certificate store are fresh enough,
it **shouldn't** dial home for new ones.  
Download these:

- <http://crl.microsoft.com/pki/crl/products/CodeSignPCA.crl>
- <http://crl.microsoft.com/pki/crl/products/CodeSignPCA2.crl>

Add to certificate store:  
~~~bat
certutil -addstore CA CodeSignPCA.crl   
certutil -addstore CA CodeSignPCA2.crl
~~~
Could be distributed through Group Policy as well, but I didn't try it.  
#### 4. Mess with the process
I don't like this option, but If you're feeling malicious, you can just use your
`hosts` file to point `crl.microsoft.com` into one of your servers (e.g. `127.0.0.1`), causing windows to skip the 15-sec timeout issue and fail immediatly, when the server will refuse to hand him the CRLs.  
  
### Credit
Kudos for [Dirk Van den Berghe](http://dirkvandenberghe.com/2009/01/08/speed-up-sharepoint-spin-up-and-stsadm-execution-time-by-jeroen-ritmeijer.html) for handing out the methods for solving the issue.
