Title: Stsadm / new SPSite is slow
Date: 2014-06-22 12:54
Author: Nitzan Raz (noreply@blogger.com)
Tags: Programming, PKI, Mysteries Solved, SharePoint, Scripts, PowerShell, Performance
Slug: stsadm-new-spsite-is-slow

**Update:** Get the script
[here](http://blog.oneboredadmin.com/2014/01/disabling-generate-publisher-evidence.html)  
A couple of days ago, developer extraordinaire [Itay
Shakury](http://blogs.microsoft.co.il/blogs/itaysk/) was doing
performance tuning on one of our MOSS applications, and came to me with
a problem - creating a new SPSite object took about 30 secs. The
stranger part was that **only the first creation of SPSite in every
appDomain is slow**.  
If you want to read the solution, skip to the end. This is the exciting
story of how we found the root cause.  
We've tried the usual things:  

-   Using SQL Profiler to check for DB-delays. Nope, all queries were as
    quick as a fox
-   Perfmoning the servers to death, looking for CPU/memory/disk spikes.
    No luck again

By the way, we used this bit of code to check exactly how slow the
SPSite creation is:  

~~~~ {.brush: .ps}
function Log-Message($Message) {[DateTime]::Now.ToString('[hh:mm:ss.fff]')+" $Message"}$Url = 'http://SERVER/Url';Log-Message 'Loading Assembly'[Reflection.Assembly]::LoadWithPartialName('Microsoft.Sharepoint') | Out-Null;Log-Message 'Creating SPSite'$Site = new-object Microsoft.Sharepoint.SPSite $UrlLog-Message 'Finished'
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
SQL Server Management Studio was slow to load
([KB918644](http://support.microsoft.com/?kbid=918644)). It happened
because the studio's assemblies (dlls) were digitally signed by MS using
Authenticode, that uses some sort of SSL-like certificates, and the
studio was trying to check MS's CRL (Certificate Revocation List) to
make sure the digisignature isn't revoked. Because we work in a
disconnected environment, it couldn't succeed.  
I've decided to NetMon the sever, and sure enough, my script was
DNS-querying for "crl.microsoft.com", and obviously failing.  
After solving this issue, as a bonus, my Stsadm.exe commands were WAY
faster. Until now, it would take the process about 1 min to tell my I
have the wrong input, and I would die a little bit inside.  
  
<span style="font-size: x-large;">Possible Solutions:</span>  
<span style="font-size: large;"> 1. Allow access to
crl.microsoft.com</span>  
If you're lucky(?) enough to be working in a blocked, not disconnected
environment, consider simply allowing traffic to the crl site through
your proxy/firewall/whatever.  
  
<span style="font-size: large;">2. Stop checking for CRLs</span>  
<span style="font-size: large;"><span style="font-size: small;">If you
couldn't care less if someone stole MS's certificate and created an evil
Sharepoint.dll (just kidding. We all fear that), you can tell Windows to
stop checking for CRLs altogether.</span></span>  
<span style="font-size: large;"><span style="font-size: small;">**The
user-specific way:**</span></span>  
<span style="font-size: large;"><span
style="font-size: small;">**Note:** This setting affects all software
run by that user. You shouldn't use turn it off if this user on this
server is used to process smartcard logons, for
example.</span></span><span style="font-size: large;"><span
style="font-size: small;">** **</span></span>  
<span style="font-size: large;"><span style="font-size: small;"> Either
turn off "Inetcpl.cpl"**\>**Advanced**\>**Security**\>**"Check for
publisher's certificate revocation"</span></span>  
<span style="font-size: large;"><span style="font-size: small;">Or set
this regkey:</span></span>  
<span
style="font-size: small;"> [HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\WinTrust\\Trust
Providers\\Software Publishing]  
“State”=dword:00023e00 </span>  
<span style="font-size: small;">**Another note:** Iv'e seen people
scripting something to change the settings for all keys under
HKEY\_USERS. While this **seems** cool, it will actually change settings
for all new users (through .DEFAULT) and for all existing users **with
their registry hive currently loaded. Not all users have their hive
loaded at every moment!** If you're into automation, you're better off
with using Group Policy Preferences (use user preferences, and
server-name-based targeting).</span>  
<span style="font-size: small;">**The machine / app specific way:** Use
the machine/app/web.config to disable generation of publisher evidence,
the CRL-related process, thusly:</span>  

    <?xml version="1.0" encoding="utf-8"?><configuration>      <runtime>              <generatePublisherEvidence enabled="false"/>      </runtime></configuration>

<span style="font-size: small;">(Of course you don't blank your .config
files, only add this setting)</span>  
<span style="font-size: large;">**<span style="font-size: small;">Update
(27/12):</span>**<span style="font-size: small;"> Apparently, on x64
machines, you should change **both**the x86 and the x64 .config
files.</span></span>  
<span style="font-size: large;"><span style="font-size: small;">**Update
(28/1/14):** I uploaded [the
script](http://blog.oneboredadmin.com/2014/01/disabling-generate-publisher-evidence.html)
we used</span>  
</span>  
<span style="font-size: large;">  
</span>  
<span style="font-size: large;">3. Fetch the CRLs yourself</span>  
If the CRLs stored in the server's certificate store are fresh enough,
it **shouldn't** dial home for new ones.  
Download these:  
http://crl.microsoft.com/pki/crl/products/CodeSignPCA.crl  
http://crl.microsoft.com/pki/crl/products/CodeSignPCA2.crl  
Add to certificate store:  
certutil -addstore CA CodeSignPCA.crl   
certutil -addstore CA CodeSignPCA2.crl  
Could be distributed through Group Policy as well, but I didn't try it.  
  
<span style="font-size: large;">4. Mess with the process</span>  
<span style="font-size: large;"><span style="font-size: small;">I don't
like this option, but If you're feeling malicious, you can just use your
hosts file to point crl.microsoft.com into one of your servers
(localhost?), causing windows to skip the 15-sec timeout issue and fail
later, when the server will refuse to hand him the CRLs.</span></span>  
  
<span style="font-size: large;">Credit</span>  
Kudos for
[](http://dirkvandenberghe.com/2009/01/08/speed-up-sharepoint-spin-up-and-stsadm-execution-time-by-jeroen-ritmeijer.html)[Dirk
Van den
Berghe](http://dirkvandenberghe.com/2009/01/08/speed-up-sharepoint-spin-up-and-stsadm-execution-time-by-jeroen-ritmeijer.html "Dirk Van den Berghe")
for handing out the methods for solving the issue.

</p>

