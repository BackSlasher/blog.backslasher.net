Title: Brute Force Guessing for User Passwords
Date: 2012-12-16 17:26
Tags: Security, Scripts, PowerShell, Active Directory
Slug: brute-force-guessing-for-user-passwords
OldSlug: brute-force-guessing-for-user-passwords

<p>
Hi.  
Our security team complained to me that they found a lot of users with
trivial passwords simply by trying to log in as them.  
They asked me to write them a script to speed up the process, so I wrote
them my brute force guessing script.  
It's not very stealthy, as it's doing multiple authentication attempts
against the Domain Controller (and unlocks the user in between).  
It's basically designed for domain admins wishing to search for one or
two particular passwords on their domain without bothering to analyze
the ntds.dit file.  
It can optionally re-lock users it unlocked during testing (if you don't
want to disturb anything...)The parameters are simple - the users and
passwords you wish to test and the relock parameters (whether to relock
and how many times a wrong password should be attempted to lock a
user).  

~~~~ {.brush:ps}
param(    [string[]$users,    [string[]]$passwords=('Password1','Password2'),    [bool]$reLock=$true,    [int]$lockRepeats = 3)ipmo active*function test-UserPassword($userName,$Password){    $locked = Get-ADUser $userName -prop LockedOut -errorAction 'stop'| select -exp LockedOut    if($locked) {Unlock-AdAccount $userName}    ([bool](new-object directoryServices.DirectoryEntry '',$userName,$password).Name)}$users | Get-ADUser -prop LockedOut,canonicalName -ErrorAction Continue | %{    $userName = $_.samAccountName    Write-Debug "Working on user $userName"    $matchPass=$null    for($i=0;($i -lt $passwords.Count) -and ($matchPass -eq $null);$i++) {        $password = $passwords[$i];        Write-Debug "Testing user $userName : $password"        $passOk  test-UserPassword $userName $password        if($passOk) {            Write-Debug "Found $userName : $password"            $matchPass=$password        }    }            if($reLock -and $_.LockedOut) {        # Relock the user        for($i=0;$i -lt $lockRepeats*2;$i++){test-UserPassword $userName $i | out-null}    }    $_ | select SamAccountName,canonicalName,@{name='OriginallyLocked';Expression={$_.LockedOut}},@{name='MatchingPassword';Expression={$matchPass}}}
~~~~

Have a good brute forcing!

</p>

