---
title: Getting Git Submodule Detailed Status
categories:
- FOSS
tags:
  - Linux
  - Bash
  - git
  - chef
---

## The Story
I manage every one of my Chef cookbooks as a single git repository, complying with the BerkShelf paradigm. I keep them all as submodules in a "supermodule", to allow my teammates to easily clone them all.
I can use `git status` from the supermodule to get submodule information when it comes to untracked/modified files, like so:
```text
$ git status
On branch master
Your branch is up-to-date with 'origin/master'.
Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git checkout -- <file>..." to discard changes in working directory)
  (commit or discard the untracked or modified content in submodules)

	modified:   cookbooks/some-cookbook (untracked content)
	modified:   cookbooks/other-cookbook (modified content)
```
While this is nice, I wanted something more detailed, like [git's PS1 prompt](|filename|/git-prompt-variables.md). I ended up using just that.

## The script
I'm utilizing `git submodule foreach`, which `cd`s into every sudmodule while populating some variables (e.g. `$name` is the submodule's name) and executes something (using some subshell).  
I started checking how the prompt script calculates its symbols, but after reading the script I found it full of `if`s and `case`s and lions and tigers and bears. I decided that the prompt script actually generates the string I need, so I should just execute it.  
The only caveat is that the script reads variables defined in `~/.bashrc` and are not exported, like this:
```bash
GIT_PS1_SHOWDIRTYSTATE='y'
```
Meaning that they're not available in any bash instances that aren't login instances.
You can either:

1. Edit `~/.bashrc` to export the variables, like:

        :::bash
		export GIT_PS1_SHOWDIRTYSTATE='y'

2. add this bit of trickery, which runs a bash login shell, extracts the variables and exports them:

        :::bash
		export $(bash -ic 'declare -p' | grep GIT | cut -f 3 -d ' ')

I chose option 2

The script looks like this:
```bash
#!/bin/bash
export $(bash -ic 'declare -p' | grep GIT | cut -f 3 -d ' ')
git submodule foreach --quiet 'bash -c ". /usr/lib/git-core/git-sh-prompt; __git_ps1";echo " $path"'
```
And the result looks like:
```text
 (master %=) cookbooks/some-cookbook
 (master *=) cookbooks/other-cookbook
 (master=) cookbooks/untouched-cookbook
 (master>) cookbooks/notpushed-cookbook 
```

Very nice.
