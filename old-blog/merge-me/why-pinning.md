Title: Why Pinning
Date: 2014-06-22 09:05
Author: Nitzan Raz (noreply@blogger.com)
Tags: Security, Linux, Debian, Apt
Slug: why-pinning
OldSlug: why-pinning

There are plenty of guides about apt pinning, but no one really explains
the motivation to do so. It took me some time to understand that, so I
thought I'd write it down.  
<a name="more"></a>  
<span style="font-size: large;">The Issue</span>  
The mainstream method of downloading and installing packages from a
repository is via APT [(Advanced Packaging
Tool)](http://en.wikipedia.org/wiki/Advanced_Packaging_Tool). When using
apt, the administrator usually says which package he wants installed,
but apt needs a bit more information:  
**Which source?**  
The same package may be available from multiple sources. For example, my
development server is set up to have 3 repositories, all containing some
version of python:  

-   The Debian stable repository, guaranteeing compatibility with other
    packages
-   The Debian backports repository, including more features but still
    pretty stable
-   The Debian unstable repository, offering many new features but
    risking weird behaviour and undiscovered bugs 

Unless told manually which repository to install from, apt has to choose
one by itself.   
**Which version?**  
When maintaining a server farm, it's important to remember two things:  

-   The software packages should be updated regularly, to protect the
    server from bugs and security vulnerabilities that were discovered
    (and fixed in newer versions).
-   Some upgrades shouldn't be allowed, because they modify the
    software's behaviour in an unacceptable way. For instance, upgrading
    mongodb to version 2.4 changes the JavaScript engine to
    multithreading, possibly messing up some scripts. The administrator
    can't afford having some servers with the new versions and some not,
    so when installing a new server the administrator doesn't want the
    new package.

In short, apt should choose a version that is new, but not too new.  
  
<span style="font-size: large;">Solution - Priorities</span>  
To solve this issue, apt assigns each package option
(name+version+source) a priority number. When installing a package, the
command usually looks something like:   

~~~~ {.prettyprint}
sudo apt-get install puppet
~~~~

Apt-get then collects all of the possible options, sorts them by
descending priority (highest priority to lowest) and then by descending
version. It chooses the top option and installs that. The administrator
can manipulate the options' priorities, causing apt to prefer the
"right" version.   
For example, I pinned my puppet agent package to a specific version.  
When executing:   

~~~~ {.prettyprint}
apt-cache policy puppet
~~~~

We can see the pinning:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-08VvCqkvanU/U5wSmogFZUI/AAAAAAAAIaQ/RdAtdLl9CXs/s1600/puppet-pinned.png)](http://2.bp.blogspot.com/-08VvCqkvanU/U5wSmogFZUI/AAAAAAAAIaQ/RdAtdLl9CXs/s1600/puppet-pinned.png)

</div>

  
<span style="font-size: large;">Defaults</span>  
For Debian / Ubuntu, all of the sources have the same priority - 500.
Usually, apt only encounters one option available of every package, so
there is no collision. When installing / upgrading packages, apt chooses
the latest version released by the official repository - the best
package to install.  
  
<span style="font-size: large;">Dangers of Pinning</span>  
Pinning causes apt to change its default behaviour, so if you're doing
it - you better have a reason. Incorrect pinning can cause:  

-   Not upgrading old packages, meaning you're exposed to security,
    performance and reliability issues
-   Upgrading to unstable versions, meaning you're exposed to (you
    guessed it) security, performance and reliability issues
-   Installing nonfunctional packages - some sources may upload packages
    that are incorrectly built, or contain wrong metadata, causing them
    to misbehave and even break other packages

See my [other
post](http://blog.oneboredadmin.com/2014/06/my-pinning-guidelines.html)
about pinning for guidelines about what to pin and how.  
  

</p>

