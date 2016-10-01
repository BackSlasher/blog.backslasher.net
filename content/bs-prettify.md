Title: Prettify HTML pages with BeautifulSoup
Date: 2016-10-01 12:00
Tags: Scripts, Python, BeautifulSoup, HTML
Slug: bs-prettify
Category: FOSS

# The story
Today I wrote some HTML page by hand ([my new homepage](http://backslasher.net)).  
I then used this script to make the HTML code nicer:

# The script

This requires the BeautifulSoup module for python
```python
#!/usr/bin/env python

import sys
from bs4 import BeautifulSoup

def bs_file(filename):
    with open(filename, 'r') as f:
        data = f.read()
    s = BeautifulSoup(data, 'lxml')
    new_data = s.prettify()
    with open(filename, 'w') as f:
        f.write(new_data)

for f in sys.argv[1:]:
  bs_file(f)
```

It's pretty simple - The `bs_file` method reads a file, asks BS to prettify its content, and writes the result to the file again.  
**Do note** that BS takes a lot of liberty in interpreting files - it might add tags where it decides they're missing etc.  
To use the script, run it and provide the filenames you wish to prettify as arguments, e.g. `/tmp/bs.py index.html`
