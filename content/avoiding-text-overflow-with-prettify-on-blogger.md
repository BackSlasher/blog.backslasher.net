Title: Avoiding Text Overflow with Prettify on Blogger
Date: 2014-01-09 12:32
Category: FOSS
Tags: Prettify, CSS, HTML, Blog
Slug: avoiding-text-overflow-with-prettify-on-blogger
OldSlug: avoiding-text-overflow-with-prettify-on

I'm currently testing [Prettify](http://code.google.com/p/google-code-prettify/) to replace [SyntaxHighlighter](http://alexgorbatchev.com/SyntaxHighlighter/) as the
syntax-highlighting solution in my blog.  
By the way, it's nothing critical, but Blogger's preview mode breaks because of SH's inclusion (the reference URLs are being converted to https and break down) and the project's homepage seems quite stale (latest version release was long ago).  
After some initial testing, I found that scripts that are too long are overflowing, which looks bad:

![](images/avoiding-text-overflow-with-prettify-on-blogger/PrettifyWithOverflow.png)

I slightly modified a solution I found in [StackOverflow](http://stackoverflow.com/a/10787539).  
I created a Style segment in my template, but targeted all "prettyprint" `<pre>`s (to avoid having to add "codescroll" to every `<pre>`) and only left the CSS directive "overflow-x: auto;".  
The code looks like this:  

~~~~ {.prettyprint}
<style type="text/css">pre.prettyprint {overflow-x: auto}</style>
~~~~

And the result, like this:

![](images/avoiding-text-overflow-with-prettify-on-blogger/PrettifyNoOverflow.png)

Much better!
