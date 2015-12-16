Title: Open-Gridview - the FOSS Out-Gridview
Date: 2015-12-13
Category: FOSS
Tags: Python, PowerShell, Scripts
Slug: open-gridview

## The Story
I've been a Microsoft SysAdmin for a long time before switching for Linux. During which, I scripted a lot in PowerShell.  
PowerShell has several "output" functions like `Out-File` (which passes the input to a file), `Out-Null` etc.  
One of these functions was [Out-Gridview](https://technet.microsoft.com/en-us/library/hh849920.aspx) which tabularizes its input and displays it in an interactive table:  
![out-gridview](|filename|/images/open-gridview/out-gridview.jpg)  
You can see how easy it is to tabulate your objects.  

The advantage might be hard to explain to hardcore \*nix CLI users - they might scoff and say that you can filter using `grep`, sort using `sort` and extract columns using `awk`, and that all output is beautiful in its own way.  
However, since switching to Linux I've had numerous incidents of either trying to format my output so that it is both readable and parsable, or piping output to some filter and regret filtering it. How I missed being able to pass the output to `Out-Gridview` and being able to manipulate it via GUI.

## The Solution
I've decided that Out-Gridview is a basic enough problem so I can tackle it, and also writing UI is fun (as if), so I implemented it via GTK and Python.  
The result is the package [opengridview](https://pypi.python.org/pypi/opengridview).  

### Installation
For regular usage, use the pip package:
```bash
sudo pip install opengridview
```
For modification and hacking, use the git repo:
```bash
git clone https://github.com/BackSlasher/opengridview .
. bin/activate
pip install -e .
```

### Basic usage
To use it, pipe your output into `ogv` (or `open-gridview`), optionally specifying how to parse each row (the default is "autosplit") and how the columns are named (usually the first row is taken as a header row).  
`ogv` can accept regular files, but it's more interesting to pipe streams into it.  
Multiple files can be passed (causing multiple windows to appear) by using bash's [process substitution](http://tldp.org/LDP/abs/html/process-sub.html):
```bash
ogv <(ls -l /home/bob | tail -n+2) <(ls -l /var | tail -n+2) --headers permissions,links,user,group,size,mod-month,mod-day,mod-time,name
```

### Parsers
#### autosplit
Emulates perl's `autosplit`, using `re.split` and a delimiter (defaults to `\s+`)

#### csv
Uses the `csv` module to prase every line. Configurable delimeter (defaults to `,`)

#### line\_json
Treats each line as a separate JSON object

### Neat features
* The autosplit parser uses `re.split` to create the columns. This method honors capturing groups inside the separator, meaning you can use the separator as a Regex parser, and discard the "split" columns using empty column headers, like this:


        :::bash
        pip list | ogv -s '^([^ ]*) \(([^ ]*)\)$' --headers ,name,version

    (see below for screenshot of the result)

* I implemented `Ctrl+c` (inside the GUI) to copy selected rows as CSV text, in order to ease copying data into spreadsheet applications (a common action for me when handling tabulated data)

## Example use cases
### Filesystem stuff

    :::bash
    ls -l | tail -n+2 | ogv --headers permissions,links,user,group,size,mod-month,mod-day,mod-time,name &
    du -h | ogv --separator '\t' --headers size,path &
    wait

![](|filename|/images/open-gridview/filesystem.png)

### Show all packages installed
Preset the filter to "python"

    :::bash
    aptitude search ~i --disable-columns -F '%p,%v,%t' | ogv -p csv --headers name,version,source --filter python

![](|filename|/images/open-gridview/aptitude.png)

### Pip package list
Custom headers, column extraction using capturing groups

    :::bash
    pip list | ogv -s '^([^ ]*) \(([^ ]*)\)$' --headers ,name,version

![](|filename|/images/open-gridview/pip.png)

### Multiple module search

    :::bash
    (
      echo platform name version
      pip list | perl -ne 'print "python $_"';
      gem list | grep '(' | perl -ne 'print "ruby $_"'
    ) | ogv

![](|filename|/images/open-gridview/pip-gem.png)

## Interesting bits
* I chose to implement Open-Gridview on GTK because I'm running Gnome
* I chose Python (as opposed to Ruby / Perl) because Python comes preinstalled on most major Linux distros
* Since I chose [PyGObject](https://wiki.gnome.org/action/show/Projects/PyGObject?action=show&redirect=PyGObject) as my GTK library, I'm annoyingly missing some features, like:
    * Writing custom data to the clipboard
    * Directly connecting functions to key shortcuts (I'm currently using menu items as a middleman)
    * The `Gtk.Application` class forces "single-instance" applications on you (think firefox). Although there was [some discussion](https://mail.gnome.org/archives/gtk-devel-list/2011-February/msg00091.html) about this decision, it seems mandated. I had to work around this by managing multiple `Gtk.Window` instances by myself
* Some Python utilities (e.g. `csv.reader`) use internal buffering when reading streams. This means that using them directly caused delay when parsing a live stream (and not a file). I'm currently reading one line at a time, then feeding it to a parser. This is also why all current parsers are line-based
* I found no easy/elegant way to interrupt streams while they were waiting for input. Eventually I found about "daemon threads", which are threads that don't justify keeping the process alive (if only daemon threads are left, the process is closed)


## TODOs
* Add item selection functionality (like out-gridview's `OutputMode`)
* Support advanced filtering (e.g. regex, specific columns)
* Support hiding and re-ordering columns
* Add a progress bar if the stream isn't closed (EOFed)

Please let me know if you find this useful.
