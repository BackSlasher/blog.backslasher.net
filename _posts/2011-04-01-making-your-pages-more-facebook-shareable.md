---
title: Making your pages more Facebook shareable
categories:
- FOSS
tags:
  - Facebook
  - HTML
---

I'm working on a project involving [Gallery 3](http://gallery.menalto.com/), and one of my goals was tight Facebook
integration. Today I've wanted to make sure that when someone shares a
page from my gallery on Facebook, it'll show up OK.  
After some digging around I found some interesting stuff:  
####Facebook's URL Linter
Whenever you want to test / troubleshoot your shared URLs, use [this tool](http://developers.facebook.com/tools/lint) to see what Facebook
makes of it. It'll take a url and display all metadata that Facebook
harvests from the page, like its title, description and thumbnail.  

#### Metadata tags
Page metadata can be "force-fed" to Facebook using `<Metadata>` tags.  
I haven't been able to find a complete list, but these folks will do for
most people:  

-   title
-   description
-   image\_src

#### Open Graph Tags
If your page represents a real-life object (such as a celebrity, movie,
restaurant) you might prefer using [Open Graph](http://ogp.me/). Don't
be misled by the name, this standard was created for Facebook. It's not
some internet-wide phenomenon (at least for now!)  
  
These resources should be enough for you to be able to make your page
Facebook-shareable.
