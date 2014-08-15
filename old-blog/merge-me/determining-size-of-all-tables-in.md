Title: Determining Size of all Tables in a Database
Date: 2012-04-11 07:15
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, SQL
Slug: determining-size-of-all-tables-in
OldSlug: determining-size-of-all-tables-in

<p>
Just a quick SQL script to get the rowcount and size data of every table
in the current database:  

~~~~ {.brush:sql"}
CREATE TABLE #size ( name varchar (70), [rows] int, reserved varchar(20), data varchar(20), index_size varchar(20), unused varchar(20),)DELCARE @name varchar(70)DECLARE cur CURSOR FOR select name from sys.tablesOPEN curFETCH NEXT FROM cur INTO @nameWHILE @@FETCH_STATUS=0 BEGIN INSERT #size EXEC sp_spaceused @name ENDCLOSE curDEALLOCATE curSELECT * from #sizeDROP TABLE #size
~~~~

</p>

