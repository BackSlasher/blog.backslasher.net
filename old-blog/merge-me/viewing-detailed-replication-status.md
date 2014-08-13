Title: Viewing detailed replication status using Repadmin and PowerShell
Date: 2013-05-03 11:46
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, PowerShell, One-Liner, Active Directory
Slug: viewing-detailed-replication-status

<p>
Whenever I want to view the replication status in my domain, I use
"repadmin /replsum", which queries all of the DCs and gives me a summary
of the replication links status per DC, which looks a little like this:  

~~~~ {.brush:text}
repadmin /replsum
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-9runFgr7zfs/UYOahIsT0JI/AAAAAAAADQA/yMX54HEpsvE/s320/replsum.png)](http://1.bp.blogspot.com/-9runFgr7zfs/UYOahIsT0JI/AAAAAAAADQA/yMX54HEpsvE/s1600/replsum.png)

</div>

If I wanted to get detailed information, I'd use "repadmin /showrepl \*"
which would print some information for every replication link:  

~~~~ {.brush:text}
repadmin /showrepl *
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-Xm7andzW3Cw/UYOahFh5I-I/AAAAAAAADPk/Gml8En-gAUc/s320/showrepl.png)](http://3.bp.blogspot.com/-Xm7andzW3Cw/UYOahFh5I-I/AAAAAAAADPk/Gml8En-gAUc/s1600/showrepl.png)

</div>

Since I have more than two DCs in some environments, looking at all of
the information is quite a long read and I usually avoid using this
option unless I have to.  
Recently, I discovered a nifty trick.  
repadmin /showrepl has a csv options, which isn't exciting by itself:  

~~~~ {.brush:text}
repadmin /showrepl * /csv
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-aS8dUIE_YO4/UYOahi0Lw8I/AAAAAAAADP8/0f5aijZn-XQ/s320/showreplCsv.png)](http://3.bp.blogspot.com/-aS8dUIE_YO4/UYOahi0Lw8I/AAAAAAAADP8/0f5aijZn-XQ/s1600/showreplCsv.png)

</div>

However, combined with PowerShell's "ConvertFrom-Csv", I could convert
the link status rows into objects and filter them within PowerShell:  

~~~~ {.brush:ps}
repadmin /showrepl * /csv | ConvertFrom-Csv
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-_B8VZxw0BaM/UYOaiGu7xDI/AAAAAAAADQE/mGYkfiCo58I/s320/showreplCsvPowerShell.png)](http://2.bp.blogspot.com/-_B8VZxw0BaM/UYOaiGu7xDI/AAAAAAAADQE/mGYkfiCo58I/s1600/showreplCsvPowerShell.png)

</div>

Now, for example, if I wanted to view all links that had replication
errors, I could use  

~~~~ {.brush:ps}
repadmin /showrepl * /csv | ConvertFrom-Csv | ?{$_.'Number Of Failures'}
~~~~

And I can even display all of the links in GridView, for ease of use:  

~~~~ {.brush:ps}
repadmin /showrepl * /csv | ConvertFrom-Csv | ogv
~~~~

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-RRCzHF_Pmxk/UYOaiAF_DPI/AAAAAAAADP4/e8iIuanTqeI/s320/replGridView.png)](http://1.bp.blogspot.com/-RRCzHF_Pmxk/UYOaiAF_DPI/AAAAAAAADP4/e8iIuanTqeI/s1600/replGridView.png)

</div>

  
Enjoy!

</p>

