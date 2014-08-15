Title: Automaticlly Extracting Downloaded Torrents
Date: 2012-04-14 20:17
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, BitTorrent, PowerShell
Slug: automaticlly-extracting-downloaded
OldSlug: automaticlly-extracting-downloaded

<p>
As every average geek, I too download torrents (containing only legal,
copyright-free material, of course), and most of the time the torrents
contain multi-file archives that contain the really juicy data. A lot of
times I return home, and find some new torrent has completed
downloading, but I have to manually extract the file and wait for THAT
to complete.  
Well, wait no more!  
Through µTorrent's "Run Program" setting
(Options\>Preferences\>Advanced\>Run Program), I can execute any command
line application I want whenever a torrent completes. Of course, I use
it to execute a PowerShell Script :-D  
The actual line I put there is:  

    powershell.exe -executionPolicy RemoteSigned -file  "%D" "%T" "%N" "%L"

The extra tags at the end are used to pass data to the script - namely
the torrent's incoming directory, primary tracker, title and primary
label. I keep all of the parameters other than the directory for future
use (for example, I may wish to send podcasts automatically into my
Kindle-Mail some day).  
The script itself only extracts rar files using the GREAT open-source
archiver [7zip](http://www.7-zip.org/) which has a command line
interface, and it goes like this:  

~~~~ {.brush:ps}
 param([string]$TorrentDir,[string]$Tracker,[string]$Title,[string]$Label)"TorrentDir:`t $TorrentDirTracker:`t $TrackerTitle:`t`t $TitleLabel:`t`t $Label"# Extract if torrent is composed entirely of rar files into smaller subfolder:# Check if directory has only rar$rars = ls $TorrentDir | ?{$_.name -match '\.r(ar|[0-9]{2})$'}$leadRar = ls $TorrentDir | ?{$_.name -match '\.rar$'}$nonrars = ls $TorrentDir | ?{$_.name -notmatch '^(Sample(s?)|.+\.r(ar|[0-9]{2})|.+\.sfv|.+\.nfo|folder.jpg)$'}if((!($nonrars)) -and $leadRar){    # Directory is release directory    echo "Extracting"    $exDir = (mkdir (join-path ($TorrentDir) 'Extracted')).fullname    $res = &'\Program Files\7-Zip\7z.exe' x "-o$($exDir)" "$($leadRar.fullname)" -y    if($res | ?{$_ -match 'Everything is Ok'}) {echo "All Good"}    else {Write-Error "Failed: $res";Read-Host "Press the any key to continue"}}else {echo 'nothing here'}
~~~~

You can see that first it outputs all of the details acquired from
µTorrent, checks if the incoming directory has only .rar files (and
secondary files, such as ".r01"), ignoring sample directories, .nfo
files etc. If so, it tells 7zip to extract the primary .rar file into a
directory called "Extracted".  
Hope it helps!

</p>

