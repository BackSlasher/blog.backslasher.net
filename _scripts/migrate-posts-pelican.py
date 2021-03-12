#!/bin/env python3
import re
import os
from pathlib import Path
from dateutil.parser import parse as date_parse

def handle_single_file(source_filename, dest_dir):
  with open(source_filename, "r") as f:
    lines = f.readlines()
  # lines = open("/home/nitz/projects/blog/content/windows-event-collection.md", "r").readlines()
  first_empty = [i for i,l in enumerate(lines) if re.match(r'^\s+$', l)][0]
  rest = "".join(lines[first_empty:])
  headers = lines[0:first_empty]
  headers = [line.split(": ",1) for line in headers]
  headers = {s[0].lower(): s[1].strip() for s in headers}
  tags2 = "\n".join([f"  - {h.strip()}" for h in headers["tags"].split(",")])
  template = f"""---
title: {headers["title"]}
categories:
- {headers["category"]}
tags:
{tags2}
---
"""
  new_text = template+rest
  small_date = date_parse(headers['date']).strftime('%Y-%m-%d')
  slug = headers.get('slug') or Path(os.path.basename(source_filename)).with_suffix('')
  new_filename = f"{small_date}-{slug}.md"
  dest_filename = os.path.join(dest_dir, new_filename)
  with open(dest_filename, "w") as f: 
    f.write(new_text)
    
    
src_dir = "/home/nitz/projects/blog/content/"
dst_dir = "/home/nitz/projects/blog-jekyll/_posts"

files = [os.path.join(src_dir, f) for f in os.listdir(src_dir) if f.endswith(".md")]
[handle_single_file(f, dst_dir) for f in files]
