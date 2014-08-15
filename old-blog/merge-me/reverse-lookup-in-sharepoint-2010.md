Title: Reverse Lookup in SharePoint 2010
Date: 2012-12-29 15:34
Tags: Mysteries Solved, SharePoint, Office
Slug: reverse-lookup-in-sharepoint-2010
OldSlug: reverse-lookup-in-sharepoint-2010

Every SharePoint noob knows that one can create list lookup
relationships, like specifying that a book belongs in a specific
bookshelf.  
What I didn't know until today is SharePoint 2010 supports "reverse
lookup" out of the box!  
<span style="font-size: large;">What's Lookup?</span>  
Consider this.You have 2 lists in your SharePoint site - one that
contains books, and one that contains bookshelves:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-RJEpJacrEuM/UN8FOKD5ZhI/AAAAAAAACPY/ti_sxFLFcns/s400/RLookup1.png)](http://4.bp.blogspot.com/-RJEpJacrEuM/UN8FOKD5ZhI/AAAAAAAACPY/ti_sxFLFcns/s1600/RLookup1.png)

</div>

<span id="goog_1319405308"></span><span id="goog_1319405309"></span>  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-mh3lgrRToCY/UN8Fnok-KXI/AAAAAAAACPg/6vnuWO4xEdo/s400/RLookup2.png)](http://1.bp.blogspot.com/-mh3lgrRToCY/UN8Fnok-KXI/AAAAAAAACPg/6vnuWO4xEdo/s1600/RLookup2.png)

</div>

  
You now create a lookup column in the "Books" list that contains the
bookshelf that the book belongs to. That's easy:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://3.bp.blogspot.com/-ncsF29NOsCY/UN8Gt_mX7lI/AAAAAAAACPs/e-Eyu2v7HbM/s400/RLookup3.png)](http://3.bp.blogspot.com/-ncsF29NOsCY/UN8Gt_mX7lI/AAAAAAAACPs/e-Eyu2v7HbM/s1600/RLookup3.png)

</div>

  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-SkK2_5d3Uxc/UN8GvrnKSrI/AAAAAAAACP4/WVyOuJQuEYY/s400/RLookup4.png)](http://1.bp.blogspot.com/-SkK2_5d3Uxc/UN8GvrnKSrI/AAAAAAAACP4/WVyOuJQuEYY/s1600/RLookup4.png)

</div>

  
And now you can easily see where every book belongs to, and you have
nice options such as data integrity enforcement (not allowing books to
remain in a deleted bookshelf) and linked columns (adding additional
bookshelf-related data to the book list based on the relevant
bookshelf)  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-nmETjhFLn_k/UN8HdEBNUpI/AAAAAAAACQA/Xq1ZUVZLQw0/s400/RLookup5.png)](http://2.bp.blogspot.com/-nmETjhFLn_k/UN8HdEBNUpI/AAAAAAAACQA/Xq1ZUVZLQw0/s1600/RLookup5.png)

</div>

  
<span style="font-size: large;">What's **reverse** Lookup?</span>  
After you finisehd writing your library contents into SharePoint, you
want to see all of the books belonging to each bookshelf.  
A tried and true idea is to filter the book list using the bookshelf
column, like this:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-2z_iSN5LyDc/UN8H9o5iHvI/AAAAAAAACQI/Bej4qAEJiqE/s200/RLookup6.png)](http://4.bp.blogspot.com/-2z_iSN5LyDc/UN8H9o5iHvI/AAAAAAAACQI/Bej4qAEJiqE/s1600/RLookup6.png)

</div>

  

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-S07CFF4YA80/UN8H-URsUUI/AAAAAAAACQM/UZKDG7O5AyY/s400/RLookup7.png)](http://2.bp.blogspot.com/-S07CFF4YA80/UN8H-URsUUI/AAAAAAAACQM/UZKDG7O5AyY/s1600/RLookup7.png)

</div>

  
Which is fine, but very troublesome. I wanted the exact opposite of
lookup - the ability to view from every bookshelf item the matching
books!  
<span style="font-size: large;">My original idea</span>  
My original plan was to create a custom field type that contains no data
and has a list-viewing webpart in its display mode that shows the
referencing items from the child list (the book list in our case). I was
halfway done when I thought about how to call my blog post, and decided
to Google that before making any further progress.  
For the curious ones, I was trying to find out how to add field
parameters (such as "allow multiple selections") for my custom field.  
<span style="font-size: large;">The Solution</span>  
I stumbled upon some articles announcing that such a thing exists in
SharePoint 2010 OOTB but didn't mention where it's located. So I started
exploring, and found it! It's called "Related List" under "Insert". For
our example, I'll add a webpart showing the books contained in the shelf
in the shelf list's item display form:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-B1oJ68yIJIE/UN8J92P31oI/AAAAAAAACQw/_K_6mJXOEEQ/s400/RLookup8.png)](http://1.bp.blogspot.com/-B1oJ68yIJIE/UN8J92P31oI/AAAAAAAACQw/_K_6mJXOEEQ/s1600/RLookup8.png)

</div>

<div class="separator" style="clear: both; text-align: center;">

[![](http://2.bp.blogspot.com/-m2XblOVvoLk/UN8J-WWFvdI/AAAAAAAACQ0/UsldYkQ3f9I/s200/RLookup9.png)](http://2.bp.blogspot.com/-m2XblOVvoLk/UN8J-WWFvdI/AAAAAAAACQ0/UsldYkQ3f9I/s1600/RLookup9.png)

</div>

<div class="separator" style="clear: both; text-align: center;">

[![](http://4.bp.blogspot.com/-aAYe70G5uU0/UN8J7nzkGrI/AAAAAAAACQg/AmIqMUQLBPo/s400/RLookup10.png)](http://4.bp.blogspot.com/-aAYe70G5uU0/UN8J7nzkGrI/AAAAAAAACQg/AmIqMUQLBPo/s1600/RLookup10.png)

</div>

You can now customize the webpart in any normal way, and the best thing
- it's not  breaking the form in any way (you can still customize field
display etc. thorough the setting pages).  
The end result looks like that:  

<div class="separator" style="clear: both; text-align: center;">

[![](http://1.bp.blogspot.com/-yLyOX_OZuOo/UN8J8q8feaI/AAAAAAAACQk/hWf5ZHlIAqQ/s400/RLookup11.png)](http://1.bp.blogspot.com/-yLyOX_OZuOo/UN8J8q8feaI/AAAAAAAACQk/hWf5ZHlIAqQ/s1600/RLookup11.png)

</div>

  
Enjoy your 2-way lookup!

</p>

