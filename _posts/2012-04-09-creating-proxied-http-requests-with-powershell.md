---
title: Creating proxied http requests with PowerShell
categories:
- Microsoft
tags:
  - HTTP
  - Scripts
  - Proxy
  - PowerShell
---

I'm working on some sort of HTTP proxy (maybe more details about it later), and to test it I've created a short PowerShell script.  
Note it also performs basic authentication voluntarily (without waiting for a server challenge) by injecting an `Authorization` header, because I was testing something extra special.  
I want to point out that I **REALLY** liked the way http proxies are fed into `WebRequest`s - it allows one to create "different" proxies by
appending paths and query-string data to the URI.  
Hope it will help someone out there.  

~~~~powershell
param(
    [string]$url = 'http://google.com',
    [string]$proxy = 'http://someHttpProxy.com',
    [string]$user = 'user',
    [string]$password = 'password',
)
 
$req = [net.webrequest]::Create($url)
#Prox
$prox = new-object net.WebProxy;
$prox.Address = $proxy
$req.Proxy = $prox
#Auth
$authInfo = $user + ":" + $password;
$authInfo = [Convert]::ToBase64String([Text.Encoding]::Ascii.GetBytes($authInfo));
$req.Headers['Authorization'] = "Basic $authInfo";
#Resp
$resp = $req.GetResponse()
$stream = new-object io.streamreader $resp.GetResponseStream()
$res=$stream.readtoend()
$res
~~~~
