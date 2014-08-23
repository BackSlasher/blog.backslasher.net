#!/usr/bin/python
import yaml
stream = open("renaming-list.yaml",'r')
arr = yaml.load(stream)
for key in arr:
    # move key to content/slug
    slug=arr[key]['slug']
    newfile=("content/%s.md" % (slug))
    if newfile != key:
        print "perl -p -i -e 's/^Slug: .*$/Slug: %s/' %s" % (slug,key)
        print ("git mv %s %s" % (key,newfile))
