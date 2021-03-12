---
title: Adding a child element in XSLT
categories:
- FOSS
tags:
  - XSLT
  - scripts
---

I recently had to edit a big XML file, and add a child elemnt to every element within.
To simplify matters, say I had something like this:
```
<?xml version="1.0" encoding="UTF-8"?>
<rooty xmlns:ppl="some_identifier">
  <ppl:person>
    <age>42</age>
    <name>bob</name>
  </ppl:person>
  <ppl:person>
    <age>53</age>
    <name>doggo</name>
  </ppl:person>
</rooty>
```

I wanted to add a `<cow>` element to every person, like so:
```
<?xml version="1.0" encoding="UTF-8"?>
<rooty xmlns:ppl="some_identifier">
  <ppl:person>
    <age>42</age>
    <name>bob</name>
    <cow>Bessy</cow>
  </ppl:person>
  <ppl:person>
    <age>53</age>
    <name>doggo</name>
    <cow>Bessy</cow>
  </ppl:person>
</rooty>
```

My first approach was to spend 10 minutes manually editing the file, but why do that when you can spend **30 minutes** writing automation to do it for you?  
I then spent some time getting pissed off on Python's XML libraries, as they didn't properly handle custom XML namespaces (the `ppl` part).  
I decided then that the "right" way to do it was using XSLT.  

## The solution

I still don't fully understand [XSLT](https://en.wikipedia.org/wiki/XSLT), so I won't try and explain it.  
After some help from [StackOverflow](https://stackoverflow.com/q/52205660/950275), I got a working XSLT file, which I'm happy to share:

```
<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:ppl="some_identifier" version="1.0">
  <xsl:output omit-xml-declaration="no" indent="yes" encoding="UTF-8"/>
  <xsl:strip-space elements="*"/>
  <!-- Identity transform -->
  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
    </xsl:copy>
  </xsl:template>
  <!-- Add cow to a person -->
  <xsl:template match="ppl:person">
    <xsl:copy>
      <xsl:copy-of select="@*"/>
      <xsl:copy-of select="node()"/>
      <cow>Bessy</cow>
    </xsl:copy>
  </xsl:template>
</xsl:stylesheet>
```

I run it using `xsltproc`, which is widely available for Linux distros, and the command looks like `xsltproc XSLT_PATH XML_PATH`

The file, broken down, looks like this:

### Formatting
```
  <xsl:output omit-xml-declaration="no" indent="yes" encoding="UTF-8"/>
  <xsl:strip-space elements="*"/>
```
The above part controls the formatting. Without it, the resulting XML might have weird linebreaks and spaces.

### Identity transform
```
  <!-- Identity transform -->
  <xsl:template match="@* | node()">
    <xsl:copy>
      <xsl:apply-templates select="@* | node()"/>
    </xsl:copy>
  </xsl:template>
```
This part makes every node appear in the transformed document.

### Adding the child elemennt
```
  <!-- Add cow to a person -->
  <xsl:template match="ppl:person">
    <xsl:copy>
      <xsl:copy-of select="@*"/>
      <xsl:copy-of select="node()"/>
      <cow>Bessy</cow>
    </xsl:copy>
  </xsl:template>
```
This part matches only the elements we want to add children to.  
We tell the transformer to copy the node, and include all of the original attributes (`@*`) and child elements (`node()`), and add our own new child element (the `<cow>` part).  
Removing this part will effectively make the XSLT file a "reformatter".


Have fun!
