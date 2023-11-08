var store = [{
        "title": "Testing stranded group policies",
        "excerpt":"Ever had GPO Version differences between the AD and the Sysvol? Sure, you might have a healthy FRS/DFSR architecture, but the replication takes time. It’s annoying to check if the GP object is now OK on every server, because one would have to point the GPMC to every DC and...","categories": ["Microsoft"],
        "tags": ["Group Policy","NTFRS","PowerShell","Active Directory"],
        "url": "/testing-stranded-group-policies.html",
        "teaser": null
      },{
        "title": "New blog... yay",
        "excerpt":"Hi. My name is Nitzan, and I’m a MS-IT guy. Whenever I run into a problem I can’t solve during my work, I almost always end up finding the answer in some blog. For that reason, I’ve decided to place all of the solutions I find in one place, in...","categories": ["Misc"],
        "tags": ["Ramblings"],
        "url": "/new-blog-yay.html",
        "teaser": null
      },{
        "title": "Querying SQL Servers",
        "excerpt":"Before I had a chance to study Microsoft’s SQL Server Management Studio (SSMS)’s Powershell SnapIn, I needed to grab some data from an SQL DB. I ended up creating 3 nifty functions for that very thing, and I still use them today, because I find SQL’s SnapIn very slow and...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell","SQL"],
        "url": "/querying-sql-servers.html",
        "teaser": null
      },{
        "title": "Auto-Sorting Computers in WSUS",
        "excerpt":"When I installed my first WSUS server, I liked the idea of auto-assigning computers into different WSUS groups according to domains using the group policy’s settings. However, it’s a bummer to find out that you can only assign every computer to one group using GP (and not being able to...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell","WSUS"],
        "url": "/auto-sorting-computers-in-wsus.html",
        "teaser": null
      },{
        "title": "Get-BigDirectories",
        "excerpt":"Note: This script is better than just ls -rec | measure, because measure measures only one field, and when iterating over many files and directories, every iteration counts. Whenever our roaming profiles folder gets too big, we have to prune the profiles that are both old and heavy. Using windows...","categories": ["Microsoft"],
        "tags": ["Scripts","FileSystem","PowerShell"],
        "url": "/get-bigdirectories.html",
        "teaser": null
      },{
        "title": "2008 Clusters can't change password",
        "excerpt":"Last week MS’s PFE Moti Bani and me solved a problem that bugged me for ~ a year - since the day we’ve started deploying 2008 clusters in our production environment: 2008+ Clusters can’t update their CNO and VCO accounts’ passwords. The error, as shown in the cluster administrator, was:...","categories": ["Microsoft"],
        "tags": ["Failover Cluster","Active Directory","Mysteries Solved","Security","Windows"],
        "url": "/2008-clusters-cant-change-password.html",
        "teaser": null
      },{
        "title": "SPNs - Who? Why? Where?",
        "excerpt":"I was making an introduction to a new teammate about SharePoint infrastructure, and one of the things I had to teach her about was SPNs. I was surprised to know almost no one at our place knew what SPNs are actually for. Until my PowerPoint presentation is ready, here is...","categories": ["Microsoft"],
        "tags": ["Kerberos","SharePoint","Active Directory","Security"],
        "url": "/spns-who-why-where.html",
        "teaser": null
      },{
        "title": "A few seconds about psbase",
        "excerpt":"I really like Powershell’s dynamic type system, which allows you to, among other things, view XML nodes really easily. For example, to view the connectionStrings stored in your machine.config, all you have to do is something like: ([xml](gc 'C:\\windows\\Microsoft.NET\\Framework\\v2.0.50727\\CONFIG\\machine.config')).configuration.connectionStrings.add And you have a set of working PS objects. However, when...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell"],
        "url": "/few-seconds-about-psbase.html",
        "teaser": null
      },{
        "title": "WindowsIdentity.GetCurrent and changing usernames",
        "excerpt":"We’ve recently encountered an interesting problem: One of our applications had a service using .net remoting with impersonation turned on. Inside this service we had some code using WindowsIdentity.GetCurrent() to find the user in AD and check some of its properties. Our issue was thus: User X logs in and...","categories": ["Microsoft"],
        "tags": ["Programming","Active Directory","Security","PowerShell"],
        "url": "/windowsidentitygetcurrent-and-changing-usernames.html",
        "teaser": null
      },{
        "title": "Stsadm / new SPSite is slow",
        "excerpt":"Update: Get the script here The Story A couple of days ago, developer extraordinaire Itay Shakury was doing performance tuning on one of our SharePoint applications, and came to me with a problem - creating a new SPSite object took about 30 secs. The stranger part was that only the...","categories": ["Microsoft"],
        "tags": ["Programming","PKI","Mysteries Solved","SharePoint","Scripts","PowerShell","Performance"],
        "url": "/stsadm-new-spsite-is-slow.html",
        "teaser": null
      },{
        "title": "Vanishing permissions on AD objects",
        "excerpt":"I recently managed to solve a problem that bugged me for a ~ year - permissions on a specific group on AD would vanish, and the change won’t show up on the security logs of any DC (as audit success). The Story We’ve made groups for our helpdesk teams, and...","categories": ["Microsoft"],
        "tags": ["Mysteries Solved","Active Directory","Security"],
        "url": "/vanishing-permissions-on-ad-objects.html",
        "teaser": null
      },{
        "title": "Checking for conflicting oIDs",
        "excerpt":"I got word that this script was useful for some other IT team, so it’s definitely blog-worthy! The Story I’ve inherited some AD forests with their schema extended by in-house software, using oIDs belonging to an MS pool, meaning that those numbers might be used by future schema extensions by...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell","Active Directory"],
        "url": "/checking-for-conflicting-oids.html",
        "teaser": null
      },{
        "title": "Internet Explorer and SPNs",
        "excerpt":"After learning how SPNs work (read my “Who? Why? Where” to learn what’s an SPN), I was frustrated to find out that I can’t implement my experience in the real world. I’ve created a Sharepoint Central Admin site on port 1234, and wanted to enable kerberos authentication for it, so...","categories": ["Microsoft"],
        "tags": ["Kerberos","Mysteries Solved","Internet Explorer","SharePoint"],
        "url": "/internet-explorer-and-spns.html",
        "teaser": null
      },{
        "title": "Speed boosting disconnected environments",
        "excerpt":"Hi there. Not a while ago, I’ve created a post about stsadm.exe / new SPSite() being slow in disconnected environments. Just wanted to point out that I’ve tried changing the setting on some other servers, and the results were most interesting. Almost every other MS product, starting from SQL Studio...","categories": ["Microsoft"],
        "tags": ["SCOM","Ramblings","SQL"],
        "url": "/speed-boosting-disconnected-environments.html",
        "teaser": null
      },{
        "title": "Enabling Remote Desktop Remotely",
        "excerpt":"According to this Technet article, to enable remote desktop remotely by using the registry you need to set the key HKEY_LOCAL_MACHINE\\SYSTEM\\CurrentControlSet\\Control\\Terminal Server:fDenyTSConnections=0 and then reboot the server. Rebooting is actually unnecessary - you can just restart the service TermService If you’d like to script it all: param([string]$computerName='.') # Set registry...","categories": ["Microsoft"],
        "tags": ["Security","Scripts","Windows","PowerShell","Terminal Server","Registry","One-Liner"],
        "url": "/enabling-remote-desktop-remotely.html",
        "teaser": null
      },{
        "title": "Event Log Permissions, With Scripts!",
        "excerpt":"I’m going to keep it short, because there’s a lot of technical background. So, I’m assuming you know about: Assigning permissions to the registry SDDLs Event Log concepts (sources, logs) So, to business: Intro Event viewer data is stored in .evt/.evtx files in %SystemRoot%\\System32\\Winevt\\Logs\\, but as with any half-decent DB,...","categories": ["Microsoft"],
        "tags": ["Security","Scripts","PowerShell","Registry","Event Log"],
        "url": "/event-log-permissions-with-scripts.html",
        "teaser": null
      },{
        "title": "Changing php settings without .htaccess or php.ini",
        "excerpt":"I’m doing a little developing in PHP as a hobby, and I got some task involving free hosting in FreeHostingCloud.com. Since I’m just starting to learn PHP 5, I have a lot of errors. All kinds of them. And it took me a while to understand that errors aren’t being...","categories": ["FOSS"],
        "tags": ["Programming","PHP"],
        "url": "/changing-php-settings-without-htaccess.html",
        "teaser": null
      },{
        "title": "Lowercasing PTR records in DNS",
        "excerpt":"Recently, one of the IT crowd informed me that he can’t delete some of his PTR records through the DNS management console (dnsmgmt.msc). The record would appear to be deleted, but it’ll still show up after refreshing. After some quick Googling I found kb842127, which says that PTR records with...","categories": ["Microsoft"],
        "tags": ["DNS","Scripts","PowerShell"],
        "url": "/lowercasing-ptr-records-in-dns.html",
        "teaser": null
      },{
        "title": "Making your pages more Facebook shareable",
        "excerpt":"I’m working on a project involving Gallery 3, and one of my goals was tight Facebook integration. Today I’ve wanted to make sure that when someone shares a page from my gallery on Facebook, it’ll show up OK. After some digging around I found some interesting stuff: ####Facebook’s URL Linter...","categories": ["FOSS"],
        "tags": ["Facebook","HTML"],
        "url": "/making-your-pages-more-facebook-shareable.html",
        "teaser": null
      },{
        "title": "Setting Dynamic RPC Port Ranges",
        "excerpt":"We recently had to manually set the dynamic RPC port range in our servers, mainly because Exchange 2010 sets the port range so wide that the firewall guys (rightfully) refused to create a rule with that range. Warning - at your own risk! When I found out about those settings,...","categories": ["Microsoft"],
        "tags": ["Group Policy","Firewall","Registry"],
        "url": "/setting-dynamic-rpc-port-ranges.html",
        "teaser": null
      },{
        "title": "Dumping your MySQL db using PHP",
        "excerpt":"Hi. One of my clients asked me to be able to take manual backups of his DB, and because he wasn’t so technologically-inclined, using the hosting company’s interface wasn’t an option. So I created a small PHP page that uses mysqldump to dump the site’s db in a downloadable way....","categories": ["Foss"],
        "tags": ["PHP","SQL","Backups"],
        "url": "/dumping-your-mysql-db-using-php.html",
        "teaser": null
      },{
        "title": "Showing \"Mail\" icon in control panel through Group Policy",
        "excerpt":"I recently had to lock down a Windows 2008R2 remote desktop server (terminal server) One of the requirements was to show only some control panel items, a setting that can be achieved using the Group Policy setting “Show only specified Control Panel items” (under Policies &gt; Administrative Templates &gt; Control...","categories": ["Microsoft"],
        "tags": ["Group Policy","Terminal Server","Office"],
        "url": "/showing-mail-icon-in-control-panel-through-group-policy.html",
        "teaser": null
      },{
        "title": "Solving and preventing \"Topology Discovery failed, error 0x80040a02\"",
        "excerpt":"Recently our Exchange 2003 environment broke down when we demoted our last ancient DCs. We panicked and re-promoted them, but no avail. The Exchange servers won’t finish loading (they’d get stuck on “Applying computer settings”, while actually waiting for the Microsoft Exchange System Attendant service to finish starting). The error...","categories": ["Microsoft"],
        "tags": ["Group Policy","Exchange","Active Directory"],
        "url": "/solving-and-preventing-topology-discovery-failed.html",
        "teaser": null
      },{
        "title": "The module ... owssvr.dll could not be loaded due to a configuration problem",
        "excerpt":"Recently, one of my teammates installed ArcGis Server 9.3 on our fresh SharePoint 2010 box, causing all sites to respond with 503 Service Unavailable. A quick inspection showed that the application pools have stopped themselves, and the Windows application event log was spammed with: Event ID: 2282 Source: Microsoft-Windows-IIS-W3SVC-WP Description:...","categories": ["Microsoft"],
        "tags": ["Mysteries Solved","SharePoint","IIS"],
        "url": "/module-owssvrdll-could-not-be-loaded.html",
        "teaser": null
      },{
        "title": "Monitoring SharePoint 2010 on SCOM - Minimal Permissions",
        "excerpt":"I’ve recently started monitoring my new SharePoint 2010 farms on SCOM, and found the management pack’s documentation to be rather lacking in setup instructions, and the required permissions for SCOM’s account on the farm were rather shocking: Local admin on all SharePoint servers Local admin on all SQL servers dbowner...","categories": ["Microsoft"],
        "tags": ["SharePoint","SCOM"],
        "url": "/monitoring-sharepoint-2010-on-scom.html",
        "teaser": null
      },{
        "title": "Google Friendly Apache Domain Migration",
        "excerpt":"I recently migrated a domain for a client, and did it like a noob (as in simply copying the db and files, making sure everything’s working, and then shutting down the old site). As a result, Google’s pageranks were lost, old links were broken and ghost pages were found on...","categories": ["FOSS"],
        "tags": ["Apache","Google"],
        "url": "/google-friendly-apache-domain-migration.html",
        "teaser": null
      },{
        "title": "Making sure your Audit Collection Server is collecting",
        "excerpt":"A few days ago I wanted to make sure that my ACS (Audit Collection Server) is collecting events from all of my DCs. For those unfamiliar with ACS, it’s an additional component to SCOM (System Center Configuration Manager) that allows you to collect events from the security log of several...","categories": ["Microsoft"],
        "tags": ["ACS","PowerShell","SCOM","SQL"],
        "url": "/making-sure-your-audit-collection-server-is-collecting.html",
        "teaser": null
      },{
        "title": "Active Directory's Object Specific ACEs and PowerShell",
        "excerpt":"I recently checked the option of handing out AD permissions through PowerShell scripts, and I found out that setting object-specific ACEs is not trivial scriptwise. Active Directory ACE (access control entries) are different from your regular ACEs (for example, NTFS), because they can be used to grant permissions only on...","categories": ["Microsoft"],
        "tags": ["Security","Scripts","PowerShell","Active Directory"],
        "url": "/active-directory-object-specific-aces.html",
        "teaser": null
      },{
        "title": "RssCache - An RSS Cache / Aggregator",
        "excerpt":"Note: I’m no longer using this site, and might take it down. Let me know if you want the code. Recently I’ve decided that I want to use μTorrent’s Feed ability to auto download BitTorrent torrents, after I gave up on Miro (I moved my video library and discovered that...","categories": ["FOSS"],
        "tags": ["MySQL","Programming","PHP","RSS","BitTorrent","Ramblings","SQL"],
        "url": "/rsscache-rss-cache-aggregator.html",
        "teaser": null
      },{
        "title": "Creating a common Yii code directory",
        "excerpt":"Yii natively supports code recycling, by allowing you to store common code in modules, widgets etc. However, to share code between applications, you still have to copy the files from one application to another. Right? Wrong! I recently created a common code directory (wittingly called “my-yii”) where I store all...","categories": ["FOSS"],
        "tags": ["PHP","Yii"],
        "url": "/creating-common-yii-code-directory.html",
        "teaser": null
      },{
        "title": "Extending Yii's Web Application Creation",
        "excerpt":"I found out that after creating my Yii Applications through Yiic.bat, I tend to modify the same things in all of them (adding .htaccess files for pretty urls (no index.php), adding a reference for my custom modules directory, etc.), so I decided to try and override the WebApp command with...","categories": ["FOSS"],
        "tags": ["PHP","Yii"],
        "url": "/extending-yiis-web-application-creation.html",
        "teaser": null
      },{
        "title": "Fixing Facebook to Google Calendar synchronization",
        "excerpt":"Note: It’s fixed now. The project itself is still pretty cool I recently managed to sync my Facebook events to my Google Calendar (and thusly to my Android phone). At first the task seemed simple, because Facebook offers you a link to export your events in iCal format, but once...","categories": ["Foss"],
        "tags": ["Mysteries Solved","Facebook","iCal","Calendar","Yii"],
        "url": "/fixing-facebook-to-google-calendar.html",
        "teaser": null
      },{
        "title": "Creating proxied http requests with PowerShell",
        "excerpt":"I’m working on some sort of HTTP proxy (maybe more details about it later), and to test it I’ve created a short PowerShell script. Note it also performs basic authentication voluntarily (without waiting for a server challenge) by injecting an Authorization header, because I was testing something extra special. I...","categories": ["Microsoft"],
        "tags": ["HTTP","Scripts","Proxy","PowerShell"],
        "url": "/creating-proxied-http-requests-with-powershell.html",
        "teaser": null
      },{
        "title": "Determining Size of all Tables in a Database",
        "excerpt":"Just a quick SQL script to get the rowcount and size data of every table in the current database: CREATE TABLE #sizeof ( name varchar (70), [rows] int, reserved varchar(20), data varchar(20), index_size varchar(20), unused varchar(20), ) DELCARE @name varchar(70) DECLARE cur CURSOR FOR select name from sys.tables OPEN cur...","categories": ["Microsoft"],
        "tags": ["Scripts","SQL"],
        "url": "/determining-size-of-all-tables-in-a-database.html",
        "teaser": null
      },{
        "title": "Remotely Viewing Machine Certificates With Minimal Permissions",
        "excerpt":"We’ve started remotely monitoring our certificate stores on critical servers, and wanted the monitoring software to be able to remotely connect to our servers’ personal certificate stores. I quickly found a script to enumerate all certificates in a specific store on a remote computer: function Get-Cert( $computer=$env:computername ){ $ro=[System.Security.Cryptography.X509Certificates.OpenFlags]\"ReadOnly\" $lm=[System.Security.Cryptography.X509Certificates.StoreLocation]\"LocalMachine\"...","categories": ["Microsoft"],
        "tags": ["Security","PKI","Mysteries Solved","PowerShell","Active Directory"],
        "url": "/remotley-viewing-machine-certificates-with-minimal-permissions.html",
        "teaser": null
      },{
        "title": "Automaticlly Extracting Downloaded Torrents",
        "excerpt":"As every average geek, I too download torrents (containing only legal, copyright-free material, of course), and most of the time the torrents contain multi-file archives that contain the really juicy data. A lot of times I return home and find some new torrent has completed downloading, but I have to...","categories": ["Microsoft"],
        "tags": ["Scripts","BitTorrent","PowerShell"],
        "url": "/automaticlly-extracting-downloaded-torrents.html",
        "teaser": null
      },{
        "title": "Installing WSUS Prerequisites Easily in a Disconnected Server",
        "excerpt":"Our company has an internet-isolated environment, and I was requested to create a WSUS infrastructure there. The most annoying thing about installing a disconnected WSUS server is that you can’t do it via the server manager (because it requires a working internet connection) but rather through an exe file, and...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell","WSUS"],
        "url": "/installing-wsus-prerequisites-easily-in-a-disconnected-server.html",
        "teaser": null
      },{
        "title": "Windows Event Collection",
        "excerpt":"I’ve recently implemented an enterprise-wide solution of event collection in our organization, using Windows’ built-in mechanism called the Windows Event Collector. This mechanism allows you to collect events from computers running Windows NT5+ (XP/Server 2003 and greater) into Windows NT6+ (Vista/Server 2008 and greater) machines. The only basic rules are...","categories": ["Microsoft"],
        "tags": ["Kerberos","Group Policy","Security","Event Log","Active Directory"],
        "url": "/windows-event-collection.html",
        "teaser": null
      },{
        "title": "Windows Event Collection",
        "excerpt":"I've recently implemented an enterprise-wide solution of event collection in our organization, using Windows' built-in mechanism called the [Windows Event Collector.](http://msdn.microsoft.com/en-us/library/windows/desktop/bb427443%28v=vs.85%29.aspx) This mechanism allows you to collect events from computers running Windows NT5+ (XP/Server 2003 and greater) into Windows NT6+ (Vista/Server 2008 and greater) machines. The only basic rules are...","categories": ["Microsoft"],
        "tags": ["Kerberos","Group Policy","Security","Event Log","Active Directory"],
        "url": "/windows-event-collection.html",
        "teaser": null
      },{
        "title": "Some Things I Didn't Know About People Picker",
        "excerpt":"Recently I got to mess with SharePoint 2010’s People Picker - a control that emulates Windows’ “Directory Object Picker”, allowing the user to select security principals Active Directory’s People Picker: The SharePoint 2010 Variant: After the Devs asked me to customize it for them, I went rummaging through the dark...","categories": ["Microsoft"],
        "tags": ["SharePoint","PowerShell","Active Directory"],
        "url": "/some-things-i-didnt-know-about-people-picker.html",
        "teaser": null
      },{
        "title": "Updating VMware discovery info in Active Directory",
        "excerpt":"Recently I decided I want to store physical discovery data (name, physical location, host if it’s a VM) on the machine’s account in Active Directory, because we have a lot of machines and during a crisis we sometimes forget where they are. I started with our VMware infrastructure, and decided...","categories": ["Microsoft"],
        "tags": ["VMware","Scripts","PowerShell","Active Directory"],
        "url": "/updating-vmware-discovery-info-in-active-directory.html",
        "teaser": null
      },{
        "title": "Applying SPWebConfigModification objects safely",
        "excerpt":"My SharePoint team and I wanted to move to SPWebConfigModification rather that just modifying the web.config file manually, but I was always worried that applying faulty modifications will ruin my file. Why? How SPWebConfigModification objects work Some code requires you to modify the SharePoint web application’s web.config file. SharePoint handles...","categories": ["Microsoft"],
        "tags": ["ASP.net","SharePoint","Scripts","Web.Config","PowerShell"],
        "url": "/applying-spwebconfigmodification-objects-safely.html",
        "teaser": null
      },{
        "title": "Automaticlly Updating DNS Server Addresses In A Domain Machine",
        "excerpt":"The Problem I was recently requested to make sure that our machine’s network interface cards (NICs) have their DNS queries pointed to “the correct servers”. I decided that every machine should point to its domain’s DNS servers, and it’s their job to redirect queries (if needed) to other DNS servers....","categories": ["Microsoft"],
        "tags": ["DNS","Scripts","PowerShell","Active Directory"],
        "url": "/automaticlly-updating-dns-server.html",
        "teaser": null
      },{
        "title": "Brute Force Guessing for User Passwords",
        "excerpt":"Our security team complained to me that they found a lot of users with trivial passwords simply by trying to log in as them. They asked me to write them a script to speed up the process, so I wrote them my brute force guessing script. It’s not very stealthy,...","categories": ["Microsoft"],
        "tags": ["Security","Scripts","PowerShell","Active Directory"],
        "url": "/brute-force-guessing-for-user-passwords.html",
        "teaser": null
      },{
        "title": "Making Sure Only Your PDC is Scavanging DNS Records",
        "excerpt":"I recently looked over out DNS server settings, and I found out that more than one DNS server (DC in our case) was scavenging records. In order to put that right, I made a small script that makes sure that only the PDC is scavenging records: param( $scavengeInterval = 7...","categories": ["Microsoft"],
        "tags": ["DNS","Scripts","PowerShell","Active Directory"],
        "url": "/making-sure-only-your-pdc-is-scavanging.html",
        "teaser": null
      },{
        "title": "Reverse Lookup in SharePoint 2010",
        "excerpt":"Every SharePoint noob knows that one can create list lookup relationships, like specifying that a book belongs in a specific bookshelf. What I didn’t know until today is SharePoint 2010 supports “reverse lookup” out of the box! What’s Lookup? Consider this.You have 2 lists in your SharePoint site - one...","categories": ["Microsoft"],
        "tags": ["Mysteries Solved","SharePoint","Office"],
        "url": "/reverse-lookup-in-sharepoint-2010.html",
        "teaser": null
      },{
        "title": "Finding WSUS Clients by SusClientId",
        "excerpt":"Today someone showed me a strange problem - he had servers that recently installed new updates from his WSUS server, but he couldn’t find them in the WSUS console by their name. Obviously the servers have been renamed and didn’t have time to report to the WSUS server, but he...","categories": ["Microsoft"],
        "tags": ["Mysteries Solved","Scripts","PowerShell","WSUS","Registry"],
        "url": "/finding-wsus-clients-by-susclientid.html",
        "teaser": null
      },{
        "title": "Copying List Permissions in SharePoint 2010",
        "excerpt":"I just wrote a small script to copy permissions from one SharePoint list to the other. Things to consider Custom permission levels are not preserved: For some reason, my method of copying permissions isn’t custom-permission-level friendly. The customized permissions will still be copied, but an auto-generated permission level will be...","categories": ["Microsoft"],
        "tags": ["SharePoint","Scripts","PowerShell"],
        "url": "/copying-list-permissions-in-sharepoint.html",
        "teaser": null
      },{
        "title": "Mass Setting Permissions on Remote Shares",
        "excerpt":"I was recently asked by one of my teammates to add several NTFS permissions to the root folders of a bunch of shares. Seems easy, but I had two problems: The shares were stored on a NetApp Filer, so I couldn’t use any WMI trickery (or the new SMB module...","categories": ["Microsoft"],
        "tags": ["Security","Scripts","NetApp","FileSystem","PowerShell"],
        "url": "/mass-setting-permissions-on-remote-shares.html",
        "teaser": null
      },{
        "title": "Testing actual SMB version",
        "excerpt":"Ever since I got employed in my present company, I’ve been told that our NetApp Filer supports SMB2 when used as NAS. I was always skeptic of that (due to high transfer times and being unable to cancel mid-file) but had no easy way of testing (I guess I could...","categories": ["Microsoft"],
        "tags": ["Mysteries Solved","Scripts","NetApp","SMB","FileSystem","PowerShell","CIFS","Performance"],
        "url": "/testing-actual-smb-version.html",
        "teaser": null
      },{
        "title": "Copying Files In PowerShell - Using Windows Explorer UI",
        "excerpt":"I know this trick is widely known, but I thought it’s worth mentioning anyway. If you use PowerShell’s Copy-Item to copy files, you don’t get any progress report, ETA or statistics like you do when using Windows Explorer’s file copy. First, let’s generate a random file using fsutil. Note how...","categories": ["Microsoft"],
        "tags": ["Scripts","FileSystem","PowerShell"],
        "url": "/copying-files-in-powershell-using-windows-explorer-ui.html",
        "teaser": null
      },{
        "title": "Wget in PowerShell v3",
        "excerpt":"I’ve been envying my *nix brethren for having Wget for a long time. To get the contents of a web page or download a file using http I had to use workarounds that took more than one command - either creating a new System.Net.WebRequest or using a BITS module. Well...","categories": ["Microsoft"],
        "tags": ["HTTP","SharePoint","Scripts","PowerShell","HTML"],
        "url": "/wget-in-powershell-v3.html",
        "teaser": null
      },{
        "title": "Group Policy Security Filtering and Loopback",
        "excerpt":"I recently discovered that when applying a GP object using loopback and user security filtering (allowing only specific users to apply the GP), the computer still needs read access to the GP. Otherwise, the GP will show up as not applied due to it being “inaccessible”: My guess is that...","categories": ["Microsoft"],
        "tags": ["Group Policy","Security","Mysteries Solved","Active Directory"],
        "url": "/group-policy-security-filtering-and-loopback.html",
        "teaser": null
      },{
        "title": "Opening Group Policy Management Editor from the Command Line",
        "excerpt":"Yesterday I wanted to open the Group Policy editor (or “Group Policy Management Editor”) for a specific GP object through PowerShell, but there is no “Edit-GPO” cmdlet. I quickly checked from the task manager how the GPMC opens the editor, and made my own: function Edit-GPO([guid]$guid){ $domain = Get-ADDomain #...","categories": ["Microsoft"],
        "tags": ["Group Policy","Programming","Scripts","PowerShell","Active Directory"],
        "url": "/opening-group-policy-management-editor-from-the-command-line.html",
        "teaser": null
      },{
        "title": "Removing all Metro Apps from Windows 8",
        "excerpt":"I wanted to open some photos today (to add to my blog) on my Windows 8 workstation, and it kept opening the full-screen metro app instead of the normal picture viewer. It really annoyed me, and I looked for a quick and dirty way to remove ALL metro apps. This...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell","One-Liner"],
        "url": "/removing-all-metro-apps-from-windows-8.html",
        "teaser": null
      },{
        "title": "Solving Event Log Subscription Error \"0x138C\"",
        "excerpt":"Today I saw some collector-initiated event log subscriptions that displayed a weird error, something like Windows Event Forward plugin can't read any event from the query since the query returns no active channel. Please check channels in the query and make sure they exist and you have access to them....","categories": ["Microsoft"],
        "tags": ["Security","WinRM","Registry","Event Log"],
        "url": "/solving-event-log-subscription-error-0x138c.html",
        "teaser": null
      },{
        "title": "Viewing detailed replication status using Repadmin and PowerShell",
        "excerpt":"Whenever I want to view the replication status in my domain, I use repadmin /replsum, which queries all of the DCs and gives me a summary of the replication links status per DC, which looks a little like this: If I wanted to get detailed information, I’d use repadmin /showrepl...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell","One-Liner","Active Directory"],
        "url": "/viewing-detailed-replication-status-using-repadmin-and-powershell.html",
        "teaser": null
      },{
        "title": "Investigating Repeatedly Locked Out Users",
        "excerpt":"I often get asked by some other IT guy “why does user XXXXX keep on getting locked out?” Let me clue you in on something - users (almost) always get locked out for the same reason: They try the wrong password too many times.The reasons for THAT, however, are quite...","categories": ["Microsoft"],
        "tags": ["Kerberos","Security","Mysteries Solved","Scripts","PowerShell","Event Log","Active Directory"],
        "url": "/investigating-repeatedly-locked-out-users.html",
        "teaser": null
      },{
        "title": "Filtering Windows Event Log using XPath",
        "excerpt":"When I want to search for events in Windows Event Log, I can usually make do with searching / filtering through the Event Viewer. For instance, to see all 4624 events (successful logon), I can fill the UI filter dialog like this: Event Logs: Security Event IDs: 4624 But sometimes...","categories": ["Microsoft"],
        "tags": ["Security","Scripts","Windows","PowerShell","Ramblings","Event Log"],
        "url": "/filtering-windows-event-log-using-xpath.html",
        "teaser": null
      },{
        "title": "Preventing Users from Adding Computers to a Domain",
        "excerpt":"Some time ago, we’ve come to the conclusion that the computer accounts in the domain are disorganized. After doing the tedious job of sorting existing accounts, we saw that new computer accounts are still being added to the “Computers” container, and we had no idea which computer was behind them...","categories": ["Microsoft"],
        "tags": ["Group Policy","Security","Mysteries Solved","Scripts","PowerShell","Active Directory"],
        "url": "/preventing-users-from-adding-computers-to-a-domain.html",
        "teaser": null
      },{
        "title": "Remotely changing DNS server list through registry",
        "excerpt":"Recently I was called to help some some friends who had an unusual problem: They demoted an old DC because they needed to raise the domain functional level, and after doing so many of their servers stopped working - they wouldn’t allow remote logins, the Exchange services wouldn’t start, while...","categories": ["Microsoft"],
        "tags": ["Kerberos","DNS","Mysteries Solved","Exchange","Registry","Active Directory"],
        "url": "/remotely-changing-dns-server-list.html",
        "teaser": null
      },{
        "title": "Adding .net 3.5 to a Windows Server 2012 template",
        "excerpt":"I was approached by some colleagues building a new VM template for Windows Server 2012 who wanted some help with .NET framework 3.5. ###The .NET oddity As anyone who messed a bit with Windows Server 2012 knows, the .NET framework 3.5 is one of two features (along with PowerShell v2,...","categories": ["Microsoft"],
        "tags": ["Scripts","Windows","Virtualization","PowerShell"],
        "url": "/adding-net-35-to-windows-server-2012-template.html",
        "teaser": null
      },{
        "title": "Putting your Windows to sleep",
        "excerpt":"Although there are many blog posts about configuring standby (“sleep”) in Windows, each one with its own insomnia joke, I thought I’d share my methodology . PowerCfg -energy:  The one tool to sort it all I only learnt about this command near the end of my testing, but it still...","categories": ["Microsoft"],
        "tags": ["Group Policy","Mysteries Solved","Windows","Power Management","Ramblings","Registry","Performance"],
        "url": "/putting-your-windows-to-sleep.html",
        "teaser": null
      },{
        "title": "Network Monitor capture filter limitations",
        "excerpt":"I recently had to deal with some network traffic issues, so naturally I turned to NetMon. My problem was with some TCP packets not reaching their destination. Since TCP has packet acknowledgements (meaning the receiving end says “packet received” or the packet is sent again), the issue was detectable as...","categories": ["Microsoft"],
        "tags": ["TCP","Mysteries Solved","Firewall","Network Monitor"],
        "url": "/network-monitor-capture-filter-limitations.html",
        "teaser": null
      },{
        "title": "Reading Daylight Saving Time Data in Windows",
        "excerpt":"When it comes to DST complexity, Israel has it worst (I think). We have our DST definition changed on a yearly basis, and consequently we have to repeat the DST deployment cycle (install update, check for timezone data, test DST-sensitive resources like Outlook calendars…) twice a year. Even simple users...","categories": ["Microsoft"],
        "tags": ["WMI","Calendar","Windows","W32tm","PowerShell","DST"],
        "url": "/reading-daylight-saving-time-data-in-windows.html",
        "teaser": null
      },{
        "title": "Finding Superseding WSUS updates in PowerShell",
        "excerpt":"Whenever I see a superseded update, I usually want to know which update supersedes it. Finding it from the console is easy enough: But of course, working through the UI is no fun. After you got an update object through PowerShell, like this: $wsus = Get-WsusServer WSUS2 -PortNumber 8530 $update...","categories": ["Microsoft"],
        "tags": ["Scripts","PowerShell","WSUS","One-Liner"],
        "url": "/finding-superseding-wsus-updates-in-wsus-powershell.html",
        "teaser": null
      },{
        "title": "Parsing Event Log Subscription Runtime Status using PowerShell and Regex",
        "excerpt":"The Story Since Event Log Subscription doesn’t have a module or a .NET class, interacting with its settings and status has to be done either via UI or the command line utility, wecutil.exe I was especially interested in getting the computers runtime status, to see which machines are failing (and...","categories": ["Microsoft"],
        "tags": ["Scripts","Regular Expressions","Windows","PowerShell","Event Log"],
        "url": "/parsing-event-log-subscription-runtime-status.html",
        "teaser": null
      },{
        "title": "Adding SSL to a SharePoint 2010 Web Application, the Right Way",
        "excerpt":"###The Story I haven’t touched SharePoint in a while, but I’ve been asked by a friend to help him do something “the right way”. We were looking for a way to add an HTTPS binding to an existing SharePoint 2010 site. Google is full of ways of doing that, but...","categories": ["Microsoft"],
        "tags": ["Security","HTTP","SharePoint","Scripts","IIS","PowerShell","One-Liner"],
        "url": "/adding-ssl-to-sharepoint-2010-web.html",
        "teaser": null
      },{
        "title": "Using Remote Desktop Client without Network Level Authentication",
        "excerpt":"Whenever I use Remote Desktop to connect to an NT6+ (Windows Vista / Windows Server 2008 and later) machine, I use Network Level Authentication, meaning that authentication with the server is performed before session is created (contrary to first connecting to the server and using its GUI to enter the...","categories": ["Microsoft"],
        "tags": ["Security","Windows","Terminal Server"],
        "url": "/using-remote-desktop-client-without-network-level-authentication.html",
        "teaser": null
      },{
        "title": "Backing up BitLocker to ActiveDirectory - My Additions",
        "excerpt":"The Story If you thought about deploying BitLocker in your enterprise, you probably came across the recovery issue - if you lose the encrypting smart card, corrupt the key file, forget the password or the TPM breaks down - how can you access the data? For small organizations, manual recovery...","categories": ["Microsoft"],
        "tags": ["Security","BitLocker","Scripts","Windows","FileSystem","PowerShell","Ramblings","Active Directory"],
        "url": "/backing-up-bitlocker-to-activedirectory.html",
        "teaser": null
      },{
        "title": "setspn Duplicates and Case Sensitivity",
        "excerpt":"Today I found out that the command I use to find duplicate SPNs, setspn -x is case sensitive, meaning that the following SPNs don’t count as duplicates: HOST/bla HOST/BLA This makes sense when using UNIX systems for TGS creation. However, Active Directory Domain Controllers, being Windows systems, are case-insensitive and...","categories": ["Microsoft"],
        "tags": ["Kerberos","Security","Scripts","Windows","Power Management","One-Liner","Event Log","Active Directory"],
        "url": "/setspn-duplicates-and-case-sensitivity.html",
        "teaser": null
      },{
        "title": "Avoiding Text Overflow with Prettify on Blogger",
        "excerpt":"I’m currently testing Prettify to replace SyntaxHighlighter as the syntax-highlighting solution in my blog. By the way, it’s nothing critical, but Blogger’s preview mode breaks because of SH’s inclusion (the reference URLs are being converted to https and break down) and the project’s homepage seems quite stale (latest version release...","categories": ["FOSS"],
        "tags": ["Prettify","CSS","HTML","Blog"],
        "url": "/avoiding-text-overflow-with-prettify-on-blogger.html",
        "teaser": null
      },{
        "title": "List all Group Policy Extensions Registered",
        "excerpt":"I use this script to see all GP extensions that my computer can process: ls 'HKLM:\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon\\GPExtensions' | select ` @{name='Guid';expression={[guid]$_.pschildname}} @{name='Name';expression={$_.GetValue('')}} @{name='DllName';expression={$_.GetValue('DllName')}} @{name='ProcessWhenNoChanges';expression={!$_.GetValue('NoGPOListChanges')}} @{name='IsUserPolicy';expression={!$_.GetValue('NoUserPolicy')}} Group Policy Extensions are the parts that apply the information found in Group Policy objects to the computer / user. While most settings are done...","categories": ["Microsoft"],
        "tags": ["Group Policy","Scripts","Windows","PowerShell","Registry","One-Liner","Active Directory"],
        "url": "/list-all-group-policy-extensions-registered.html",
        "teaser": null
      },{
        "title": "Raspberry Pi + Deluge = Segmentation Fault",
        "excerpt":"Note: This is relevant to any ARM based device running Linux I’m trying to use a Raspberry Pi as a torrentbox (an always-on BitTorrent client). If I ever finish this project, I’ll defiantly post my build. Anyway, I had a really annoying problem - every once in a while, the...","categories": ["FOSS"],
        "tags": ["Mysteries Solved","Linux","BitTorrent","Raspberry Pi","raspberrySeed","Ramblings","Deluge"],
        "url": "/raspberry-pi-deluge-segmentation-fault.html",
        "teaser": null
      },{
        "title": "Setting Up Samba on Raspberry Pi",
        "excerpt":"After setting up my rPi TorrentBox, I wanted to let my family access the downloaded files. Since they use Windows (and I don’t want to bother their systems with NFS), I wanted to install Samba on the rPi and create a read-only share (and a weak user for them to...","categories": ["FOSS"],
        "tags": ["Samba","Security","Linux","SMB","Raspberry Pi","raspberrySeed"],
        "url": "/setting-up-samba-on-raspberry-pi.html",
        "teaser": null
      },{
        "title": "Some PowerShell Snippets for Network Scanning",
        "excerpt":"I recently had to improvise some network scanning using PowerShell. The security guys got somewhat excited, so I decided to upload these snippets. I think all of them require PowerShell v2+ Checking ping for one IP address Test-Connection $target -count 1 -quiet Checking if a TCP port is listening function...","categories": ["Microsoft"],
        "tags": ["TCP","Security","HTTP","Scripts","Windows","PowerShell","One-Liner"],
        "url": "/some-powershell-snippets-for-network-scanning.html",
        "teaser": null
      },{
        "title": "Finding Accounts Trusted for Delegation",
        "excerpt":"As part of a security audit, I was asked to help in finding all accounts marked with “Trusted for Delegation” What is “Trust for Delegation” You can try reading the TechNet Article, but in short - delegation (also known as kerberos double-hop) is allowing a service to impersonate clients in...","categories": ["Microsoft"],
        "tags": ["Kerberos","Security","Scripts","Windows","Delegation","PowerShell","One-Liner","Active Directory"],
        "url": "/finding-accounts-trusted-for-delegation.html",
        "teaser": null
      },{
        "title": "Disabling \"generate Publisher Evidence\" using scripts",
        "excerpt":"I found the script we were using to disable authenticode on our machines, a feature that causes great suffering (and dll-loading-delays) to workstations not connected to the Internet when using various Microsoft products (i.e. SQL Management Studio, SharePoint). Note the line at the end - the script tries to find...","categories": ["Microsoft"],
        "tags": ["Scripts","Windows",".NET framework","XML","PowerShell"],
        "url": "/disabling-generate-publisher-evidence.html",
        "teaser": null
      },{
        "title": "Fixing Dynamic DNS on Gargoyle",
        "excerpt":"Note: I switched to inadyn on my home server eventually. I left this article because it’s still relevant I was digging through the logs of my latest Gargoyle installation (a router firmware based on OpenWrt, with a better UI in my opinion), and found out that Dynamic DNS updates were...","categories": ["FOSS"],
        "tags": ["DNS","Mysteries Solved","Gargoyle","Scripts","Linux","Networking","DDNS","Bash"],
        "url": "/fixing-dynamic-dns-on-gargoyle.html",
        "teaser": null
      },{
        "title": "Mass-Checking SSH Connections using Parallel",
        "excerpt":"Today I wanted to make sure I have SSH access to about 100 servers. Obviously, I wasn’t going to verify the list by hand, so I put all of the servers’ names in a file, and wrote this little script: for NAME in $(cat ~/Desktop/server-names) do echo -n \"$NAME \"...","categories": ["FOSS"],
        "tags": ["Scripts","SSH","One-Liner","Bash","Parallel"],
        "url": "/mass-checking-ssh-connections-using-parallel.html",
        "teaser": null
      },{
        "title": "Listing Unity's Scopes and Originating Package",
        "excerpt":"I recently upgraded to Ubuntu 14.04 (beta2), and I got all of my “lenses” (searching additional items in the dash menu), that look like this: Of course there’s a way to disable those lenses, but I actually want to remove those I’ll never use (like flickr). The problem  - lenses...","categories": ["FOSS"],
        "tags": ["Unity","Scripts","Linux","Parallel","Ubuntu","Bash"],
        "url": "/listing-unitys-scopes-and-originating-package.html",
        "teaser": null
      },{
        "title": "Python Library for Deluge Torrent Maintenance",
        "excerpt":"Update: I added this project as my first GitHub repo I have an ongoing project which I nickname my raspberrySeed, which is a Rasbperry Pi running Deluge. Works 24/7, takes very little power, minimal heat, no noise, works as a fine seedbox. However, I recently encountered strange situtations in which...","categories": ["FOSS"],
        "tags": ["Programming","Scripts","Raspberry Pi","raspberrySeed","Ramblings","Python","Deluge"],
        "url": "/python-library-for-deluge-torrent-maintenance.html",
        "teaser": null
      },{
        "title": "Automatically Mounting USB drives and Surviving Reconnects",
        "excerpt":"Today I solved a problem that has been bothering me for a while - being unable to automatically “remount” my USB drive in case it disconnects and reconnects. ###The Story My raspberrySeed (rPi + Debian + Deluge) has a USB drive connected (to keep the downloaded content in). The filesystem...","categories": ["FOSS"],
        "tags": ["Mysteries Solved","Scripts","Linux","FileSystem","Raspberry Pi","raspberrySeed","udev"],
        "url": "/automatically-mounting-usb-drives-and-surviving-reconnects.html",
        "teaser": null
      },{
        "title": "Fixing Ugly Hebrew on Ubuntu + Firefox",
        "excerpt":"The default viewing experience, when visiting some Hebrew sites when using Firefox on Ubuntu, is quite unsightly. If we check Ynet.co.il, a news site, we’ll see this biblical font being used: Let’s check which fonts Ynet asks to be viewed in: If you look at the marked part, you’ll see...","categories": ["FOSS"],
        "tags": ["Linux","Fonts","HTML","Ubuntu","Firefox"],
        "url": "/fixing-ugly-hebrew-on-ubuntu-firefox.html",
        "teaser": null
      },{
        "title": "Testing Local Facebook Applications with ABE",
        "excerpt":"I’m using Firefox with NoScript, which is the AdBlock of scripts - allowing you to selectively block scripts according to various rules (e.g. block all scripts from analytics.google.com), and additionally helps protecting you from XSS (cross site scripting). One of the components in NoScript is ABE (Application Boundaries Enforcer), which...","categories": ["FOSS"],
        "tags": ["Security","Facebook","Development","NoScript","Firefox","HTTP"],
        "url": "/testing-local-facebook-applications-with-abe.html",
        "teaser": null
      },{
        "title": "Hijacking a process's i/o streams using gdb",
        "excerpt":"The Story I recently had a very annoying problem - some daemon failed, but ran fine when told to run at foreground (not daemonize). Running at foreground is the easiest way to debug processes, because that way you get their input / output / error streams in your terminal. Said...","categories": ["FOSS"],
        "tags": ["Scripts","Linux","gdb","Debugging","Bash"],
        "url": "/hijacking-processs-io-streams-using-gdb.html",
        "teaser": null
      },{
        "title": "Timing Execution By Output Lines",
        "excerpt":"The Story Today I got annoyed that some puppet agent runs took me over 90 seconds to complete, even though they actually did nothing (no change was needed). I wanted to see which part of the run took the longest, so I tried this: sudo puppet agent --test --debug Unfortunately,...","categories": ["FOSS"],
        "tags": ["Programming","Perl","Scripts","Linux","One-Liner","Bash"],
        "url": "/timing-execution-by-output-lines.html",
        "teaser": null
      },{
        "title": "Setting up Gargoyle as a Time Server",
        "excerpt":"The Story For reasons unknown to me, Debian’s NTP daemon only works on udp port 123, even when operating as a client. This is a problem because my network configuration does not allow incoming packets on this port, thus preventing my raspberrySeed (raspberry pi running Debian, deluge, flexget) from syncing,...","categories": ["FOSS"],
        "tags": ["Mysteries Solved","Gargoyle","Linux","Raspberry Pi","Debian","raspberrySeed","NTP"],
        "url": "/setting-up-gargoyle-as-time-server.html",
        "teaser": null
      },{
        "title": "Adding Repositories for Inspection",
        "excerpt":"Sometime I want to inspect software repositories. However, I don’t want my machine to actually install anything from it. To do so, I made a small bash function that both adds the repository and pins it to priority -1, telling apt to never install anything from it (unless manually told...","categories": ["FOSS"],
        "tags": ["Scripts","Linux","Debian","Apt Pinning","One-Liner","Apt"],
        "url": "/adding-repositories-for-inspection.html",
        "teaser": null
      },{
        "title": "My Pinning Guidelines",
        "excerpt":"In my previous post about pinning I talked about the reasons to configure apt pinning. This post details my logic about what and how to pin. Pinning technicalities How pinning is done The best way to pin stuff is to add files in /etc/apt/preferences.d/ Those files are parsed whenever the...","categories": ["FOSS"],
        "tags": ["Security","Linux","Debian","Apt"],
        "url": "/my-pinning-guidelines.html",
        "teaser": null
      },{
        "title": "Why Pinning",
        "excerpt":"There are plenty of guides about apt pinning, but no one really explains the motivation to do so. It took me some time to understand that, so I thought I’d write it down. The Issue The mainstream method of downloading and installing packages from a repository is via APT (Advanced...","categories": ["FOSS"],
        "tags": ["Security","Linux","Debian","Apt"],
        "url": "/why-pinning.html",
        "teaser": null
      },{
        "title": "Linux and SSDs - Should You TRIM?",
        "excerpt":"Note: Although my experience is with Debian, I think this post helps anyone using some modern Linux distribution. What is TRIM? As a Windows sysadmin, I didn’t really consider the cons of running on top of Solid-State Drives, or SSDs. These drives are based on flash memory (similar to a...","categories": ["FOSS"],
        "tags": ["Mysteries Solved","Linux","FileSystem","Debian","Ramblings","Ubuntu","Performance"],
        "url": "/linux-and-ssds-should-you-trim.html",
        "teaser": null
      },{
        "title": "Accessing a specific server in an HTTP cluster",
        "excerpt":"The Problem Part1 - Fault tolerence A common configuration of web servers is setting up multiple servers to serve the same content, with a load-balancing method redirecting / forwarding clients to a specific server. For instance, let’s say I’m using servers server and otherserver to serve the site cluster-name. The...","categories": ["FOSS"],
        "tags": ["HTTP","Web","Scripts","PowerShell","curl","linux"],
        "url": "/accessing-specific-server-http-cluster.html",
        "teaser": null
      },{
        "title": "Validating network segments using Puppet",
        "excerpt":"The Problem When configuring KeepaliveD using Puppet, sometimes an interface name has to be used. Imagine a server with 2 interfaces (eth0,eth1), where one is facing the internal network and one is facing the internet. My puppet configuration for an internet-facing virtual interface can be something like: keepalived::vrrp::instance { 'external_interface':...","categories": ["FOSS"],
        "tags": ["Puppet","Networking","Regex"],
        "url": "/validating-network-segments-using-puppet.html",
        "teaser": null
      },{
        "title": "Git Prompt Variables",
        "excerpt":"I recently reinstalled my laptop and had to reconfigure my git prompt. I use the git prompt script that is included in Ubuntu’s git package, and integrate it into my prompt by editing ~/.bashrc, executing source /etc/bash_completion.d/git-prompt, and adding $(__git_ps1) to my PS1 variable, just before the ending \\$ (which...","categories": ["FOSS"],
        "tags": ["git","bash"],
        "url": "/git-prompt-variables.html",
        "teaser": null
      },{
        "title": "Downloading Artifacts from Jenkins with Authentication",
        "excerpt":"Some Background Jenkins is a platform for build automation, and as such allows you to store the results of the build (the binaries, commonly known as “artifacts”) for later. I saw other people on the internet manually downloading their results via the web UI: However, I wanted to pull the...","categories": ["FOSS"],
        "tags": ["Jenkins","Linux","Security","HTTP"],
        "url": "/artifcats-jenkins-authentication.html",
        "teaser": null
      },{
        "title": "AWS's Block Device Mapping in CentOS",
        "excerpt":"The Story I’m using Amazon’s EC2 for some of my VMs, which run CentOS. When viewing Block Device Mappings (mapping between the virtual storage - ebs, ephemerals etc. and the block devices inside the VM) in CentOS 6.5, I ran into an annoying issue. When inspecting my instance metadata using:...","categories": ["FOSS"],
        "tags": ["Linux","AWS","Virtualization","Mysteries Solved","Ruby","Perl","Scripts","Chef"],
        "url": "/aws-block-device-centos.html",
        "teaser": null
      },{
        "title": "SSH vs OpenVPN for Tunneling",
        "excerpt":"Update 28.01.16 I found some sites referring to this post. Below are the common complaints I saw, and my replies: I’m criminally bad with setting up OpenVPN, meaning the testing is completely off I’m not an expert in networking, but I have a working knowledge of it and I spent...","categories": ["FOSS"],
        "tags": ["Mysteries Solved","Networking","Linux","SSH","Security"],
        "url": "/ssh-openvpn-tunneling.html",
        "teaser": null
      },{
        "title": "Troubleshooting StatsD",
        "excerpt":"About StatsD StatsD is a tool developed by Etsy and Flickr (complicated story). Its main use is providing a middleman for Graphite, which is a real-time graphing tool, mainly used for performance metrics. Thanks to StatsD, I can use TCP sockets between servers (guaranteeing packet delivery), while processes generating the...","categories": ["FOSS"],
        "tags": ["Troubleshooting","Networking","Linux","StatsD"],
        "url": "/troubleshooting-statsd.html",
        "teaser": null
      },{
        "title": "CSV Tricks",
        "excerpt":"The Story I’ve been requested to recreate some spreadsheet for our execs. Being annoying as usual, I made it a point to only use scripting to build the tables. Most of the reconstruction is interesting in an unrelated way, but I wanted to post about some little gimmicks that helped...","categories": ["FOSS"],
        "tags": ["Linux","Ruby","CSV","Spreadsheets","Office","LibreOffice"],
        "url": "/csv-tricks.html",
        "teaser": null
      },{
        "title": "Getting Git Submodule Detailed Status",
        "excerpt":"The Story I manage every one of my Chef cookbooks as a single git repository, complying with the BerkShelf paradigm. I keep them all as submodules in a “supermodule”, to allow my teammates to easily clone them all. I can use git status from the supermodule to get submodule information...","categories": ["FOSS"],
        "tags": ["Linux","Bash","git","chef"],
        "url": "/git-submodule-status.html",
        "teaser": null
      },{
        "title": "Booting with UUID without initramfs",
        "excerpt":"The Story I recently wiped my CubieTruck (a single board computer, like RaspberryPi), and tried installing the root filesystem on a hard drive instead of the built-in NAND, due to the NAND’s tendency to get corrupted. I used Igor Pečovnik’s Image, which is really convenient, as I like it better...","categories": ["FOSS"],
        "tags": ["Linux","Boot","Mysteries Solved","ARM"],
        "url": "/boot-uuid-without-initramfs.html",
        "teaser": null
      },{
        "title": "Resizing AWS root EBS in CentOS HVM",
        "excerpt":"Update 04.07.15 This method doesn’t work anymore because of some weird AWS restriction, which says you can’t connect the root device of a marketplace AMI (like the CentOS one) to another VM, lest you discover its secrets. I developed a better method which involves either rebooting or creating a custom...","categories": ["FOSS"],
        "tags": ["Linux","AWS","Virtualization","Mysteries Solved","Ruby","Perl","Scripts","Storage"],
        "url": "/resizing-aws-root-centos-hvm.html",
        "teaser": null
      },{
        "title": "Locking Down Jenkins' Authentication",
        "excerpt":"Update 19.02.15 After posting my script in the Jenkins mailing list, I was told about a simpler way for implmenting my authorization strategy. I’m leaving this post because the things I learnt from developing the plugin are still valuable and may help someone someday. The REAL solution We’ll be using...","categories": ["FOSS"],
        "tags": ["Linux","Java","Security","Jenkins"],
        "url": "/locking-down-jenkins-authentication.html",
        "teaser": null
      },{
        "title": "Managing chef users with Chef",
        "excerpt":"I needed to create seperate Chef accounts for some utility program running in my Chef server. I was finally able to deprecate it today, but I saved those snippets because they’re neat. These snippets use chef-server-ctl, which is a utility software included in Chef server’s installation The bits Interesting points...","categories": ["FOSS"],
        "tags": ["Security","Linux","Chef","Ruby"],
        "url": "/chef-users-with-chef.html",
        "teaser": null
      },{
        "title": "Batch fitting pictures in ImageMagick",
        "excerpt":"I recently bought a digital frame for some of my more elderly relatives. The frame’s firmware was quite retarded, and I had 2 issues with it: 1. Pictures were always displayed in order This might be a “not a bug but a feature” type of situation, but still. I solved...","categories": ["FOSS"],
        "tags": ["ImageMagick","images","bash","scripts"],
        "url": "/batch-fitting-imagemagick.html",
        "teaser": null
      },{
        "title": "Scripting YUM provides search using Python",
        "excerpt":"Update 24-06-15 Thanks to this page, I fixed my script. It no longer requires root privillages. I also muted informational messages because they were not very informational. The Story Today I had a list of files (nagios check scripts), and I wanted to check for every file if there’s a...","categories": ["FOSS"],
        "tags": ["Python","Scripts","CentOS","Linux"],
        "url": "/yum-python-provides.html",
        "teaser": null
      },{
        "title": "Init file for HBase Thrift Server",
        "excerpt":"As part of our HBase setup, we run Thrift servers. This is pretty simple, except for the init files. Since we’re running Thrift standalone (and not as part of a full HBase server), I couldn’t find a perfect fit from googling. I eventually settled for this puppet template, but it...","categories": ["FOSS"],
        "tags": ["Bash","HBase","Linux","SysVInit"],
        "url": "/thrift-init.html",
        "teaser": null
      },{
        "title": "Appending Newline to File Ends with Ruby",
        "excerpt":"I recently took over managing some config files from my dev colleagues. I was extremely annoyed to be reminded that Notepad (Windows’ text editor) does 2 major Unix-incompatible things: CRLF line ending (\\r\\n and not \\n) No newline at the end of file, which is something of a nicety to...","categories": ["FOSS"],
        "tags": ["Script","Ruby","Windows","Linux"],
        "url": "/ruby-newline-file.html",
        "teaser": null
      },{
        "title": "Managing EC2 reservations with Scripts",
        "excerpt":"The Story Since we tend to hold our AWS EC2 VMs for a long time, we usually reserve them. Reservations are like pre-buying instances - you pay AWS ahead of time for (let’s say) a year, and get a discounted price. The insterestng thing about EC2 reservations is that they...","categories": ["FOSS"],
        "tags": ["AWS","EC2","Scripts","Ruby"],
        "url": "/ec2-reservations.html",
        "teaser": null
      },{
        "title": "Chroot Snippet",
        "excerpt":"The Story Some time ago, my PC wouldn’t boot. This was my fault, as I needed to resize some partition, and resizing in Linux really means deleting the partition and creating a new one in the same place. I forgot to assign the partition the same UUID, which caused Ubuntu...","categories": ["FOSS"],
        "tags": ["Troubleshooting","Linux"],
        "url": "/chroot.html",
        "teaser": null
      },{
        "title": "Installing Growroot on CentOS",
        "excerpt":"The story I currently work with CentOS on Amazon EC2. As I previously written, The HVM version of the AMI is created with a partitioned disk, instead of having the filesystem written directly on the block device. Problem is, when creating a root device bigger than the default (8G), you...","categories": ["FOSS"],
        "tags": ["Linux","Virtualization","AWS","Disk","CentOS"],
        "url": "/growroot-centos.html",
        "teaser": null
      },{
        "title": "Preparing Certificate files for Nginx",
        "excerpt":"The Story When installing SSL certificates for nginx, assuming you’re using certificate hierarchy (and not a self-signed ceritificate), you’re required to concatenate all of the certificate files (*.crt) to a single file, starting from your site’s certificate up to the root certificate. Today I got this bundle to prepare, courtesy...","categories": ["FOSS"],
        "tags": ["nginx","security","ssl","scripts","ruby"],
        "url": "/nginx-crt-script.html",
        "teaser": null
      },{
        "title": "Sending HBase metrics to Graphite using Python",
        "excerpt":"The story Although HBase is a crucial component in our current stack, the monitoring for it was quite incomplete. We only had general “is it running?” monitoring, with some very application-specific tests (“make sure scanning this table doesn’t take too long”). By sending detailed metrics on our HBase tables/regions/servers to...","categories": ["FOSS"],
        "tags": ["PYthon","Scripts","HBase","Monitoring","Graphite","StatsD"],
        "url": "/hbase-graphite-python.html",
        "teaser": null
      },{
        "title": "Using RPMBuild - My Shortlist",
        "excerpt":"The Story I was trying to tinker with Abrt, a daemon in charge of collecting and diagnosing various crashes in RHEL (more on that in a different post). Because the crash hook is written in C (it was designed to be really quick), I couldn’t use my usual method of...","categories": ["FOSS"],
        "tags": ["RPM","Linux","CentOS","RHEL","Scripts","Building"],
        "url": "/rpmbuild.html",
        "teaser": null
      },{
        "title": "Sending mail on coredumps",
        "excerpt":"The Story I recently found out that some of our backend code suffers from memory-related ceashes, namely SIGSEGV (a program tries to access memory it doesn’t own). My initial response was to install and enable Abrt, which is a collection of utilities used in RHEL. Ubuntu has a similar tool...","categories": ["FOSS"],
        "tags": ["Linux","Scripts","Python","Email"],
        "url": "/mail-coredumps.html",
        "teaser": null
      },{
        "title": "Migrating Graphite's Dashboards",
        "excerpt":"I just made a small script to migrate dashboards between two graphite servers. Couldn’t find a similar one anywhere, so I thought I’d upload it. Note it’s using http for its HTTP calls. It looks real nice. old_server='http://old.server.com:1234' new_server='http://better.server.com:123' creds=['top','secret'] require 'http' require 'json' h=HTTP.basic_auth(user: creds[0], pass: creds[1]) board_names=JSON.parse(h.post(\"#{old_server}/dashboard/find/\", form:...","categories": ["FOSS"],
        "tags": ["Graphite","Ruby","Scripts"],
        "url": "/graphite-migrate-dashboards.html",
        "teaser": null
      },{
        "title": "Troubleshooting story - Java HTTP client crashes on connections",
        "excerpt":"Google Bait This post isn’t about the solution, but rather about the methodology. Anyway, to help people experiencing the same issue find this post: CentOS 6.6 (fresh from chef/centos-6.6 Vagrant Box) Java 1.7.0 (java-1.7.0-openjdk) DOES NOT happen with Java 1.8.0 (java-1.8.0-openjdk) Happens because of interaction with nss (was version 3.16.1,...","categories": ["FOSS"],
        "tags": ["Ramblings","Java","SSL","HTTP","CentOS","Linux"],
        "url": "/java-ssl-crash.html",
        "teaser": null
      },{
        "title": "How Chef's use_inline_resources works",
        "excerpt":"I recently had an issue with use_inline_resources. This feature’s documentation is lackluster, and I learnt about its magic thanks to some scraps of information. I wanted to share some of my info about how it actually works. The basics use_inline_resources is used to separate a LWRP’s run context from the...","categories": ["FOSS"],
        "tags": ["Chef","Linux","Ruby"],
        "url": "/chef-inline.html",
        "teaser": null
      },{
        "title": "Chef Snippets",
        "excerpt":"I thought I’d upload some interesting Chef-related snippets I accumulated. Chef Shell chef-shell is an easy way to gain the context of a Chef client. I mainly use it to debug recipes by executing little bits of them in the shell. As client If you’re running it on a standard...","categories": ["FOSS"],
        "tags": ["Chef","Ruby","Vagrant"],
        "url": "/chef-snippets.html",
        "teaser": null
      },{
        "title": "Running Xbox360 controllers on Ubuntu",
        "excerpt":"I wanted to write a few lines on how I configured my controller on Ubuntu to work with Steam games, since I discovered some neat stuff. What I’ve got Xbox 360 wireless standard controller, with cable (the one you use with the Xbox 360 console) Xbox 360 Gaming Reciever Ubuntu...","categories": ["FOSS"],
        "tags": ["xbox","ubuntu","steam"],
        "url": "/xbox360-controller-ubuntu.html",
        "teaser": null
      },{
        "title": "Managing AWS Security Groups with Piculet",
        "excerpt":"The Problem One of the first things I noticed when starting to work with AWS is that security groups are very hard to maintain: Name and description are immutable - One can’t modify the name/description of a Security Group after it’s created Groups contain magical constants - There is no...","categories": ["FOSS"],
        "tags": ["AWS","Security","Firewall","Piculet","Ruby"],
        "url": "/piculet.html",
        "teaser": null
      },{
        "title": "Generating known_hosts file using Chef",
        "excerpt":"The Story This post relates to my previous post. I was trying to create a script to amend my known_hosts file (where SSH keeps fingerprints of all of the servers it connected to in the past, to prevent MitM attacks) with SSH keys collected by Chef. This benefits me in...","categories": ["FOSS"],
        "tags": ["Ruby","Scripts","Chef","SSH"],
        "url": "/chef-known-hosts.html",
        "teaser": null
      },{
        "title": "Merging known_hosts files",
        "excerpt":"The Story Some time ago, some colleague rebuilt several servers and reused their names (think sql1,sql2 etc). Obviously the new servers had different SSH server keys than the old ones, so my known_hosts file was out of date. I considered manually removing the old key fingerprints, but decided that I...","categories": ["FOSS"],
        "tags": ["Python","Scripts","SSH"],
        "url": "/merge-known-hosts.html",
        "teaser": null
      },{
        "title": "Running Inline DSL in ChefSpec",
        "excerpt":"The Problem I have a pet Chef cookbook in charge of managing SELinux policies in Linux machines (Take a look). Until today I got along fine without testing, because the cookbook barely had any logic to be tested. The only test I had (contributed by someone) just made sure the...","categories": ["FOSS"],
        "tags": ["Chef","Testing","Ruby","Scripts","ChefSpec"],
        "url": "/chefspec-inline.html",
        "teaser": null
      },{
        "title": "Writing Complex Scripts in HBase Shell",
        "excerpt":"The Story HBase installations include a shell for running arbitrary commands. For instance, if you want to view all of your snapshots, you can do something like: [me@server ~]$ hbase shell HBase Shell; enter 'help&lt;RETURN&gt;' for list of supported commands. Type \"exit&lt;RETURN&gt;\" to leave the HBase Shell Version 0.94.22, rb3b224ddca3530139c0685fd5c52e37368b428df,...","categories": ["FOSS"],
        "tags": ["HBase","Ruby","Java","Scripting"],
        "url": "/complex-hbase-shell.html",
        "teaser": null
      },{
        "title": "Detecting Invalid External References in Group Policy Preferences",
        "excerpt":"Guest post This is a post written by my former colleague, Ofri Sherf. I’ve been bugging her to upload her script and write how it works because it sounded interesting to me. The story I was asked to arrange Group Policy in one of our networks - e.g delete all...","categories": ["Microsoft"],
        "tags": ["Scripts","Group Policy","Powershell"],
        "url": "/gpp-external-references.html",
        "teaser": null
      },{
        "title": "Listing Chef Cookbook Licenses",
        "excerpt":"As part of a compliance check for our company, I was required to print the name/version of all FOSS proejcts I’m using. Most of it was digging around Gemfiles and setup.pys, which isn’t that interesting. The neat part was this snippet to extract license information from cookbooks installed on Chef...","categories": ["FOSS"],
        "tags": ["Chef","Ruby","Licensing"],
        "url": "/chef-licenses.html",
        "teaser": null
      },{
        "title": "Enhancing Packer Templates with eRuby",
        "excerpt":"The Problem Packer is a great tool for creating machine images, and I’m using it to create EC2 AMIs. My issue with it is that Packer is using JSON for input, and JSON is very inflexible. For instance, you can’t: Write comments (there was an issue open for two years...","categories": ["FOSS"],
        "tags": ["Ruby","Packer","Scripts"],
        "url": "/packer-erb.html",
        "teaser": null
      },{
        "title": "Using a global lock in Chef",
        "excerpt":"The Story Our dev team is currently using a Snowflake-like ID generation scheme that looks like this: (Diagram by Elad Rosenhim, architect and companion at Dynamic Yield. See his post about distributed keys and how to survive managing an HBase cluster) Those familiar with MongoDB might notice this structure is...","categories": ["FOSS"],
        "tags": ["Chef","Mutex","Lock","Ruby","Scripts"],
        "url": "/chef-lock.html",
        "teaser": null
      },{
        "title": "Open-Gridview - the FOSS Out-Gridview",
        "excerpt":"The Story I’ve been a Microsoft SysAdmin for a long time before switching for Linux. During which, I scripted a lot in PowerShell. PowerShell has several “output” functions like Out-File (which passes the input to a file), Out-Null etc. One of these functions was Out-Gridview which tabularizes its input and...","categories": ["FOSS"],
        "tags": ["Python","PowerShell","Scripts"],
        "url": "/open-gridview.html",
        "teaser": null
      },{
        "title": "Managing Jenkins API Tokens",
        "excerpt":"The problem Api Tokens are like user passwords, except they are always managed by Jenkins (even if you’re using an external authentication scheme), and can only be used for “API” actions (e.g. using curl). The storage scheme of these tokens is a little weird - the stored value is hashed...","categories": ["FOSS"],
        "tags": ["Jenkins","Security","Scripts","Groovy"],
        "url": "/jenkins-token.html",
        "teaser": null
      },{
        "title": "Parsing AWS billing",
        "excerpt":"The Story I never understood the AWS billing very well and happily left it to my CTO. A couple of days ago, however, my CTO secretly told me he’s mainly interested in learning 2 things from those bills: How much are we paying for every component of the application? How...","categories": ["FOSS"],
        "tags": ["AWS","Billing","Scripts","Python"],
        "url": "/aws-billing.html",
        "teaser": null
      },{
        "title": "Chef Custom Resources - Missing Documentation",
        "excerpt":"The new Chef documentation for Custom Resources is pretty lackluster. This is probably because they’re too busy making awesome stuff, but I still needed to learn some stuff the hard way. Thought I’d share them. The basics There is no longer a “state-only” resource and an implementing provider. Instead, there...","categories": ["FOSS"],
        "tags": ["Ruby","Chef","Scripts"],
        "url": "/chef-custom-resources.html",
        "teaser": null
      },{
        "title": "Backslasher-Python: a simple Chef Python cookbook",
        "excerpt":"What’s wrong with the current Python cookbook Until now, we were using the Python cookbook. This worked well for a while, until I noticed these things: This cookbook is being deprecated, and replaced by poise-python, meaning some day the Python cookbook will be a wrapper around poise-python. Even today, when...","categories": ["FOSS"],
        "tags": ["Ruby","Python","Chef"],
        "url": "/backslasher-python.html",
        "teaser": null
      },{
        "title": "Running external Ruby code from Vagrant",
        "excerpt":"The Story Like a lot of Chef users, I’m using Vagrant for testing my cookbooks. I’m also using Berkshelf for providing the Vagrant box with the cookbooks it needs. Until recently, I was happy using the ChefDK-provided Berlshelf (v4.0.1). I stopped being happy when running berks started consuming CPU for...","categories": ["FOSS"],
        "tags": ["Linux","Vagrant","Ruby","Mysteries Solved","Chef"],
        "url": "/vagrant-external-ruby.html",
        "teaser": null
      },{
        "title": "Migrating Grafana's Dashboards",
        "excerpt":"Similar to my Graphite dashboard migration script, I made a Grafana one. I’m targeting Grafana v2+. Note it’s using http for its HTTP calls. old_server='http://OLDY' new_server='http://NEWY' creds=['user','pass'] require 'http' require 'json' h=HTTP.basic_auth(user: creds[0], pass: creds[1]) board_names=JSON.parse(h.get(\"#{old_server}/api/search\").to_s).map{|i|i['uri'].gsub(/^db\\//,'')} board_names.map do |b| dat=JSON.parse(h.get(\"#{old_server}/api/dashboards/db/#{b}\").to_s) dat['dashboard'].delete('id') resp = h.post(\"#{new_server}/api/dashboards/db\", body: {dashboard: dat['dashboard'], overwrite: true}.to_json, headers:...","categories": ["FOSS"],
        "tags": ["Grafana","Ruby","Scripts"],
        "url": "/grafana-migrate-dashboards.html",
        "teaser": null
      },{
        "title": "Cookbook Versioning Script",
        "excerpt":"The Problem I’ve always disliked releasing cookbook versions manually. The process requires a lot of bureaucratic steps which are easy to forget and require no thought at all. Before I had this script, I sometimes avoided modifying the cookbook’s version when I only applied “a little fix”, losing the ability...","categories": ["FOSS"],
        "tags": ["Scripts","Ruby","Bash","Chef"],
        "url": "/cookbook-versioning.html",
        "teaser": null
      },{
        "title": "Filtering in Shell",
        "excerpt":"Today I told someone that a feature I’m missing in Bash is filtering. Then I thought about how much I miss it, so I went ahead and “implemented” it. Filtering in other lanaugaes Basically, I’m referring to taking a collection/stream of items, running some code on every one, and only...","categories": ["FOSS"],
        "tags": ["Scripts","Bash","Shell"],
        "url": "/shell-filter.html",
        "teaser": null
      },{
        "title": "Some Jenkins helpers for Chef",
        "excerpt":"I’ve decided to share some code I use in Chef to pull some data and files from Jenkins JenkinsQuery This is a helper class, in charge of getting build-related data # slasher_development/libraries/jenkins_query.rb module SlasherDevelopment class JenkinsQuery def initialize(server,user,password,job) @scheme='https' # Modify if needed @server=server @user=user @password=password @job=job end def get_json...","categories": ["FOSS"],
        "tags": ["Jenkins","Chef","HTTP"],
        "url": "/chef-jenkins-helpers.html",
        "teaser": null
      },{
        "title": "Dry Run for Python Pip",
        "excerpt":"As I wrote some time ago, I started my own python cookbook for Chef because I didn’t like the direction the “default” one was going. I recently added a new feature that I wanted to talk about. I called it smart_install in the cookbook, but it’s actually a “dry-run” mode...","categories": ["FOSS"],
        "tags": ["Scripts","Python","Pip"],
        "url": "/pip-dry-run.html",
        "teaser": null
      },{
        "title": "Chef \"Share This\" script",
        "excerpt":"I wrote this little script to upload the current cookbook to the Chef Supermarket. It should be run from within the cookbook’s directory. #!/bin/bash knife cookbook site share -o ../ $(basename $(realpath .)) -c ~/.chef/knife-supermarket.rb Where my supermarket config is as simple as: node_name 'SUPERMARKET_USERNAME' client_key 'CLIENTKEY_LOCATION' Interesting points: I’m...","categories": ["FOSS"],
        "tags": ["Chef","Ruby","Scripts"],
        "url": "/chef-share.html",
        "teaser": null
      },{
        "title": "Keeping Windows Awake (with PowerShell)",
        "excerpt":"The story I got a new game on Steam and got set to downloading it. For some reason, Steam and Windows have decided that it’s better to save some electricity and put my computer to sleep, rather than finish my game. Today I discovered that instead of playing my game...","categories": ["Microsoft"],
        "tags": ["Windows","Power Management","Performance","Scripts","PowerShell"],
        "url": "/windows-awake-ps.html",
        "teaser": null
      },{
        "title": "My tips on Getting a Job",
        "excerpt":"A lot of people (&gt;3) asked me in the last month or so about how to land a first job after leaving the army / graduating from university, so I thought I’d write a post about it. I think this post will mainly be helpful for those who look for...","categories": ["Misc"],
        "tags": ["Ramblings"],
        "url": "/job-guide.html",
        "teaser": null
      },{
        "title": "DNS Override for a Single Process",
        "excerpt":"The Problem I needed to run a mobile emulator on my laptop, in order to test some DNS server changes before releasing them. However, since the emulator had no option to override its DNS settings it used my laptop’s DNS settings, so to make it query a different server I...","categories": ["FOSS"],
        "tags": ["DNS","Scripts","C","Linux"],
        "url": "/dns-override.html",
        "teaser": null
      },{
        "title": "Prettify HTML pages with BeautifulSoup",
        "excerpt":"The story Today I wrote some HTML page by hand (my new homepage). I then used this script to make the HTML code nicer: The script This requires the BeautifulSoup module for python #!/usr/bin/env python import sys from bs4 import BeautifulSoup def bs_file(filename): with open(filename, 'r') as f: data =...","categories": ["FOSS"],
        "tags": ["Scripts","Python","BeautifulSoup","HTML"],
        "url": "/bs-prettify.html",
        "teaser": null
      },{
        "title": "DNS Namesake - the DNS MitM",
        "excerpt":"The Story Imagine this situtation: THE WORLD / company.com | A s1.red.company.com A s2.red.company.com ... A sN.red.company.com CNAME lb.red.company.com -&gt; s1.red.company.com CNAME lb.red.company.com -&gt; s2.red.company.com ... CNAME lb.red.company.com -&gt; sN.red.company.com A s1.blue.company.com A s2.blue.company.com ... A sN.blue.company.com CNAME lb.blue.company.com -&gt; s1.blue.company.com CNAME lb.blue.company.com -&gt; s2.blue.company.com ... CNAME lb.blue.company.com -&gt; sN.blue.company.com...","categories": ["FOSS"],
        "tags": ["DNS","Python"],
        "url": "/dns-namesake.html",
        "teaser": null
      },{
        "title": "Stringify Hash Keys in Ruby",
        "excerpt":"Why I didn’t want sybols in my YAML Apperantly, Psych (Ruby’s default YAML lib) does not convert symbols to strings when creating YAML: require 'yaml' puts 'a'.to_yaml # --- a # ... puts :a.to_yaml # --- :a # ... The Python YAML library keeps those colons, are they’re not special...","categories": ["FOSS"],
        "tags": ["Ruby","Scripts"],
        "url": "/stringify-hash.html",
        "teaser": null
      },{
        "title": "Getting Magent Links from Deluge",
        "excerpt":"My latest weekend-hack is a plugin that shows the magnet link for a torrent entry Why I had something torrented a long time ago, and a friend asked me for the torrent. However, I haven’t kept the original .torrent file, she was tech-oriented enough so I can give her the...","categories": ["FOSS"],
        "tags": ["Python","Scripts","BitTorrent","Deluge"],
        "url": "/deluge-show-magnet.html",
        "teaser": null
      },{
        "title": "Populating a NetworkX graph with a scanner",
        "excerpt":"I had a graph living outside Pythonland (a commit tree with dependencies) and wanted to do graphy things to it. To do that, I first had to put the data into a NetworkX graph. I wrote this code bit to discover a graph-like structure and put into a NetworkX (or...","categories": ["FOSS"],
        "tags": ["Scripts","Python","Graphing"],
        "url": "/networkx-populate.html",
        "teaser": null
      },{
        "title": "Driven by anger - my modus machinor",
        "excerpt":"modus machinor - my adjustment of “modus operandi” for “engineering” I recently noticed that I’m doing engineering work out of anger. However, it seems like I’m doing a good job, so I thought I’d share my method, which I worked hard on. You might recognize yourself in some of this,...","categories": ["Misc"],
        "tags": ["Ramblings"],
        "url": "/driven-by-anger.html",
        "teaser": null
      },{
        "title": "Sortiq - sort, uniq, sort",
        "excerpt":"This is a small snippet I find extremely useful. You should have it in your ~/.bashrc: sortiq() { sort | uniq -c | sort -rn ; } It will count the instances of each line, sorting them from most common to least common. What is this for It answers the...","categories": ["FOSS"],
        "tags": ["Linux","Scripting","Bash"],
        "url": "/sortiq.html",
        "teaser": null
      },{
        "title": "Disqus instead of Juvia",
        "excerpt":"TL;DR: I switched from Juvia to Disqus after losing all of my blog’s comments Why I lost all of my blog’s comments Basically, I was a fool. I had my Juvia setup running on a single server in AWS, with a standalone mySQL server. My setup auto-updated every time a...","categories": ["FOSS"],
        "tags": ["Disqus","Rambling"],
        "url": "/disqus.html",
        "teaser": null
      },{
        "title": "Adding a child element in XSLT",
        "excerpt":"I recently had to edit a big XML file, and add a child elemnt to every element within. To simplify matters, say I had something like this: &lt;?xml version=\"1.0\" encoding=\"UTF-8\"?&gt; &lt;rooty xmlns:ppl=\"some_identifier\"&gt; &lt;ppl:person&gt; &lt;age&gt;42&lt;/age&gt; &lt;name&gt;bob&lt;/name&gt; &lt;/ppl:person&gt; &lt;ppl:person&gt; &lt;age&gt;53&lt;/age&gt; &lt;name&gt;doggo&lt;/name&gt; &lt;/ppl:person&gt; &lt;/rooty&gt; I wanted to add a &lt;cow&gt; element to every...","categories": ["FOSS"],
        "tags": ["XSLT","scripts"],
        "url": "/xslt-add-child.html",
        "teaser": null
      },{
        "title": "The BIG BUTTON with Arduino",
        "excerpt":"I’ve created a dramatic big button, that actually sends key presses to the computer. It’s connected to the computer via USB, and programmable via the same connection, meaning we can change the key presses it sends as we like. The button I got a factory button from eBay. The listing...","categories": ["FOSS"],
        "tags": ["arduino","linux"],
        "url": "/arduino-big-button.html",
        "teaser": null
      },{
        "title": "Extracting SGN files used by the Israeli Court System",
        "excerpt":"The Story One of my friends has some dealings with the Israeli courts. The noteworthy (and annoying) part of their digital documents is that these documents are using a novel format instead of some industry standard. Files arriving by email have the SGN suffix, and the email includes the following...","categories": ["FOSS"],
        "tags": ["Scripts","Linux"],
        "url": "/sgn-extractor.html",
        "teaser": null
      },{
        "title": "Switching audio bluetooth profiles with a script",
        "excerpt":"I wanted to be able to switch between “listening to music” and “using the headphone’s microphone” easily. i3blocks allows me to write scripts emit a status line, and can accept “clicks” in the form of environment variables to respond. I wrote one that, using the pulseaudio CLI: Checks how many...","categories": ["FOSS"],
        "tags": ["Scripts","Linux"],
        "url": "/bluetooth-profile-script.html",
        "teaser": null
      },{
        "title": "Arduino Mouse Mover",
        "excerpt":"I have a friend who is working from home. This friend has a manager who’s way of measuring people’s productivity is ensuring said people are active on Slack. My friend staretd limiting themselves from taking lunch breaks, which is not ideal. Something had do be done to keep the manager...","categories": ["FOSS"],
        "tags": ["Arduino"],
        "url": "/arduino-mousemove.html",
        "teaser": null
      },{
        "title": "Productivity tips for a FAANG engineer",
        "excerpt":"Here are some things I learnt during my career in Facebook, and think could benefit someone new to the field. As an engineer in Facebook, you have a great degree of freedom for managing your time, and you’re mostly judged about the “impact” you provide. Ordered by decsending order of...","categories": [],
        "tags": ["Ramblings"],
        "url": "/productivity-tips-faang.html",
        "teaser": null
      },{
        "title": "CSV to JSON stream converter in Python",
        "excerpt":"I’ve been working with some govermental data that is available as huge (&gt;50G) CSV files. While there are workarounds to working with large files, I wanted to keep the stream processing I do with JSON files. However, this was not a JSON file. Stream processin with CSV is hard. jq...","categories": [],
        "tags": ["Python"],
        "url": "/python-csv-to-json.html",
        "teaser": null
      },{
        "title": "Arch Linux ARM ethernet card rename (eth0 to end0)",
        "excerpt":"Yesterday I installed updates and rebooted my Arch Linux rpi before going to sleep. First of all, this is a mistake because you shouldn’t install updates if you don’t have time to troubleshoot the fallout 🥲 Secondly, I discovered I no longer had network access to my rpi. Today, after...","categories": [],
        "tags": ["Linux"],
        "url": "/alarm-eth-rename.html",
        "teaser": null
      },{
        "title": "Quick Docker Compose commands for ECS",
        "excerpt":"I’m pretty new to Dockering in the wild, and I’m trying to use the new ECS integration to push all of my tiny app to the cloud. This is a list of tiny helpers I wrote. Logout of all registries cat ~/.docker/config.json | jq '.auths | keys[]' -r | xargs...","categories": [],
        "tags": ["Linux","Docker","AWS"],
        "url": "/docker-commands.html",
        "teaser": null
      },{
        "title": "Caddy is better than Nginx for Docker Compose on ECS",
        "excerpt":"I recently managed to use Docker Compose to launch a small app in Aamazon’s Elastic Container Services (ECS). Overall, the result is pretty incredible. I’m able to run all of my containers in AWS, with volumes and netowrks and all, with only a docker-compose.yaml file needed. However, my biggest issue...","categories": [],
        "tags": ["Linux","Docker","AWS"],
        "url": "/docker-compose-ecs-nginx-caddy.html",
        "teaser": null
      },{
        "title": "Processing Israeli FOIA calendars, Part 1",
        "excerpt":"Preface I’m a volunteer in the Israeli Public Knowledge Workshop (wiki), which is a nonprofit working to increase transparency of Israeli’s ruling bodies (e.g. Goverment, Municipal authorities, courts). I recently picked up a nice project that I thought would be worth a read. Under the Israeli equivalent of FOIA (Freedom...","categories": [],
        "tags": ["Python","Israel"],
        "url": "/foia-calendars-pt1.html",
        "teaser": null
      },{
        "title": "Sapling Commands",
        "excerpt":"Sapling (the Facebook-released SCM) is great, but the docs are not-great. I thought I’d list some commands it took me a while to undertand, for me and for others Create remote tag sl push --to tags/v0.0.5 Where v0.0.5 is the tag name. The “remote” is because there are no local...","categories": [],
        "tags": ["Linux","Sapling","Git"],
        "url": "/sapling-commands.html",
        "teaser": null
      },{
        "title": "Changed 3 lines of code, saved 760 server hours per month",
        "excerpt":"Act 1, where I write Java In the past, I had the opportunity to assist a team in developing an Android application and a Java server. While my primary focus was on the networking and container environment, a hackathon presented an opportunity to dive deeper into the app’s functionality. I...","categories": [],
        "tags": ["Ramblings"],
        "url": "/3-loc-760h.html",
        "teaser": null
      },{
        "title": "Get Android App Sizes with ADB",
        "excerpt":"Upon receiving a notification from my NVidia Shield indicating that it was running low on storage space, I attempted to use the device’s interface to troubleshoot the issue. I found the interface to be cumbersome and unintuitive. Fortunately, I had recently enabled the Android Debug Bridge (ADB) for the purpose...","categories": [],
        "tags": ["Linux","Bash","Android","JQ"],
        "url": "/android-app-sizes.html",
        "teaser": null
      },{
        "title": "a 1.5GB string",
        "excerpt":"In my previous role, I supported a Java service that operated similarly to RDP or Citrix by enabling remote UI functionality. This service relied on sessions, which consisted of interconnected Java objects that were supposed to be cleaned up either when a user logged out or after a predetermined timeout...","categories": [],
        "tags": ["Java","Ramblings"],
        "url": "/1.5GB-string.html",
        "teaser": null
      },{
        "title": "Is this really an emergency?",
        "excerpt":"One of the teams I worked with would do an “engineering pain-point” survey twice a year. During one of those surveys, the main complaint was that on-calls had a hard time getting help from other teams or even engineers from their own team. I shadowed an on-call rotation for a...","categories": [],
        "tags": ["Ramblings","ops"],
        "url": "/is-this-an-emergency.html",
        "teaser": null
      },{
        "title": "Bash \"Keep or Delete\" script for PDFs",
        "excerpt":"I recently discovered that I had over 100 PDFs in my “Downloads” directory and needed to determine which ones I wanted to keep. Instead of spending 10 minutes manually sorting them, I invested 20 minutes in writing a script to assist me. The script iterates through all the provided arguments...","categories": [],
        "tags": ["Linux","PDF","Bash"],
        "url": "/pdf-keep-or-delete.html",
        "teaser": null
      },{
        "title": "WSL for non-programming security analysts",
        "excerpt":"I have a friend who isn’t a developer and believes that coding is beyond their grasp. They work as a security analyst and prefer using Windows as their operating system. I discovered that introducing them to the Windows Subsystem for Linux significantly enhanced their daily tasks. It allowed them to...","categories": [],
        "tags": ["Linux","Windows","WSL","Bash"],
        "url": "/wsl-security-analysts.html",
        "teaser": null
      },{
        "title": "`javax.mail:mail` 1.4.7 is broken, and how to workaround",
        "excerpt":"javax.mail and I One of the current tasks on my agenda involves the modernization of a project that is currently built on Java 8. Given that this project is actively in use and under continuous development, a complete freeze of the codebase for a one-time migration isn’t a feasible option....","categories": [],
        "tags": ["Java"],
        "url": "/javax-mail-1.4.7.html",
        "teaser": null
      },{
        "title": "Patching a Java JAR",
        "excerpt":"I’m working with a company that uses smart IoT devices produced far away. The main troubleshooting tool is a Java utility provided by the manufacturer. This utility is provided as a ZIP file containing a JAR with the main logic, and some additional libraries. Executing this JAR works well on...","categories": [],
        "tags": ["Java","Python"],
        "url": "/jar-patch.html",
        "teaser": null
      },{
        "title": "We don't do DST at this company",
        "excerpt":"Once, a long time ago, I used to have a consulting gig in some big enterprise-y company. It had a lot of unique challenges, being disconnected from the internet (for security reasons, I was told) and therefore having practically everything in-house. I spent my time with not only the proto-devops-people...","categories": [],
        "tags": ["Microsoft","Windows","DST"],
        "url": "/no-dst.html",
        "teaser": null
      },]
