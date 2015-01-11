Title: Git Prompt Variables
Date: 2014-10-22 09:05
Category: FOSS
Tags: git, bash

I recently reinstalled my laptop and had to reconfigure my git prompt.
I use the git prompt script that is included in Ubuntu's git package, and integrate it into my prompt by editing `~/.bashrc`, executing `source /etc/bash_completion.d/git-prompt`, and adding `$(__git_ps1)` to my `PS1` variable, just before the ending `\$` (which is the final `$` in your prompt).  
This gives me a basic prompt, that looks something like:
```text
nitz@computer:~/project (master)$
```
Note the `(master)` - that's the git prompt addition.  
However, there are environment variables that can be set before calling `git-prompt`, that add more information to PS1. I always forget some because I haven't found an organized list of them, only comments in the `git-prompt` file itself. I've decided to compile my own list.

### The Script
I used this nifty script to extract all variables mentioned in the actual `git-prompt` script with the pattern `GIT_PS_*`, since it looks like those are the relevant variables.
```bash
cat /usr/lib/git-core/git-sh-prompt | perl -nle 'print "$1" if (/(GIT_PS1_[a-zA-Z_]+)/)' | sort | uniq
```
* `GIT_PS1_DESCRIBE_STYLE`  
  Modifies the way detached HEAD is shown. Possible values are:
    * `contains`: Looks forward in the tree for a tag, so you know which tag you're behind
    * `branch`: Looks forward in the tree for a tag or a branch (whatever's nearest)
    * `describe`: Looks backwards in the tree for a tag, so you know which tag you're ahead of
    * default: If your exactly on a tag, display it.
  If the method you chose fails to find a tag/branch to display, you'll see the commit id instead.
* `GIT_PS1_SHOWCOLORHINTS`  
  `__git_ps1` can be used to **create** the PS1 prompt and not just its own output. If that's the case, a non-empty value tells git to color the prompt according to the current state (dirty, untracked files...)
* `GIT_PS1_SHOWDIRTYSTATE`  
  Shows the "dirty" indicator - meaning whether you modified tracked files.
  Can be `*` for unstaged changes, `+` for staged changes, `#` for "no HEAD to compare against" (usually only happens before initial commit)
* `GIT_PS1_SHOWSTASHSTATE`  
  Shows the "stash" indicator - meaning whether you have files [stashed](http://git-scm.com/book/en/Git-Tools-Stashing).  
  Looks like `$`
* `GIT_PS1_SHOWUNTRACKEDFILES`
  Shows the "untracked" indicator - meaning whether you have untracked files (files that are in the working directory but haven't been added using `git add` to the repository).  
  Looks like `%`
* `GIT_PS1_SHOWUPSTREAM`  
  Shows the difference between the upstream branch and the current branch. I only use "auto", meaning that I get the following values:
    * `<` when I'm behind (I need to pull to get changes from the server)
    * `>` when I'm ahead (I need to push to update the server with my changes)
    * `<>` when I'm diverged from the server (some conflict resolution will be required)
    * `=` when we're identical (no action is needed).
	
    This obviously requires me to `fetch` the remote server from time to time.

### How I did it
My prompt currently looks like this. The `if` actually sets the prompt and is mostly unmodified (except for adding `$(__git_ps1)`).
~~~bash
# Git
GIT_PS1_SHOWDIRTYSTATE='y'
GIT_PS1_SHOWSTASHSTATE='y'
GIT_PS1_SHOWUNTRACKEDFILES='y'
GIT_PS1_DESCRIBE_STYLE='contains'
GIT_PS1_SHOWUPSTREAM='auto'

source /etc/bash_completion.d/git-prompt

if [ "$color_prompt" = yes ]; then
    PS1='${debian_chroot:+($debian_chroot)}\[\033[01;32m\]\u@\h\[\033[00m\]:\[\033[01;34m\]\w\[\033[00m\]$(__git_ps1)\$ '
else
    PS1='${debian_chroot:+($debian_chroot)}\u@\h:\w$(__git_ps1)\$ '
fi
unset color_prompt force_color_prompt
~~~
