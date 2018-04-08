#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Nitz'
SITENAME = u'BackSlasher'
SITEURL = ''

STATIC_PATHS = ['images', 'extra/CNAME']
EXTRA_PATH_METADATA = {'extra/CNAME': {'path': 'CNAME'},}
PLUGIN_PATHS = ["pelican-plugins"]
PLUGINS = ["summary", "tag_cloud"]

OUTPUT_RETENTION = ['.git']
PYGMENTS_STYLE = 'default'

THEME = 'theme'
BOOTSTRAP_THEME = ''

PATH = 'content'

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = u'en'

TAG_CLOUD_SORTING = 'size'

DISQUS_SITENAME = "blog-backslasher-net"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         )

# Social widget
SOCIAL = (
          ('github','http://github.com/BackSlasher'),
          ('linkedin','http://il.linkedin.com/in/nitzanraz/'),
          ('google-plus','https://plus.google.com/115663481647728261146'),
          ('stack-overflow','http://careers.stackoverflow.com/backslasher'),
        )

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True
