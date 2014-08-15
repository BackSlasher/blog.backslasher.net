Title: Group Policy Security Filtering and Loopback
Date: 2013-03-19 18:13
Author: Nitzan Raz (noreply@blogger.com)
Tags: Group Policy, Security, Mysteries Solved, Active Directory
Slug: group-policy-security-filtering-and
OldSlug: group-policy-security-filtering-and

I recently discovered that when applying a GP object using loopback and
user security filtering (allowing only specific users to apply the GP),
the computer still needs read access to the GP.  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-RtFwGTiJkoI/UUgqqzCcn8I/AAAAAAAAC5A/T2wlIseR0tw/s400/GPSecFiltering.png)](http://2.bp.blogspot.com/-RtFwGTiJkoI/UUgqqzCcn8I/AAAAAAAAC5A/T2wlIseR0tw/s1600/GPSecFiltering.png)

</div>

Otherwise, the GP will show up as not applied due to it being
"inaccessible":  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-rjG6sRVOxhk/UUhZw-dKfwI/AAAAAAAAC5Q/fdUq6V8S1lU/s400/GPInaccessible.PNG)](http://1.bp.blogspot.com/-rjG6sRVOxhk/UUhZw-dKfwI/AAAAAAAAC5Q/fdUq6V8S1lU/s1600/GPInaccessible.PNG)

</div>

My guess is that it's because the group policy engine is using the
computer account's security context to collect the loopback GPs.  
Basically, you have to give the computer account you wish to apply the
GP on read permissions on the GP object. You can simply use "Domain
Computers" if the content of the GP is not sensitive.  
You can either:  

-   Grant Read permissions through the "Delegation" tab:

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-sgDzdGGq1Lk/UUhgGlnNRiI/AAAAAAAAC5c/gsHQdKMpx7I/s320/GPDelegation1.png)](http://3.bp.blogspot.com/-sgDzdGGq1Lk/UUhgGlnNRiI/AAAAAAAAC5c/gsHQdKMpx7I/s1600/GPDelegation1.png)

</div>

-   Add the computers to the security filtering (only if the GP has no
    computer settings, otherwise they will apply):

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-2Rr7TY4Pl7Y/UUhhaE27XkI/AAAAAAAAC5g/2ggHlkc5dxk/s400/GPDelegation2.png)](http://3.bp.blogspot.com/-2Rr7TY4Pl7Y/UUhhaE27XkI/AAAAAAAAC5g/2ggHlkc5dxk/s1600/GPDelegation2.png)

</div>

<div class="separator" style="clear: both; text-align: left;">

  

</div>

Now the GP loopback will work fine.  
Enjoy!  
<span id="goog_2082493269"></span><span
id="goog_2082493270"></span><span id="goog_2082493267"></span><span
id="goog_2082493268"></span>

</p>

