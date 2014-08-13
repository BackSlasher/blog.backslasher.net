Title: Querying SQL Servers
Date: 2010-07-29 20:55
Author: Nitzan Raz (noreply@blogger.com)
Tags: Scripts, PowerShell, SQL
Slug: querying-sql-servers

<p>
Hi.  
Before I had a chance to study Microsoft's SQL Server Management Studio
(SSMS)'s Powershell SnapIn, I needed to grab some data from an SQL DB. I
ended up creating 3 nifty functions for that very thing, and I still use
them today, because I find SQL's SnapIn very slow and confusing. Please
remember that those are one of my first scripts, so they seem quite
noobish...  
  
The first one, **get-SQLConnection**, is used to create a .net-ish
System.Data.SqlClient.SqlConnection:  

~~~~ {.brush: .ps}
function get-SQLConnection($server="localhost",$database="master",$user,$password){$goNormal = ($user -eq $null);$SqlConnection = New-Object System.Data.SqlClient.SqlConnection;$ConnBuilder = New-Object System.Data.SqlClient.SqlConnectionStringBuilder;$ConnBuilder.psbase["server"]=$server;$ConnBuilder.psbase.InitialCatalog = $database;#If we have to impersonateif($goNormal){    $ConnBuilder.psbase.IntegratedSecurity = $true;}else{    $ConnBuilder.psbase.UserID = $user;    $ConnBuilder.psbase.Password = $password;    $ConnBuilder.psbase.IntegratedSecurity = $false;}$SqlConnection.ConnectionString = $ConnBuilder.ConnectionString;#returnecho $SqlConnection;}
~~~~

  
The second, **inovke-SQLCommand**, invokes an SQL query on a ready SQL
connection, and possibly formats the output using the third:  

~~~~ {.brush: .ps}
function invoke-SQLCommand{param([Parameter(Position=0, ValueFromPipeline=$true, Mandatory=$true)][System.Data.SqlClient.SqlConnection] $Connection,[Parameter(Position=1, Mandatory=$true)][String] $Command,[Parameter(Position=2)][Switch] $FormatOutput,[Parameter(Position=3)][Switch] $CloseConnection)try{    $comm=new-object System.Data.SqlClient.SqlCommand;    $comm.Connection = $connection;    if($Connection.State.ToString() -ne 'Open')    {        $Connection.Open();    }    $comm.CommandText = $Command;    $result = $comm.ExecuteReader();    if($FormatOutput)    {        $table = new-object system.data.datatable;        $table.load($result);        $table.Rows | format-SQLOutput;    }    else    {        $table = new-object system.data.datatable;        $table.load($result);        $table.Rows;    }    if($CloseConnection)    {        $Connection.Close();    }}catch{    throw;}}
~~~~

  
The third, and the best one, IMO, is **format-SQLOutput**, which gets a
tabular .net-ish result and formats it into a PowerShell object
structure by adding NoteProperty members to a System.Object.  

~~~~ {.brush: .ps}
function format-SQLOutput{process{$objRet = new-object object;$tblSrc = $_.Table;foreach($clmTemp in $tblSrc.Columns)    {    $cap=$clmTemp.Caption;    $con=$_[$clmTemp];    add-member -inputobject $objRet NoteProperty $cap $con;    }echo $objRet;}}
~~~~

Have fun!

</p>

