Title: Setting Up Samba on Raspberry Pi
Date: 2014-06-23 13:12
Author: Nitzan Raz (noreply@blogger.com)
Tags: Samba, Security, Linux, SMB, Raspberry Pi, raspberrySeed
Slug: setting-up-samba-on-raspberry-pi

After setting up my rPi TorrentBox, I wanted to let my family access the
downloaded files.  
Since they use Windows (and I don't want to bother their systems with
NFS), I wanted to install Samba on the rPi and create a read-only share
(and a weak user for them to access the share with).  
I found a lot of guides for setting up Samba, but every one was missing
something, so I documented my own procedure:  
  
<span style="font-size: large;">1. Plan Configuration</span>  
Answer these questions before you start:  

-   Shares:
    -   Are you going to use authentication or guest access? (hint:
        authentication is better)
    -   Is the share read-only?
    -   What is the share name? (best to keep it in lower-case)
    -   What is the physical path the share is pointing to? Is it always
        mounted or on a removable drive?

    .

-   Users / authentication:
    -   Do you need to change the workgroup's name?
    -   Do you need to disable password encryption (VERY old clients)?
    -   How many different remote-access users will be required? How are
        they called? 
    -   Do some users already exist as UNIX users?

It's much easier working with a clear understanding of the desired
configuration.  
<a name="more"></a>  
<span style="font-size: large;">2. Prepare Access User</span>  
Create the linux user you want to use (in my case "theothers"). You can
use this command:  

~~~~ {.prettyprint}
adduser --shell /bin/false --no-create-home
~~~~

**Note that:**  

-   Shell is set to /bin/false to help prevent the user from actually
    logging in
-   No home directory is created, because the user isn't supposed to
    login anyway

<span style="font-size: large;">3. Prepare Permissions</span>  
Make sure the access user can't do too much damage, because it might be
abused. I limited its permissions to read (since I don't want my family
messing about the directory anyway).  
I won't go into the POSIX permissions model, but the best way to test
the user's permissions is to impersonate that user using   

~~~~ {.prettyprint}
sudo su -s /bin/bash theothers
~~~~

Note that the terminal prompt changes to show the impersonated user,
like "theothers@bestrpi". Try and test everything:  

<table>
<tbody>
<tr>
<th>
Command

</th>
<th>
Access tested

</th>
</tr>
<tr>
<td>
touch

</td>
<td>
Creating files

</td>
</tr>
<tr>
<td>
mkdir

</td>
<td>
Creating directories

</td>
</tr>
<tr>
<td>
ls

</td>
<td>
Listing directories

</td>
</tr>
<tr>
<td>
tail

</td>
<td>
Reading files

</td>
</tr>
</tbody>
</table>
Use "exit" when finished to return to your own user  
<span style="font-size: large;">  
</span><span style="font-size: large;">4. Install Samba</span>  
As always, you should update & upgrade before:  

~~~~ {.prettyprint}
sudo apt-get update ; sudo apt-get upgrade
~~~~

The installation couldn't be simpler:  

~~~~ {.prettyprint}
sudo apt-get install samba
~~~~

  
<span style="font-size: large;">5. Create User Mapping</span>  
Assuming you're using the default authentication method (you should!),
any user accessing Samba should be imported to the Samba user database.  
Use this command to add the user. I'm not sure about password
synchronization, so I just gave it the same password as the "real"
user.  
\* sudo pdbedit -a -u theothers  
  
<span style="font-size: large;">6. Edit Configuration File</span>  
This is the hardest part. I'd back up the configuration file to
somewhere safe and start fresh.  
Refer to [this
site](http://www.samba.org/samba/docs/using_samba/ch06.html) and [this
one](http://www.samba.org/samba/docs/man/manpages/smb.conf.5.html) for
how the configuration file should look like.  
After modifying the configuration, restart the Samba service to apply:  
\* sudo service samba restart  
You can test your shares from gnome, using "connect to server" and using
the "smb" initial  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-Xwz02QA65Fg/UtOjRqKCLDI/AAAAAAAAETM/sU4YBuwimHY/s1600/ConnectToServer.png)](http://1.bp.blogspot.com/-Xwz02QA65Fg/UtOjRqKCLDI/AAAAAAAAETM/sU4YBuwimHY/s1600/ConnectToServer.png)

</div>

  
<span style="font-size: large;">7. Apply to Clients</span>  
Make sure everything works. I find it best to restart all involved
machines and testing again, to make sure all settings are persistent.  
When accessing the shares from Windows, I find it best to use network
drives. Check "reconnect at sign-in" to make the drive "permanent" and
check "Connect using different credentials".  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-3Y-MfLzAv4c/UtOjdRqzKdI/AAAAAAAAETU/1_Lz45jeJBs/s320/NetworkDrive.png)](http://2.bp.blogspot.com/-3Y-MfLzAv4c/UtOjdRqzKdI/AAAAAAAAETU/1_Lz45jeJBs/s1600/NetworkDrive.png)

</div>

(photo
from [techynotes](http://techynotes.net/question-how-do-i-map-a-network-drive-in-windows-8/))
  
Use the workgroup from the Samba configuration as a domain, e..g
"WORKGROUP\\theothers".  
  
Enjoy your Samba server!

</p>

