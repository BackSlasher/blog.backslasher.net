Title: Adding languages to Prettify
Date: 2014-01-10 20:23
Author: Nitzan Raz (noreply@blogger.com)
Tags: Prettify, HTML, Blog
Slug: adding-languages-to-prettify
OldSlug: adding-languages-to-prettify

<p>
Since there is no documentation on how to add languages to Prettify, I
thought I'd document the process here.  
First, prepare a script containing your languages' rules and make it
publicly available. I have a PowerShell one which I stole from
[here](http://code.google.com/p/google-code-prettify/issues/detail?id=295)
and slightly modified. Mine is:  
<http://apps.oneboredadmin.com/prettify/lang-powershell.js>  
  
Assuming you use the auto-loader, you should have somewhere a line that
looks like this:  

~~~~ {.prettyprint}
<script src="http://google-code-prettify.googlecode.com/svn/loader/run_prettify.js" />
~~~~

After this line, add the following reference (obviously modify the
path):  

~~~~ {.prettyprint}
<script src="http://apps.oneboredadmin.com/prettify/lang-powershell.js" />
~~~~

  
<span style="font-size: large;">And this how the result looks:</span>  
Without PowerShell-specific highlighting:  

~~~~ {.prettyprint}
param(    [string]$computerName,    [parameter(Mandatory=$true)]    [string]$subscriptionName) $wecUtil={wecutil gr $args[0]}$splatTable=@{}if($computeRName) {$splatTable['ComputerName']=$computerName}$in = Invoke-Command @splatTable $wecUtil -ArgumentList $subscriptionName$in2 = ($in -join "`n")# Some comment that I used to know$pattern = '(?<=\n)\t{2}(?!\t)(.+)\n\t{3}RunTimeStatus: (.+)\n\t{3}LastError: (.+)(?:\n\t{3}ErrorMessage: ((?:\n|.)+?)\n\t{3}ErrorTime: (.+)\n\t{3}NextRetryTime: (.+))?(?:\n|$)'[regex]::Matches($in2,$pattern,'Multiline') | %{    $arr = $_.Groups | select -s 1 -exp value    5| select `<#GAGAGAGAGAG #>    @{Name='Name';Expression={$arr[0]}},    @{Name='RunTimeStatus';Expression={$arr[1]}},    @{Name='LastError';Expression={[int]$arr[2]}},    @{Name='ErrorMessage';Expression={        $msg = ([xml]$arr[3]).WSManFault.Message        if($msg -is [string]) {$msg}        else {$msg.ProviderFault.ProviderError.'#text'}    }},    @{Name='ErrorTime';Expression={[datetime]$arr[4]}},    @{Name='NextRetryTime';Expression={[datetime]$arr[5]}}}
~~~~

  
With PowerShell-specific highlighting:  

~~~~ {.prettyprint .lang-ps1}
param(    [string]$computerName,    [parameter(Mandatory=$true)]    [string]$subscriptionName) $wecUtil={wecutil gr $args[0]}$splatTable=@{}if($computeRName) {$splatTable['ComputerName']=$computerName}$in = Invoke-Command @splatTable $wecUtil -ArgumentList $subscriptionName$in2 = ($in -join "`n")# Some comment that I used to know$pattern = '(?<=\n)\t{2}(?!\t)(.+)\n\t{3}RunTimeStatus: (.+)\n\t{3}LastError: (.+)(?:\n\t{3}ErrorMessage: ((?:\n|.)+?)\n\t{3}ErrorTime: (.+)\n\t{3}NextRetryTime: (.+))?(?:\n|$)'[regex]::Matches($in2,$pattern,'Multiline') | %{    $arr = $_.Groups | select -s 1 -exp value    5| select `<#GAGAGAGAGAG #>    @{Name='Name';Expression={$arr[0]}},    @{Name='RunTimeStatus';Expression={$arr[1]}},    @{Name='LastError';Expression={[int]$arr[2]}},    @{Name='ErrorMessage';Expression={        $msg = ([xml]$arr[3]).WSManFault.Message        if($msg -is [string]) {$msg}        else {$msg.ProviderFault.ProviderError.'#text'}    }},    @{Name='ErrorTime';Expression={[datetime]$arr[4]}},    @{Name='NextRetryTime';Expression={[datetime]$arr[5]}}}
~~~~

</p>

