---
title: SPNs - Who? Why? Where?
categories:
- Microsoft
tags:
  - Kerberos
  - SharePoint
  - Active Directory
  - Security
---

I was making an introduction to a new teammate about SharePoint
infrastructure, and one of the things I had to teach her about was SPNs.
I was surprised to know almost no one at our place knew what SPNs are
actually for. Until my PowerPoint presentation is ready, here is a
(relatively) short explanation:  
First of all, SPNs are part of how Kerberos authentication works, and is
used to help encrypt the Client-Server ticket. This a **very** basic
explanation of what's going on:  

1.  When the user logs in to an Active Directory domain, it recives a
    TGT (ticket-granting ticket), allowing the client to request other
    tickets. It's only capable of proving the client's identity to a DC.
2.  Whenever the client decides to authenticate to a service (for
    example, a web site), the client requests its DC for a CS
    (client-server) ticket, providing the TGT as proof of its identity.
3.  The DC replies with a CS ticket, **encrypted so that only the
    service can read it**. This ticket proves to this specific service
    that the ticket's holder is a specific client
4.  The client passes the CS ticket on (note it can't read it itself) to
    the service.
5.  The service decrypts the CS ticket, and therefore validates that the
    CS ticket-holder is in fact the user as claimed.

The SPN comes in step 3 (if you haven't guessed), to help the DC decide
how to encrypt the CS ticket. Understandably, the only thing that only
the DC and the service know (the **shared secret**) is the service
user's (the user running the service) password, or any hash derived from
it. So the DC encrypts the CS ticket with a hash of the service user's
password, and sends the ticket onwards.  
Let's look at an example:  
The user `Dom\Nitz` tries to connect to server `Dom\Server` in port
`81`:  

1.  Nitz logs on to the domain and gets a TGT for `Dom\Nitz`.
2.  Nitz opens his Internet Explorer and connects to
    `http://Server:81`.  
   The IE and the IIS on the other side negotiate Kerberos
    authentication.  
   IE requests from the DC (through windows, of course) a CS ticket for
    the **service** `http/Server:81` (notice the SPN shape)
3.  The DC creates the CS ticket and encrypts it with the service's
    password.  
   **Whose password should it use?**

If no SPN is specified, the DC assumes the service user is the server's
account, in our case `Dom\Server$,` and uses its password (yes,
computer accounts have passwords). Let's see what happens if the DC is
right:  

4.  The Client receives the CS ticket, and passes it on to the service
    on port 81.
5.  The web server (running as `Dom\Server$`) decrypts the ticket and
    validates the client's identity. Success!

The problem starts when this assumption is wrong. For example, when the
server is part of a SharePoint farm and port 81 is run from an appPool with
user `Dom\Service`. Let's see what happens then:  

4.  The Client receives the CS ticket, and passes it on to the service
    on port 81.
5.  The web server (running as `Dom\Service`) **tries** to decrypt the
    ticket, and fails (since its password wasn't the one used to encrypt
    it).  
   Kerberos Authentication Error, type `KRB_AP_ERR_MODIFIED`. :-(

The SPN, as you must have guessed, is a way to tell the DC something
like "encrypt all CS tickets for `http/Server:81` using `Dom\Service`'s
password". That way, CS tickets forwarded to this service will decrypt
correctly. It's done by adding the **Service Principle Name** (or "the
way the service is called"), composed of `Protocol/ServerName[:Port]`
(only specify port for non-defaults, like HTTP ports other than 80) to
the attribute on the service account in the Active Directory.

### What do I do?
#### The short answer
If you have a service not running as `SYSTEM`, but rather as a domain account, you have to use an SPN to allow kerberos authentication to it. Add the right SPN (such as `http/Server:81`) to the domain account
running the service. That's it. No restart, no logoff, nothing.
#### Details
You can either use `adsiedit` (BE CAREFUL!) to write to `ServicePrincipalName` of the right domain account, or use `SetSpn {SPN} {Domain\\Account}`

#### Protips
- Always register short (NETBIOS) server name (`Server`) and long (DNS) server name (`Server.Domain.Com`), to avoid glitches in authentication mechanizes and human errors.  
- Consider cleanups of decommissioned services (see `SetSpn` on server 2008+) to avoid duplicate SPNs (same SPN entry, two or more different users). Duplicate SPNs are bad, because the DC doesn't know who's password to use to encrypt the CS
ticket.
- If you're having Kerberos authentication issues, try
[troubleshooting](http://technet.microsoft.com/en-us/library/cc728430%28WS.10%29.aspx) before giving up and falling back to NTLM for good. Kerberos isn't that
complex to set up! (Only to troubleshoot...).

#### Pitfalls:
- Service account is:  
    - Locked out
    - Has different password than in AD (did you change the password?)
	- Lost `User Right Assignments` on the server (faulty Group Policy)
- User account is:
    - Locked out
	- Has different password than in AD ("Windows needs your current credentials" is usually that)
- Machines are:
    - With a firewall blocking necessary AD ports (to their respective DCs)
    - With a time difference greater than the Kerb tolerance policy (usually 5
    mins)
	- AD membership is messed up (use `NETDOM VERIFY`)
- Kerberos almost certainly won't work for
    - Computers set in different domains without trusts (ask the AD admins)
    - Computers outside a domain (duh)
	- Services addressed using IP (i.e. `http://127.0.0.1/`)

### Summary
Kerberos is a great auth mechanism
for windows-based services, and especially SharePoint (very little farm
config needed). SPNs are required if a non-SYSTEM user is used, or a
multi-FE farm is deployed (and you choose Kerberos).  
It's easy to deploy Kerberos auth (after making all possible mistakes), just make sure you're coupled with an AD guy to avoid stupid issues (like replication / incorrect account selection), and most importantly, DON'T PANIC!  
I hope this post will save at least one person a night of frustration, learning how to deploy SPNs the hard way.
