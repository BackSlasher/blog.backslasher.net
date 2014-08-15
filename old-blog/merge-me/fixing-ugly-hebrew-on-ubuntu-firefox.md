Title: Fixing Ugly Hebrew on Ubuntu + Firefox
Date: 2014-06-23 13:01
Tags: Linux, Fonts, HTML, Ubuntu, Firefox
Slug: fixing-ugly-hebrew-on-ubuntu-firefox
OldSlug: fixing-ugly-hebrew-on-ubuntu-firefox

The default viewing experience, when visiting some Hebrew sites when
using Firefox on Ubuntu, is quite unsightly.  
If we check [Ynet.co.il](http://ynet.co.il/), a news site, we'll see
this biblical font being used:  
  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-IEBuCaWSaXM/U1j2alarILI/AAAAAAAAExg/us2qP-yM3ZI/s1600/ff-hebrew-ugly.png)](http://3.bp.blogspot.com/-IEBuCaWSaXM/U1j2alarILI/AAAAAAAAExg/us2qP-yM3ZI/s1600/ff-hebrew-ugly.png)

</div>

<a name="more"></a>Let's check which fonts Ynet asks to be viewed in:  

<div class="separator" style="clear: both; text-align: center;">

</div>

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-5EFvjy5uRIc/U1j47gxQFSI/AAAAAAAAExs/KU3UlSZBzMQ/s1600/ff-ynet-david.png)](http://2.bp.blogspot.com/-5EFvjy5uRIc/U1j47gxQFSI/AAAAAAAAExs/KU3UlSZBzMQ/s1600/ff-ynet-david.png)

</div>

If you look at the marked part, you'll see something like:  

~~~~ {.prettyprint}
font-family: "Arial","Arial (Hebrew)","David (Hebrew)","Courier New (Hebrew)"
~~~~

Now we see the reason - a lot of sites were designed and tested for
Windows  (surprise!), and as such require fonts that aren't free
([libre](http://en.wikipedia.org/wiki/Gratis_versus_libre)).  
For example, the font "David" is not free to use [at
all](http://www.fonts.com/font/masterfont/david). Because of that, such
fonts are not included in Ubuntu by default.  
  
<span style="font-size: x-large;">The Solution</span>  
Use this following command, taken from
[askubuntu](http://askubuntu.com/a/166995), to install Microsoft fonts.  

~~~~ {.prettyprint}
sudo apt-get install ttf-mscorefonts-installer culmus
~~~~

Complete installation, refresh and voila:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-MMN9NEY9NP4/U1j51dxKaUI/AAAAAAAAEx4/qmaAzqrqfxo/s1600/ff-hebrew-nice.png)](http://2.bp.blogspot.com/-MMN9NEY9NP4/U1j51dxKaUI/AAAAAAAAEx4/qmaAzqrqfxo/s1600/ff-hebrew-nice.png)

</div>

  
<span style="font-size: large;">Further reading:</span>  
[Microsoft typography  -
fonts](http://www.microsoft.com/typography/fonts/)  
[Microsoft Fonts at
ubuntu.com](https://help.ubuntu.com/community/RestrictedFormats/Microsoft_Fonts)

</p>

