---
title: Automaticlly Updating DNS Server Addresses In A Domain Machine
categories:
- Microsoft
tags:
  - DNS
  - Scripts
  - PowerShell
  - Active Directory
---

### The Problem
I was recently requested to make sure that our machine's network interface cards (NICs) have their DNS queries pointed to "the correct servers".  
I decided that every machine should point to its domain's DNS servers, and it's their job to redirect queries (if needed) to other DNS servers. Of course there are exceptions, but it seems like a good solution.  
In most companies, the domain controllers are the domain DNS servers, but some domain controllers may not be DNS servers, and some setups might be using other servers (like a secondary, read-only server for backup) to answer domain queries.  
So if you're going to implement my solution, you need to think about what are "the correct servers" in your case.

### The Solution
The solution to "the correct servers" I found is to query for A records for the domain name itself.  
DCs make sure to register their own records there, and if a sysadmin wants to add another DNS server, he only has to create an A record with the domain name pointing to its IP.  
Ideally, I would have queried for the NameServer records of the domain (`NS` type), since it's actually equivalent to asking the DNS servers "who can answer
queries on this domain?" but it wasn't so easy, because my 3 options for querying are:  

-   **Using** `[System.Net.Dns]::GetHostAddresses`:  
    Sadly, only `A`-type records are supported, which means I won't be able to query for `NS` records
-   **Using** `Add-Type` **to compile C\# code that uses** `DLLImport` **on** `dnsapi.dll`**, creates a wrapper function and call that function from
    PowerShell**:  
	It creates a hard-to-maintain script that throws win32 errors when fails (rather that simple .net exceptions) and can stop working on the next version of Windows
-   **Calling** `NSLookup` **and parsing the results**:  
	NSLookup's output isn't easy to read as a human - I have no intention to start explaining to a machine how to parse it

And so I ended up using the first method, because I figured that it's not that much of a crime, since I'm still getting my information from a domain-global location.

### The Logic
The script itself is pretty short, and works only on the local machine (since I'm planning to use SCCM or something similar to invoke it on all of my machines):  

1.  The machine's domain is determined
2.  All NICs with IP enabled (i.e. that are actually used) are being queried through WMI
3.  All IP addresses are collected from the NICs
4.  All NICs that "belong" to the domain (have the domain name as a DNS search suffix, thus filtering non-domain NICs, like internet-facing
    or iSCSI ones) are being collected
5.  `A`-type records of the machine's domain are being queried, excluding
    ones that are matching the machine's IP addresses (if such record is
    found, the machine is a DNS server itself)
6.  If the machine is a DNS server (as found in step 5), the address
    `127.0.0.1` is added to the top of the list, to make sure it tries
    querying itself first
7.  The generated DNS list is being written into every domain-related
    NIC

### The Code

~~~~ powershell
$compDomain = [DirectoryServices.ActiveDirectory.Domain]::GetCurrentDomain().Name
$nics = @(gwmi win32_networkAdapterConfiguration -filter 'IPEnabled=True');
$ipAddresses = @($nics | select -exp IPAddress)
$dnsNics = $nics | ?{($_.DNSDomainSuffixSearchOrder -contains $compDomain) -and ($_.DNSServerSearchOrder.Count)}
[bool]$isDNSServer=0
$dnsAddresses = @([net.dns]::GetHostAddresses($compDomain) | select -exp IPAddressToString | %{if($ipAddresses -contains $_){$isDNSServer=1}else{$_}})
if($isDNSServer) {$dnsAddresses =@('127.0.0.1')+$dnsAddresses }
$dnsNics | %{$_.SetDNSServerSearchOrder($dnsAddresses)} | out-null
~~~~

Have fun resolving!
