Title: Determining Size of all Tables in a Database
Date: 2012-04-11 07:15
Category: Microsoft
Tags: Scripts, SQL
Slug: determining-size-of-all-tables-in-a-database
OldSlug: determining-size-of-all-tables-in

Just a quick SQL script to get the rowcount and size data of every table
in the current database:  
~~~~sql
CREATE TABLE #sizeof (
 name varchar (70),
 [rows] int,
 reserved varchar(20),
 data varchar(20),
 index_size varchar(20),
 unused varchar(20),
)
 
DELCARE @name varchar(70)
DECLARE cur CURSOR FOR select name from sys.tables
OPEN cur
FETCH NEXT FROM cur INTO @name
WHILE @@FETCH_STATUS=0
 BEGIN
 INSERT #sizeof EXEC sp_spaceused @name
 END
CLOSE cur
DEALLOCATE cur
SELECT * from #sizeof
DROP TABLE #sizeof
~~~~
