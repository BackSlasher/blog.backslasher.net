Title: Group Policy Security Filtering and Loopback
Date: 2013-03-19 18:13
Category: Microsoft
Tags: Group Policy, Security, Mysteries Solved, Active Directory
Slug: group-policy-security-filtering-and-loopback
OldSlug: group-policy-security-filtering-and

I recently discovered that when applying a GP object using loopback and
user security filtering (allowing only specific users to apply the GP),
the computer still needs read access to the GP.  

![](|filename|/images/group-policy-security-filtering-and-loopback/GPSecFiltering.png)

Otherwise, the GP will show up as not applied due to it being
"inaccessible":  

![](|filename|/images/group-policy-security-filtering-and-loopback/GPInaccessible.PNG)

My guess is that it's because the group policy engine is using the
computer account's security context to collect the loopback GPs.  
Basically, you have to give the computer account you wish to apply the
GP on read permissions on the GP object. You can simply use `Domain Computers` if the content of the GP is not sensitive.  
You can either:  

- Grant Read permissions through the "Delegation" tab:

    ![](|filename|/images/group-policy-security-filtering-and-loopback/GPDelegation1.png)

**OR**

-  Add the computers to the `security filtering` (only if the GP has no
    computer settings, otherwise they will apply):

    ![](|filename|/images/group-policy-security-filtering-and-loopback/GPDelegation2.png)

Now the GP loopback will work fine.  
Enjoy!  
