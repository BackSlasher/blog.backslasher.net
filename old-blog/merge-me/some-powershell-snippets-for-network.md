Title: Some PowerShell Snippets for Network Scanning
Date: 2014-06-23 13:11
Author: Nitzan Raz (noreply@blogger.com)
Tags: TCP, Security, HTTP, Scripts, Windows, PowerShell, One-Liner
Slug: some-powershell-snippets-for-network
OldSlug: some-powershell-snippets-for-network

<p>
I recently had to improvise some network scanning using PowerShell. The
security guys got somewhat excited, so I decided to upload these
snippets.  
I think all of them require PowerShell v2+  
  
<span style="font-size: large;">Checking ping for one IP
address:</span>  

~~~~ {.prettyprint .lang-ps1}
Test-Connection $target -count 1 -quiet
~~~~

  
<span style="font-size: large;">Checking if a TCP port is
listening:</span>  

~~~~ {.prettyprint .lang-ps1}
function TryOpen-TCPPort([string]$target,[int]$port){ try{  $socket = new-object System.Net.Sockets.TcpClient  $socket.Connect($target,$port)  $socket.Close()  return $true }catch{return $false}}
~~~~

  
<a name="more"></a><span style="font-size: large;">Scanning a list of
addresses for predefined ports:</span>  

~~~~ {.prettyprint .lang-ps1}
function Map-Ports{ param(  [string[]]$targets,  [int[]]$tcpPorts ) $targets | %{ $target = $_ $ret = new-object object $ret | Add-Member NoteProperty 'Name' $_ $ret | Add-Member NoteProperty 'IP' $null $ret | Add-Member NoteProperty 'HasPing' $null $tcpPorts | %{$ret | Add-Member NoteProperty "TCP$_" $null}  $ip=$null try{  $ip=[System.Net.Dns]::Resolve($target).AddressList[0].IPAddressToString }catch [Net.Sockets.SocketException]{} $ret.IP=$ip  if($ip){  $ret.HasPing = (Test-Connection $ip -Quiet -Count 1)  $tcpPorts | %{$ret."TCP$_" = (TryOpen-TCPPort $ip $_)} } $ret}}
~~~~

  
<span style="font-size: large;">Scanning some subnet for web
servers:</span>  

~~~~ {.prettyprint .lang-ps1}
Map-Ports -targets ((1..254) | %{"10.0.0.$_"}) -tcpPorts 80,443
~~~~

  
<span style="font-size: large;">Scanning my immediate subnet for common
MS ports:</span>  

~~~~ {.prettyprint .lang-ps1}
# Fabricate IP Addressesfunction Fabricate-IPAddress([string]$header,[int]$levels=0){ $queue=@($header) while($levels--){  $newQueue = $queue | %{$q=$_;(1..254) | %{"$q.$_"}}  $queue = $newQueue } $queue}# Scan Immediate Addressesfunction Scan-MySubnet{ $myIps = gwmi win32_networkAdapterConfiguration -fi 'IPEnabled=True' | %{  for($i=0;$i -lt $_.IPAddress.length;$i++){   $_ | select `    @{Name='IP';Expression={[System.Net.IPAddress]($_.IPAddress[$i])}},    @{Name='Subnet';Expression={[System.Net.IPAddress]($_.IPSubnet[$i])}}  } }  $myIPs | %{  [int]$levels=0;  # Worst range calculation ever, but it works for standard subnets  switch($_.Subnet){   '225.255.255.0' {$levels=1}   '225.255.0.0' {$levels=2}   '225.0.0.0' {$levels=3}   default {Write-Error 'Too lazy to calculate range';continue;}  }  $header = ($_.IP.GetAddressBytes()[1..(4-$levels)]) -join '.'  Fabricate-IPAddress $header $levels }}Map-Ports -targets (Scan-MySubnet) -tcpPorts 135,445
~~~~

  
<span style="font-size: large;">Testing a web page on a server:</span>  

~~~~ {.prettyprint .lang-ps1}
function Get-WebResponseCode([uri]$url,[switch]$UseDefaultCredentials){ $req = [System.Net.WebRequest]::Create($url) $req.UseDefaultCredentials=$UseDefaultCredentials # Avoid downloading the whole page $req.Method='HEAD' try{$resp=$req.GetResponse()} catch [System.Net.WebException]{$resp=$_.Exception.Response} '{0}: {1}' -f ([int]$resp.StatusCode),$resp.StatusDescription}
~~~~

  
<span style="font-size: large;">Testing common webpages on a
server:</span>  

~~~~ {.prettyprint .lang-ps1}
function Test-WebPages{ param( [string[]]$targets, [uri[]]$paths, [string[]]$schemes='http', [switch]$UseDefaultCredentials ) $targets | %{  Write-Progress 'Testing Servers' $_ -Id 1  $target = $_  $schemes | %{   Write-Progress 'Testing Schemes' $_ -Id 2   $scheme = $_   $ret = $new-object object   $ret | Add-Member NoteProperty 'Name' $target   $ret | Add-Member NoteProperty 'Scheme' $scheme   $paths | %{$ret | Add-Member NoteProperty $_ $null}   $pu = new-object uri ([uri]"${scheme}://$target")   $paths | %{    $u = new-object uri $pu,$_    Write-Progress 'Testing Url' $u -Id 3    $ret.$_ = Get-WebResponseCode $u -UseDefaultCredentials:$UseDefaultCredentials      }  $ret }}Test-WebPages 'SharePointDev','ExchangeCAS','AnotherServer' -paths '/','/owa','/sites' -schemes 'http','https' -UseDefaultCredentials
~~~~

  

</p>

