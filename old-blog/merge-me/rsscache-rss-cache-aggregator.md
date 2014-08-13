Title: RssCache - An RSS Cache / Aggregator
Date: 2012-03-09 19:28
Author: Nitzan Raz (noreply@blogger.com)
Tags: MySQL, Programming, PHP, RSS, BitTorrent, Ramblings, SQL
Slug: rsscache-rss-cache-aggregator

<p>
Hi.  
  
Recently I've decided that I want to use μTorrent's Feed ability to auto
download BitTorrent torrents, after I gave up on Miro (I moved my video
library and discovered that Miro couldn't take it, and to change that
setting without losing all of my preferences I would have to edit some
mini-db... ugh). This minor decision had some interesting effects...  
  
<span style="font-size: large;">The Problem</span>  
I'm a member of a certain torrent sharing site, and I tried feeding that
site's feed to uTrorrent. The problem I discovered - The feed was only
showing the latest 100 items, and since a new torrent is uploaded every
10 mins or so, If I leave my client off for a day, some items are bound
to go undiscovered. I tried leaving my PC on at night, but I couldn't
sleep. I considered moving my torrent-box to an "offsite" place (another
room), but found it to complex.  
  
<span style="font-size: large;">The Solution</span>  
Eventually, I came up with quite an elegant solution - Creating a small
PHP site (which I call RssCache) that'll consume the torrent site's
feed, save the items on its own db, and present the client with a bigger
feed.  
  
**Edit:**  
Today I've finished all of the UI using
[YII](http://www.yiiframework.com/)! You're more than welcome to [check
it out](http://apps.oneboredadmin.com/rssCache/).  
  
  
I chose a PHP/MySQL solution, because I have a nice hosting package at
dreamhost.com.  
My primary pages are:  
**Cron.php** - Triggered by a cron job (duh) and populates the database
with the feed items  
**Feed.php** - Given the right key, creates an RSS feed from the db and
presents it  
  
The coding itself isn't that impressive - it's a very small solution.
However, there are some interesting points I've encountered and wish to
share with you:  
**Purging items:**  
I thought that altough I want the list to be beefy, items will have to
die sometime. So I created a "created" column and added a little
statement at the start of the cron script to purge the table from items
72 hours old.   
**Storing feed items in the db:**  
I initially started parsing the feed with
[MagpieRSS](http://magpierss.sourceforge.net/), but then thought about
what info to store in the db - if I correlate the item fields to table
columns, I won't have room for extra item data.  
If I serialize the PHP object, I'd have to reconstruct it when I serve
the feed. Eventually I decided to simply store the entire item's XML in
the db.  
**Detecting duplicates:**  
Storing feed items in the db is easy, but avoiding duplicate items is
quite difficult, especially because the RSS structure offers no id or
unique key. I started comparing rows based on the entire item xml, but
later found out that my particular torrent site changed the item's
description based on the seed/leech ratio, and made the item appear
twice. I thought about that for a while, and decided that item URLs are
supposed to be unique, so I created a "link" field on the item table,
used solely to detect duplicates, combined with the item's parent (the
source feed).  
**Avoiding db-intensive operations:**  
Like any decent programmer, I try to avoid overworking the db, because
it's almost always the weak spot in data-driven applications (even tiny
ones like mine).  
Unfortunately for the MySQL server, I'm inserting the feed items to the
db one at a time (I know I can add several items with a single INSERT,
but it'll be more difficult to utilize PDO's prepared statements, which
save me the trouble of escaping my data, which can be quite annoying
when messing with xml).  
However, I decided that to compensate for the single-item statements,
I'll save the duplicate-checking for later. Eventually I ended up
inserting the items to a temporary table, and adding to the real table
the results of a left outer join between the tables, selecting only the
temp rows that have no matching "permanent" rows. The query looks
something like this:  

~~~~ {.brush: .sql}
insert into items (select t.FeedId,t.RssData,current_timestamp,t.link from tempitems tleft join items i ON i.FeedId = t.FeedId AND i.link = t.linkWHERE i.FeedId IS NULL)
~~~~

**Sorting items:**  
When I started testing my little script, I saw that new items are
appended to the end of the list (rather than the head, where it's placed
at the "real" feed). I considered sorting the items by "created"
(descending, of course), but eventually realised that it's not that
important for now, and will consume considerable time when the table
gets larger.  
**Some sort of security:**  
I didn't want to be bothered with authentication on this site (after
all, creating a user management system for two php pages is kind of
stupid), and I don't have https on my hosting, but I still didn't want
my rss to be available for the whole world to see. In addition to
separating the served feeds into "channels" (each channel can aggregate
several feeds) and giving each channel a unique int id and a friendly
name (used as a title), I gave each channel its own 20-Character key.
This key is used when fetching the feed, serving as a sort of password.
  
**Intelligent Indexing:**  
Considering the fact that the item table is expected to be quite large
and have many rows removed from it on an hourly basis, I avoided adding
the almost-mandatory "id" column to this table. The reason is that I'll
never be required to identify a single item, and creating a primary key
means that the server maintains an index on the table, and has to update
it when rows are added and more importantly, removed. Instead, I created
a non-unique index on the "created" column, to help the server find
expired items.  
I also count on the "feeds-items" foreign key to assist the server in
looking up items based on feed (useful when serving a specific feed).  
  
I finished coding in about 6 hours and the site is currently very much
alive at
[http://Apps.OneBoredAdmin.com/rssCache](http://apps.oneboredadmin.com/rssCache)
(fair warning  - at the moment the site has no UI whatsoever). I'll make
it more user-friendly when I feel like it. The important point is - I
can turn my computer off tonight safely!  
If you'd like to use my site feel free to comment, message me or
whatever, and I'll try to speed the UI development up.  
**Edit:**  
Finished! Check top for link  
  
Good night!

</p>

