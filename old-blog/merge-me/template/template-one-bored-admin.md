Title: Template: One Bored Admin
Date: 2014-08-05 12:05
Author: Nitzan Raz (noreply@blogger.com)
Slug: template-one-bored-admin

<?xml version="1.0" encoding="UTF-8" ?>

<!DOCTYPE html>

<p>
</p>
<p>
</p>

<p>
</p>
<b:section class="navbar" id="navbar" maxwidgets="1" showaddelement="no">

<b:widget id="Navbar1" locked="true" title="Navbar" type="Navbar">

<b:includable id="main">\<script type="text/javascript"\>

function setAttributeOnload(object, attribute, val) {

if(window.addEventListener) {

window.addEventListener('load',

function(){ object[attribute] = val; }, false);

} else {

window.attachEvent('onload', function(){ object[attribute] = val; });

}

}

\</script\>

\<div id="navbar-iframe-container"\>\</div\>

\<script type="text/javascript"
src="https://apis.google.com/js/plusone.js"\>\</script\>

\<script type="text/javascript"\>

gapi.load("gapi.iframes:gapi.iframes.style.bubble", function() {

if (gapi.iframes && gapi.iframes.getContext) {

gapi.iframes.getContext().openChild({

url:
'https://www.blogger.com/navbar.g?targetBlogID\\075314585727957171669\\46blogName\\75One+Bored+Admin\\46publishMode\\75PUBLISH\_MODE\_HOSTED\\46navbarType\\75LIGHT\\46layoutType\\75LAYOUTS\\46searchRoot\\75http://blog.oneboredadmin.com/search\\46blogLocale\\75en\\46v\\0752\\46homepageUrl\\75http://blog.oneboredadmin.com/\\46blogFollowUrl\\75https://plus.google.com/115663481647728261146\\46vt\\0756493457734750344411',

where: document.getElementById("navbar-iframe-container"),

id: "navbar-iframe"

});

}

});

\</script\>\<script type="text/javascript"\>

(function() {

var script = document.createElement('script');

script.type = 'text/javascript';

script.src =
'//pagead2.googlesyndication.com/pagead/js/google\_top\_exp.js';

var head = document.getElementsByTagName('head')[0];

if (head) {

head.appendChild(script);

}})();

\</script\>

</b:includable>

</b:widget>

</b:section>

<div class="body-fauxcolumns">

</p>

<div class="fauxcolumn-outer body-fauxcolumn-outer">

</p>

<div class="cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left">

</p>

<div class="fauxborder-right">

</div>

</p>

<div class="fauxcolumn-inner">

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="content">

</p>

<div class="content-fauxcolumns">

</p>

<div class="fauxcolumn-outer content-fauxcolumn-outer">

</p>

<div class="cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left">

</p>

<div class="fauxborder-right">

</div>

</p>

<div class="fauxcolumn-inner">

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="content-outer">

</p>

<div class="content-cap-top cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left content-fauxborder-left">

</p>

<div class="fauxborder-right content-fauxborder-right">

</div>

</p>

<div class="content-inner">

</p>

<p>
<header>
</p>

<div class="header-outer">

</p>

<div class="header-cap-top cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left header-fauxborder-left">

</p>

<div class="fauxborder-right header-fauxborder-right">

</div>

</p>

<div class="region-inner header-inner">

</p>
<b:section class="header" id="header" maxwidgets="1" showaddelement="no">

<b:widget id="Header1" locked="true" title="One Bored Admin (Header)" type="Header">

<b:includable id="main">

<b:if cond="data:useImage">

<b:if cond="data:imagePlacement == &quot;BEHIND&quot;">

<!--</p><p>      Show image as background to text. You can't really calculate the width</p><p>      reliably in JS because margins are not taken into account by any of</p><p>      clientWidth, offsetWidth or scrollWidth, so we don't force a minimum</p><p>      width if the user is using shrink to fit.</p><p>      This results in a margin-width's worth of pixels being cropped. If the</p><p>      user is not using shrink to fit then we expand the header.</p><p>      -->

<b:if cond="data:mobile">

<div id="header-inner">

</p>

<div class="titlewrapper" style="background: transparent">

</p>

<h1 class="title" style="background: transparent; border-width: 0px">
</p>
<b:include name="title"></b:include>

<p>
</h1>
</p>
<p>

</div>

</p>
<b:include name="description"></b:include>

<p>

</div>

</p>
<b:else></b:else>

<div id="header-inner"
expr:style="&quot;background-image: url(\&quot;&quot; + data:sourceUrl + &quot;\&quot;); &quot;                        + &quot;background-position: &quot;                        + data:backgroundPositionStyleStr + &quot;; &quot;                        + data:widthStyleStr                        + &quot;min-height: &quot; + data:height                        + &quot;_height: &quot; + data:height                        + &quot;background-repeat: no-repeat; &quot;">

</p>

<div class="titlewrapper" style="background: transparent">

</p>

<h1 class="title" style="background: transparent; border-width: 0px">
</p>
<b:include name="title"></b:include>

<p>
</h1>
</p>
<p>

</div>

</p>
<b:include name="description"></b:include>

<p>

</div>

</p>
</b:if>

<b:else></b:else>

<!--Show the image only-->

<div id="header-inner">

</p>
<a expr:href="data:blog.homepageUrl" style="display: block">

<img expr:alt="data:title" expr:height="data:height" expr:id="data:widget.instanceId + &quot;_headerimg&quot;" expr:src="data:sourceUrl" expr:width="data:width" style="display: block"></img>

</a>

<!--Show the description-->

<b:if cond="data:imagePlacement == &quot;BEFORE_DESCRIPTION&quot;">

<b:include name="description"></b:include>

</b:if>

<p>

</div>

</p>
</b:if>

<b:else></b:else>

<!--No header image -->

<div id="header-inner">

</p>

<div class="titlewrapper">

</p>

<h1 class="title">
</p>
<b:include name="title"></b:include>

<p>
</h1>
</p>
<p>

</div>

</p>
<b:include name="description"></b:include>

<p>

</div>

</p>
</b:if>

</b:includable>

<b:includable id="description">

<div class="descriptionwrapper">

</p>

<span><data:description></data:description></span>

</p>
<p>

</div>

</p>
</b:includable>

<b:includable id="title">

<b:if cond="data:blog.url == data:blog.homepageUrl">

<data:title></data:title>

<b:else></b:else>

<a expr:href="data:blog.homepageUrl"><data:title></data:title></a>

</b:if>

</b:includable>

</b:widget>

</b:section>

<p>

</div>

</p>
<p>

</div>

</p>

<div class="header-cap-bottom cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
<p>
</header>
</p>

<div class="tabs-outer">

</p>

<div class="tabs-cap-top cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left tabs-fauxborder-left">

</p>

<div class="fauxborder-right tabs-fauxborder-right">

</div>

</p>

<div class="region-inner tabs-inner">

</p>
<b:section class="tabs" id="crosscol" maxwidgets="1" showaddelement="yes">

<b:widget id="LinkList1" locked="false" title="Links" type="LinkList">

<b:includable id="main">

<b:if cond="data:title">

<data:title></data:title>
-------------------------

</b:if>
</p>

<div class="widget-content">

</p>

-   <a expr:href="data:link.target"><data:link.name></data:link.name></a>

</p>
<b:include name="quickedit"></b:include>

<p>

</div>

</p>
</b:includable>

</b:widget>

</b:section>

<b:section class="tabs" id="crosscol-overflow" showaddelement="no"></b:section>

<p>

</div>

</p>
<p>

</div>

</p>

<div class="tabs-cap-bottom cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="main-outer">

</p>

<div class="main-cap-top cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left main-fauxborder-left">

</p>

<div class="fauxborder-right main-fauxborder-right">

</div>

</p>

<div class="region-inner main-inner">

</p>

<div class="columns fauxcolumns">

</p>

<div class="fauxcolumn-outer fauxcolumn-center-outer">

</p>

<div class="cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left">

</p>

<div class="fauxborder-right">

</div>

</p>

<div class="fauxcolumn-inner">

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="fauxcolumn-outer fauxcolumn-left-outer">

</p>

<div class="cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left">

</p>

<div class="fauxborder-right">

</div>

</p>

<div class="fauxcolumn-inner">

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="fauxcolumn-outer fauxcolumn-right-outer">

</p>

<div class="cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left">

</p>

<div class="fauxborder-right">

</div>

</p>

<div class="fauxcolumn-inner">

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<!-- corrects IE6 width calculation -->

<div class="columns-inner">

</p>

<div class="column-center-outer">

</p>

<div class="column-center-inner">

</p>
<b:section class="main" id="main" showaddelement="no">

<b:widget id="Blog1" locked="true" title="Blog Posts" type="Blog">

<b:includable id="main" var="top">

<b:if cond="data:mobile == &quot;false&quot;">

<!-- posts -->

<div class="blog-posts hfeed">

</p>

<b:include data="top" name="status-message"></b:include>

<data:defaultadstart></data:defaultadstart>

<b:loop values="data:posts" var="post">

<b:if cond="data:post.isDateStart">

<b:if cond="data:post.isFirstPost == &quot;false&quot;">

\</div\>\</div\>

</b:if>

</b:if>

<b:if cond="data:post.isDateStart">.ש

\<div class="date-outer"\>

</b:if>

<b:if cond="data:post.dateHeader">

<span><data:post.dateheader></data:post.dateheader></span> {.date-header}
----------------------------------------------------------

</p>
</b:if>

<b:if cond="data:post.isDateStart">

\<div class="date-posts"\>

</b:if>

<div class="post-outer">

</p>
<b:include data="post" name="post"></b:include>

<b:if cond="data:blog.pageType == &quot;static_page&quot;">

<b:include data="post" name="comment_picker"></b:include>

</b:if>

<b:if cond="data:blog.pageType == &quot;item&quot;">

<b:include data="post" name="comment_picker"></b:include>

</b:if>

<p>

</div>

</p>
<b:if cond="data:post.includeAd">

<b:if cond="data:post.isFirstPost">

<data:defaultadend></data:defaultadend>

<b:else></b:else>

<data:adend></data:adend>

</b:if>

<div class="inline-ad">

</p>
<data:adcode></data:adcode>

<p>

</div>

</p>
<data:adstart></data:adstart>

</b:if>

</b:loop>

<b:if cond="data:numPosts != 0">

\</div\>\</div\>

</b:if>

<data:adend></data:adend>

<p>

</div>

</p>

<!-- navigation -->

<b:include name="nextprev"></b:include>

<!-- feed links -->

<b:include name="feedLinks"></b:include>

<b:if cond="data:top.showStars">

<p>
<script src="//www.google.com/jsapi" type="text/javascript"></script>
</p>
<p>
<script type="text/javascript"></p><p>        google.load("annotations", "1", {"locale": "<data:top.languagecode></data:top.languagecode>"});</p><p>        function initialize() {</p><p>          google.annotations.setApplicationId(<data:top.blogspotreviews></data:top.blogspotreviews>);</p><p>          google.annotations.createAll();</p><p>          google.annotations.fetch();</p><p>        }</p><p>        google.setOnLoadCallback(initialize);</p><p>      </script>
</p>
</b:if>

<b:else></b:else>

<b:include name="mobile-main"></b:include>

</b:if>

<b:if cond="data:top.showDummy">

<data:top.dummybootstrap></data:top.dummybootstrap>

</b:if>

</b:includable>

<b:includable id="backlinkDeleteIcon" var="backlink">

<span expr:class="&quot;item-control &quot; + data:backlink.adminClass">

<a expr:href="data:backlink.deleteUrl" expr:title="data:top.deleteBacklinkMsg">

![](//www.blogger.com/img/icon_delete13.gif)

</a>

</span>

</b:includable>

<b:includable id="backlinks" var="post">

<a name="links"></a>

#### <data:post.backlinkslabel></data:post.backlinkslabel>

</p>
<b:if cond="data:post.numBacklinks != 0">

<dl class="comments-block" id="comments-block">
</p>
<b:loop values="data:post.backlinks" var="backlink">

<div class="collapsed-backlink backlink-control">

</p>
<p>
<dt class="comment-title">
</p>
<span class="backlink-toggle-zippy"> </span>

<a expr:href="data:backlink.url" rel="nofollow"><data:backlink.title></data:backlink.title></a>

<b:include data="backlink" name="backlinkDeleteIcon"></b:include>

<p>
</dt>
</p>
<p>
<dd class="comment-body collapseable">
</p>
<data:backlink.snippet></data:backlink.snippet>

<p>
</dd>
</p>
<p>
<dd class="comment-footer collapseable">
</p>
<span
class="comment-author"><data:post.authorlabel></data:post.authorlabel>
<data:backlink.author></data:backlink.author></span>

<span
class="comment-timestamp"><data:post.timestamplabel></data:post.timestamplabel>
<data:backlink.timestamp></data:backlink.timestamp></span>

<p>
</dd>
</p>
<p>

</div>

</p>
</b:loop>

<p>
</dl>
</p>
</b:if>

<a class="comment-link" expr:href="data:post.createLinkUrl" expr:id="data:widget.instanceId + &quot;_backlinks-create-link&quot;" target="_blank"><data:post.createlinklabel></data:post.createlinklabel></a>

</p>
</b:includable>

<b:includable id="comment-form" var="post">

<div class="comment-form">

</p>
<a name="comment-form"></a>

<b:if cond="data:mobile">

<h4 id="comment-post-message">
</p>
<p>
[<data:postcommentmsg></data:postcommentmsg>](javascript:void(0))
</h4>
</p>

<data:blogcommentmessage></data:blogcommentmessage>

</p>
<data:blogteamblogmessage></data:blogteamblogmessage>

<a expr:href="data:post.commentFormIframeSrc" id="comment-editor-src"></a>

<iframe allowtransparency="true" class="blogger-iframe-colorize blogger-comment-from-post" frameborder="0" height="410" id="comment-editor" name="comment-editor" src style="display: none" width="100%"></iframe>

<b:else></b:else>

#### <data:postcommentmsg></data:postcommentmsg> {#comment-post-message}

</p>

<data:blogcommentmessage></data:blogcommentmessage>

</p>
<data:blogteamblogmessage></data:blogteamblogmessage>

<a expr:href="data:post.commentFormIframeSrc" id="comment-editor-src"></a>

<iframe allowtransparency="true" class="blogger-iframe-colorize blogger-comment-from-post" frameborder="0" height="410" id="comment-editor" name="comment-editor" src width="100%"></iframe>

</b:if>

<data:post.friendconnectjs></data:post.friendconnectjs>

<data:post.cmtfpiframe></data:post.cmtfpiframe>

<p>
<script type="text/javascript"></p><p>      BLOG_CMT_createIframe('<data:post.apprpcrelaypath></data:post.apprpcrelaypath>', '<data:post.communityid></data:post.communityid>');</p><p>    </script>
</p>
<p>

</div>

</p>
</b:includable>

<b:includable id="commentDeleteIcon" var="comment">

<span expr:class="&quot;item-control &quot; + data:comment.adminClass">

<b:if cond="data:showCmtPopup">

<div class="goog-toggle-button">

</p>

<div class="goog-inline-block comment-action-icon">

</div>

</p>
<p>

</div>

</p>
<b:else></b:else>

<a class="comment-delete" expr:href="data:comment.deleteUrl" expr:title="data:top.deleteCommentMsg">

![](//www.blogger.com/img/icon_delete13.gif)

</a>

</b:if>

</span>

</b:includable>

<b:includable id="comment_count_picker" var="post">

<b:if cond="data:post.commentSource == 1">

<span class="cmt_count_iframe_holder" expr:data-count="data:post.numComments" expr:data-onclick="data:post.addCommentOnclick" expr:data-post-url="data:post.url" expr:data-url="data:post.canonicalUrl">

</span>

<b:else></b:else>

<a class="comment-link" expr:href="data:post.addCommentUrl" expr:onclick="data:post.addCommentOnclick">

<data:post.commentlabelfull></data:post.commentlabelfull>:

</a>

</b:if>

</b:includable>

<b:includable id="comment_picker" var="post">

<b:if cond="data:post.commentSource == 1">

<b:include data="post" name="iframe_comments"></b:include>

<b:else></b:else>

<b:if cond="data:post.showThreadedComments">

<b:include data="post" name="threaded_comments"></b:include>

<b:else></b:else>

<b:include data="post" name="comments"></b:include>

</b:if>

</b:if>

</b:includable>

<b:includable id="comments" var="post">

<div id="comments" class="comments">

</p>
<a name="comments"></a>

<b:if cond="data:post.allowComments">

#### <data:post.commentlabelfull></data:post.commentlabelfull>:

</p>

<b:if cond="data:post.commentPagingRequired">

<span class="paging-control-container">

<b:if cond="data:post.hasOlderLinks">

<a expr:class="data:post.oldLinkClass" expr:href="data:post.oldestLinkUrl"><data:post.oldestlinktext></data:post.oldestlinktext></a>

 

<a expr:class="data:post.oldLinkClass" expr:href="data:post.olderLinkUrl"><data:post.olderlinktext></data:post.olderlinktext></a>

 

</b:if>

<data:post.commentrangetext></data:post.commentrangetext>

<b:if cond="data:post.hasNewerLinks">

 

<a expr:class="data:post.newLinkClass" expr:href="data:post.newerLinkUrl"><data:post.newerlinktext></data:post.newerlinktext></a>

 

<a expr:class="data:post.newLinkClass" expr:href="data:post.newestLinkUrl"><data:post.newestlinktext></data:post.newestlinktext></a>

</b:if>

</span>

</b:if>

<div
expr:id="data:widget.instanceId + &quot;_comments-block-wrapper&quot;">

</p>

<dl expr:class="data:post.avatarIndentClass" id="comments-block">
</p>
<b:loop values="data:post.comments" var="comment">

<p>
<dt expr:class="&quot;comment-author &quot; + data:comment.authorClass" expr:id="data:comment.anchorName">
</p>
<b:if cond="data:comment.favicon">

<img expr:src="data:comment.favicon" height="16px" style="margin-bottom:-2px;" width="16px"></img>

</b:if>

<a expr:name="data:comment.anchorName"></a>

<b:if cond="data:blog.enabledCommentProfileImages">

<data:comment.authoravatarimage></data:comment.authoravatarimage>

</b:if>

<b:if cond="data:comment.authorUrl">

<a expr:href="data:comment.authorUrl" rel="nofollow"><data:comment.author></data:comment.author></a>

<b:else></b:else>

<data:comment.author></data:comment.author>

</b:if>

<data:commentpostedbymsg></data:commentpostedbymsg>

<p>
</dt>
</p>
<p>
<dd class="comment-body" expr:id="data:widget.instanceId + data:comment.cmtBodyIdPostfix">
</p>
<b:if cond="data:comment.isDeleted">

<span
class="deleted-comment"><data:comment.body></data:comment.body></span>

<b:else></b:else>

<data:comment.body></data:comment.body>

</p>
</b:if>

<p>
</dd>
</p>
<p>
<dd class="comment-footer">
</p>
<span class="comment-timestamp">

<a expr:href="data:comment.url" title="comment permalink">

<data:comment.timestamp></data:comment.timestamp>

</a>

<b:include data="comment" name="commentDeleteIcon"></b:include>

</span>

<p>
</dd>
</p>
</b:loop>

<p>
</dl>
</p>
<p>

</div>

</p>

<b:if cond="data:post.commentPagingRequired">

<span class="paging-control-container">

<a expr:class="data:post.oldLinkClass" expr:href="data:post.oldestLinkUrl">

<data:post.oldestlinktext></data:post.oldestlinktext>

</a>

<a expr:class="data:post.oldLinkClass" expr:href="data:post.olderLinkUrl">

<data:post.olderlinktext></data:post.olderlinktext>

</a>

 

<data:post.commentrangetext></data:post.commentrangetext>

 

<a expr:class="data:post.newLinkClass" expr:href="data:post.newerLinkUrl">

<data:post.newerlinktext></data:post.newerlinktext>

</a>

<a expr:class="data:post.newLinkClass" expr:href="data:post.newestLinkUrl">

<data:post.newestlinktext></data:post.newestlinktext>

</a>

</span>

</b:if>

<b:if cond="data:post.embedCommentForm">

<b:if cond="data:post.allowNewComments">

<b:include data="post" name="comment-form"></b:include>

<b:else></b:else>

<data:post.nonewcommentstext></data:post.nonewcommentstext>

</b:if>

<b:else></b:else>

<b:if cond="data:post.allowComments">

<a expr:href="data:post.addCommentUrl" expr:onclick="data:post.addCommentOnclick"><data:postcommentmsg></data:postcommentmsg></a>

</b:if>

</b:if>

</p>
</b:if>

<b:if cond="data:showCmtPopup">

<div id="comment-popup">

</p>
<iframe allowtransparency="true" frameborder="0" id="comment-actions" name="comment-actions" scrolling="no">

</iframe>

<p>

</div>

</p>
</b:if>

<div id="backlinks-container">

</p>

<div
expr:id="data:widget.instanceId + &quot;_backlinks-container&quot;">

</p>
<b:if cond="data:post.showBacklinks">

<b:include data="post" name="backlinks"></b:include>

</b:if>

<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
</b:includable>

<b:includable id="feedLinks">

<b:if cond="data:blog.pageType != &quot;item&quot;">
<!-- Blog feed links -->

<b:if cond="data:feedLinks">

<div class="blog-feeds">

</p>
<b:include data="feedLinks" name="feedLinksBody"></b:include>

<p>

</div>

</p>
</b:if>

<b:else></b:else> <!--Post feed links -->

<div class="post-feeds">

</p>
<b:loop values="data:posts" var="post">

<b:if cond="data:post.allowComments">

<b:if cond="data:post.feedLinks">

<b:include data="post.feedLinks" name="feedLinksBody"></b:include>

</b:if>

</b:if>

</b:loop>

<p>

</div>

</p>
</b:if>

</b:includable>

<b:includable id="feedLinksBody" var="links">

<div class="feed-links">

</p>
<data:feedlinksmsg></data:feedlinksmsg>

<b:loop values="data:links" var="f">

<a class="feed-link" expr:href="data:f.url" expr:type="data:f.mimeType" target="_blank"><data:f.name></data:f.name>
(<data:f.feedtype></data:f.feedtype>)</a>

</b:loop>

<p>

</div>

</p>
</b:includable>

<b:includable id="iframe_comments" var="post">

<b:if cond="data:post.allowIframeComments">

<p>
<script expr:src="data:post.iframeCommentSrc" type="text/javascript"></script>
</p>

<div class="cmt_iframe_holder" expr:data-href="data:post.canonicalUrl"
expr:data-viewtype="data:post.viewType">

</div>

</p>

<b:if cond="data:post.embedCommentForm == &quot;false&quot;">

<a expr:href="data:post.addCommentUrl" expr:onclick="data:post.addCommentOnclick"><data:postcommentmsg></data:postcommentmsg></a>

</b:if>

</b:if>

</b:includable>

<b:includable id="mobile-index-post" var="post">

<div class="mobile-date-outer date-outer">

</p>
<b:if cond="data:post.dateHeader">

<div class="date-header">

</p>
<span><data:post.dateheader></data:post.dateheader></span>

<p>

</div>

</p>
</b:if>

<div class="mobile-post-outer">

</p>
<a expr:href="data:post.url">

<h3 class="mobile-index-title entry-title" itemprop="name">
</p>
<data:post.title></data:post.title>

<p>
</h3>
</p>

<div class="mobile-index-arrow">

&rsaquo;

</div>

</p>

<div class="mobile-index-contents">

</p>
<b:if cond="data:post.thumbnailUrl">

<div class="mobile-index-thumbnail">

</p>

<div class="Image">

</p>
<img expr:src="data:post.thumbnailUrl"></img>

<p>

</div>

</p>
<p>

</div>

</p>
</b:if>

<div class="post-body">

</p>
<b:if cond="data:post.snippet"><data:post.snippet></data:post.snippet></b:if>

<p>

</div>

</p>
<p>

</div>

</p>

<div style="clear: both;">

</div>

</p>
</a>

<div class="mobile-index-comment">

</p>
<b:if cond="data:blog.pageType != &quot;static_page&quot;">

<b:if cond="data:post.allowComments">

<b:if cond="data:post.numComments != 0">

<b:include data="post" name="comment_count_picker"></b:include>

</b:if>

</b:if>

</b:if>

<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
</b:includable>

<b:includable id="mobile-main" var="top">

<!-- posts -->

<div class="blog-posts hfeed">

</p>

<b:include data="top" name="status-message"></b:include>

<b:if cond="data:blog.pageType == &quot;index&quot;">

<b:loop values="data:posts" var="post">

<b:include data="post" name="mobile-index-post"></b:include>

</b:loop>

<b:else></b:else>

<b:loop values="data:posts" var="post">

<b:include data="post" name="mobile-post"></b:include>

</b:loop>

</b:if>

<p>

</div>

</p>

<b:include name="mobile-nextprev"></b:include>

</b:includable>

<b:includable id="mobile-nextprev">

<div id="blog-pager" class="blog-pager">

</p>
<b:if cond="data:newerPageUrl">

<div id="blog-pager-newer-link" class="mobile-link-button">

</p>
<a class="blog-pager-newer-link" expr:href="data:newerPageUrl" expr:id="data:widget.instanceId + &quot;_blog-pager-newer-link&quot;" expr:title="data:newerPageTitle">&lsaquo;</a>

<p>

</div>

</p>
</b:if>

<b:if cond="data:olderPageUrl">

<div id="blog-pager-older-link" class="mobile-link-button">

</p>
<a class="blog-pager-older-link" expr:href="data:olderPageUrl" expr:id="data:widget.instanceId + &quot;_blog-pager-older-link&quot;" expr:title="data:olderPageTitle">&rsaquo;</a>

<p>

</div>

</p>
</b:if>

<div id="blog-pager-home-link" class="mobile-link-button">

</p>
<a class="home-link" expr:href="data:blog.homepageUrl"><data:homemsg></data:homemsg></a>

<p>

</div>

</p>

<div class="mobile-desktop-link">

</p>
<a class="home-link" expr:href="data:desktopLinkUrl"><data:desktoplinkmsg></data:desktoplinkmsg></a>

<p>

</div>

</p>

<p>

</div>

</p>

<div class="clear">

</div>

</p>
</b:includable>

<b:includable id="mobile-post" var="post">

<div class="date-outer">

</p>
<b:if cond="data:post.dateHeader">

<span><data:post.dateheader></data:post.dateheader></span> {.date-header}
----------------------------------------------------------

</p>
</b:if>

<div class="date-posts">

</p>

<div class="post-outer">

</p>

<div class="post hentry uncustomized-post-template"
itemscope="itemscope" itemtype="http://schema.org/BlogPosting">

</p>
<b:if cond="data:post.thumbnailUrl">

<meta expr:content="data:post.thumbnailUrl" itemprop="image_url"></meta>

</b:if>

<meta expr:content="data:blog.blogId" itemprop="blogId"></meta>

<meta expr:content="data:post.id" itemprop="postId"></meta>

<a expr:name="data:post.id"></a>

<b:if cond="data:post.title">

<h3 class="post-title entry-title" itemprop="name">
</p>
<b:if cond="data:post.link">

<a expr:href="data:post.link"><data:post.title></data:post.title></a>

<b:else></b:else>

<b:if cond="data:post.url">

<b:if cond="data:blog.url != data:post.url">

<a expr:href="data:post.url"><data:post.title></data:post.title></a>

<b:else></b:else>

<data:post.title></data:post.title>

</b:if>

<b:else></b:else>

<data:post.title></data:post.title>

</b:if>

</b:if>

<p>
</h3>
</p>
</b:if>

<div class="post-header">

</p>

<div class="post-header-line-1">

</div>

</p>
<p>

</div>

</p>

<div class="post-body entry-content"
expr:id="&quot;post-body-&quot; + data:post.id" itemprop="articleBody">

</p>
<data:post.body></data:post.body>

<div style="clear: both;">

</div>

<!-- clear for photos floats -->
</p>
<p>

</div>

</p>

<div class="post-footer">

</p>

<div class="post-footer-line post-footer-line-1">

</p>
<span class="post-author vcard">

<b:if cond="data:top.showAuthor">

<b:if cond="data:post.authorProfileUrl">

<span class="fn" itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">

<meta expr:content="data:post.authorProfileUrl" itemprop="url"></meta>

<a expr:href="data:post.authorProfileUrl" rel="author" title="author profile">

<span itemprop="name"><data:post.author></data:post.author></span>

</a>

</span>

<b:else></b:else>

<span class="fn" itemprop="author" itemscope="itemscope" itemtype="http://schema.org/Person">

<span itemprop="name"><data:post.author></data:post.author></span>

</span>

</b:if>

</b:if>

</span>

<span class="post-timestamp">

<b:if cond="data:top.showTimestamp">

<data:top.timestamplabel></data:top.timestamplabel>

<b:if cond="data:post.url">

<meta expr:content="data:post.canonicalUrl" itemprop="url"></meta>

<a class="timestamp-link" expr:href="data:post.url" rel="bookmark" title="permanent link"><abbr class="published" expr:title="data:post.timestampISO8601" itemprop="datePublished"><data:post.timestamp></data:post.timestamp></abbr></a>

</b:if>

</b:if>

</span>

<span class="post-comment-link">

<b:if cond="data:blog.pageType != &quot;item&quot;">

<b:if cond="data:blog.pageType != &quot;static_page&quot;">

<b:if cond="data:post.allowComments">

<b:include data="post" name="comment_count_picker"></b:include>

</b:if>

</b:if>

</b:if>

</span>

<p>

</div>

</p>

<div class="post-footer-line post-footer-line-2">

</p>
<b:if cond="data:top.showMobileShare">

<div id="mobile-share-button"
class="mobile-link-button goog-inline-block">

</p>
[<data:sharemsg></data:sharemsg>](javascript:void(0);)

<p>

</div>

</p>
</b:if>

<b:if cond="data:top.showDummy">

<div class="goog-inline-block dummy-container">

<data:post.dummytag></data:post.dummytag>

</div>

</p>
</b:if>

<p>

</div>

</p>

<p>

</div>

</p>
<p>

</div>

</p>

<b:if cond="data:blog.pageType == &quot;static_page&quot;">

<b:include data="post" name="comment_picker"></b:include>

</b:if>

<b:if cond="data:blog.pageType == &quot;item&quot;">

<b:include data="post" name="comment_picker"></b:include>

</b:if>

<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
</b:includable>

<b:includable id="nextprev">

<div id="blog-pager" class="blog-pager">

</p>
<b:if cond="data:newerPageUrl">

<span id="blog-pager-newer-link">

<a class="blog-pager-newer-link" expr:href="data:newerPageUrl" expr:id="data:widget.instanceId + &quot;_blog-pager-newer-link&quot;" expr:title="data:newerPageTitle"><data:newerpagetitle></data:newerpagetitle></a>

</span>

</b:if>

<b:if cond="data:olderPageUrl">

<span id="blog-pager-older-link">

<a class="blog-pager-older-link" expr:href="data:olderPageUrl" expr:id="data:widget.instanceId + &quot;_blog-pager-older-link&quot;" expr:title="data:olderPageTitle"><data:olderpagetitle></data:olderpagetitle></a>

</span>

</b:if>

<a class="home-link" expr:href="data:blog.homepageUrl"><data:homemsg></data:homemsg></a>

<b:if cond="data:mobileLinkUrl">

<div class="blog-mobile-link">

</p>
<a expr:href="data:mobileLinkUrl"><data:mobilelinkmsg></data:mobilelinkmsg></a>

<p>

</div>

</p>
</b:if>

<p>

</div>

</p>

<div class="clear">

</div>

</p>
</b:includable>

<b:includable id="post" var="post">

<div class="post hentry">

</p>
<a expr:name="data:post.id"></a>

<b:if cond="data:post.title">

<h3 class="post-title entry-title">
</p>
<b:if cond="data:post.link">

<a expr:href="data:post.link"><data:post.title></data:post.title></a>

<b:else></b:else>

<b:if cond="data:post.url">

<b:if cond="data:blog.url != data:post.url">

<a expr:href="data:post.url"><data:post.title></data:post.title></a>

<b:else></b:else>

<data:post.title></data:post.title>

</b:if>

<b:else></b:else>

<data:post.title></data:post.title>

</b:if>

</b:if>

<p>
</h3>
</p>
</b:if>

<div class="post-header">

</p>

<div class="post-header-line-1">

<span class="post-timestamp">
</p>
<b:if cond="data:top.showTimestamp">

<data:top.timestamplabel></data:top.timestamplabel>

<b:if cond="data:post.url">

<a class="timestamp-link" expr:href="data:post.url" rel="bookmark" title="permanent link"><abbr class="published" expr:title="data:post.timestampISO8601"><data:post.timestamp></data:post.timestamp></abbr></a>

</b:if>

</b:if>

<p>
</span>

</div>

</p>
<p>

</div>

</p>

<div class="post-body entry-content"
expr:id="&quot;post-body-&quot; + data:post.id">

</p>
<data:post.body></data:post.body>

<div style="clear: both;">

</div>

<!-- clear for photos floats -->
</p>
<p>

</div>

</p>

<b:if cond="data:post.hasJumpLink">

<div class="jump-link">

</p>
<a expr:href="data:post.url + &quot;#more&quot;" expr:title="data:post.title"><data:post.jumptext></data:post.jumptext></a>

<p>

</div>

</p>
</b:if>

<div class="post-footer">

</p>

<div class="post-footer-line post-footer-line-1">

<div class="post-share-buttons goog-inline-block">

</p>
<b:if cond="data:post.sharePostUrl">

<b:include data="post" name="shareButtons"></b:include>

</b:if>

<p>

</div>

<span class="post-icons">
</p>
<!-- email post links -->

<b:if cond="data:post.emailPostUrl">

<span class="item-action">

<a expr:href="data:post.emailPostUrl" expr:title="data:top.emailPostMsg">

![](http://img1.blogblog.com/img/icon18_email.gif)

</a>

</span>

</b:if>

<!-- quickedit pencil -->

<b:include data="post" name="postQuickEdit"></b:include>

<p>
</span>

</div>

</p>

<div class="post-footer-line post-footer-line-2">

<span class="post-labels">
</p>
<b:if cond="data:post.labels">

<data:postlabelslabel></data:postlabelslabel>

<b:loop values="data:post.labels" var="label">

<a expr:href="data:label.url" rel="tag"><data:label.name></data:label.name></a><b:if cond="data:label.isLast != &quot;true&quot;">,</b:if>

</b:loop>

</b:if>

</span> <span class="post-backlinks post-comment-link">

<b:if cond="data:blog.pageType != &quot;item&quot;">

<b:if cond="data:blog.pageType != &quot;static_page&quot;">

<b:if cond="data:post.showBacklinks">

<a class="comment-link" expr:href="data:post.url + &quot;#links&quot;"><data:top.backlinklabel></data:top.backlinklabel></a>

</b:if>

</b:if>

</b:if>

<p>
</span>

</div>

</p>

<div class="post-footer-line post-footer-line-3">

<span class="post-comment-link">
</p>
<b:if cond="data:blog.pageType != &quot;item&quot;">

<b:if cond="data:blog.pageType != &quot;static_page&quot;">

<b:if cond="data:post.allowComments">

<a class="comment-link" expr:href="data:post.addCommentUrl" expr:onclick="data:post.addCommentOnclick"><b:if cond="data:post.numComments == 1">1
<data:top.commentlabel></data:top.commentlabel><b:else></b:else><data:post.numcomments></data:post.numcomments>
<data:top.commentlabelplural></data:top.commentlabelplural></b:if></a>

</b:if>

</b:if>

</b:if>

<p>
</span>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
</b:includable>

<b:includable id="postQuickEdit" var="post">

<b:if cond="data:post.editUrl">

<span expr:class="&quot;item-control &quot; + data:post.adminClass">

<a expr:href="data:post.editUrl" expr:title="data:top.editPostMsg">

![](http://img2.blogblog.com/img/icon18_edit_allbkg.gif)

</a>

</span>

</b:if>

</b:includable>

<b:includable id="shareButtons" var="post">

<b:if cond="data:top.showEmailButton"><a class="goog-inline-block share-button sb-email" expr:href="data:post.sharePostUrl + &quot;&amp;target=email&quot;" expr:title="data:top.emailThisMsg" target="_blank"><span
class="share-button-link-text"><data:top.emailthismsg></data:top.emailthismsg></span></a></b:if><b:if cond="data:top.showBlogThisButton"><a class="goog-inline-block share-button sb-blog" expr:href="data:post.sharePostUrl + &quot;&amp;target=blog&quot;" expr:onclick="&quot;window.open(this.href, \&quot;_blank\&quot;, \&quot;height=270,width=475\&quot;); return false;&quot;" expr:title="data:top.blogThisMsg" target="_blank"><span
class="share-button-link-text"><data:top.blogthismsg></data:top.blogthismsg></span></a></b:if><b:if cond="data:top.showTwitterButton"><a class="goog-inline-block share-button sb-twitter" expr:href="data:post.sharePostUrl + &quot;&amp;target=twitter&quot;" expr:title="data:top.shareToTwitterMsg" target="_blank"><span
class="share-button-link-text"><data:top.sharetotwittermsg></data:top.sharetotwittermsg></span></a></b:if><b:if cond="data:top.showFacebookButton"><a class="goog-inline-block share-button sb-facebook" expr:href="data:post.sharePostUrl + &quot;&amp;target=facebook&quot;" expr:onclick="&quot;window.open(this.href, \&quot;_blank\&quot;, \&quot;height=430,width=640\&quot;); return false;&quot;" expr:title="data:top.shareToFacebookMsg" target="_blank"><span
class="share-button-link-text"><data:top.sharetofacebookmsg></data:top.sharetofacebookmsg></span></a></b:if><b:if cond="data:top.showOrkutButton"><a class="goog-inline-block share-button sb-orkut" expr:href="data:post.sharePostUrl + &quot;&amp;target=orkut&quot;" expr:title="data:top.shareToOrkutMsg" target="_blank"><span
class="share-button-link-text"><data:top.sharetoorkutmsg></data:top.sharetoorkutmsg></span></a></b:if><b:if cond="data:top.showPinterestButton"><a class="goog-inline-block share-button sb-pinterest" expr:href="data:post.sharePostUrl + &quot;&amp;target=pinterest&quot;" expr:title="data:top.shareToPinterestMsg" target="_blank"><span
class="share-button-link-text"><data:top.sharetopinterestmsg></data:top.sharetopinterestmsg></span></a></b:if><b:if cond="data:top.showDummy">

<div class="goog-inline-block dummy-container">

<data:post.dummytag></data:post.dummytag>

</div>

</b:if>
</p>
</b:includable>

<b:includable id="status-message">

<b:if cond="data:navMessage">

<div class="status-msg-wrap">

</p>

<div class="status-msg-body">

</p>
<data:navmessage></data:navmessage>

<p>

</div>

</p>

<div class="status-msg-border">

</p>

<div class="status-msg-bg">

</p>

<div class="status-msg-hidden">

<data:navmessage></data:navmessage>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div style="clear: both;">

</div>

</p>
</b:if>

</b:includable>

<b:includable id="threaded-comment-form" var="post">

<div class="comment-form">

</p>
<a name="comment-form"></a>

<b:if cond="data:mobile">

<data:blogcommentmessage></data:blogcommentmessage>

</p>
<data:blogteamblogmessage></data:blogteamblogmessage>

<a expr:href="data:post.commentFormIframeSrc" id="comment-editor-src"></a>

<iframe allowtransparency="true" class="blogger-iframe-colorize blogger-comment-from-post" frameborder="0" height="410" id="comment-editor" name="comment-editor" src style="display: none" width="100%"></iframe>

<b:else></b:else>

<data:blogcommentmessage></data:blogcommentmessage>

</p>
<data:blogteamblogmessage></data:blogteamblogmessage>

<a expr:href="data:post.commentFormIframeSrc" id="comment-editor-src"></a>

<iframe allowtransparency="true" class="blogger-iframe-colorize blogger-comment-from-post" frameborder="0" height="410" id="comment-editor" name="comment-editor" src width="100%"></iframe>

</b:if>

<data:post.friendconnectjs></data:post.friendconnectjs>

<data:post.cmtfpiframe></data:post.cmtfpiframe>

<p>
<script type="text/javascript"></p><p>      BLOG_CMT_createIframe('<data:post.apprpcrelaypath></data:post.apprpcrelaypath>', '<data:post.communityid></data:post.communityid>');</p><p>    </script>
</p>
<p>

</div>

</p>
</b:includable>

<b:includable id="threaded_comment_js" var="post">

<p>
<script async="async" expr:src="data:post.commentSrc" type="text/javascript"></script>
</p>

<p>
<script type="text/javascript"></p><p>    (function() {</p><p>      var items = <data:post.commentjso></data:post.commentjso>;</p><p>      var msgs = <data:post.commentmsgs></data:post.commentmsgs>;</p><p>      var config = <data:post.commentconfig></data:post.commentconfig>;</p><p></p><p>// </p><p>      var cursor = null;</p><p>      if (items && items.length > 0) {</p><p>        cursor = parseInt(items[items.length - 1].timestamp) + 1;</p><p>      }</p><p></p><p>      var bodyFromEntry = function(entry) {</p><p>        if (entry.gd$extendedProperty) {</p><p>          for (var k in entry.gd$extendedProperty) {</p><p>            if (entry.gd$extendedProperty[k].name == 'blogger.contentRemoved') {</p><p>              return '<span class="deleted-comment">' + entry.content.$t + '</span>';</p><p>            }</p><p>          }</p><p>        }</p><p>        return entry.content.$t;</p><p>      }</p><p></p><p>      var parse = function(data) {</p><p>        cursor = null;</p><p>        var comments = [];</p><p>        if (data && data.feed && data.feed.entry) {</p><p>          for (var i = 0, entry; entry = data.feed.entry[i]; i++) {</p><p>            var comment = {};</p><p>            // comment ID, parsed out of the original id format</p><p>            var id = /blog-(\d+).post-(\d+)/.exec(entry.id.$t);</p><p>            comment.id = id ? id[2] : null;</p><p>            comment.body = bodyFromEntry(entry);</p><p>            comment.timestamp = Date.parse(entry.published.$t) + '';</p><p>            if (entry.author && entry.author.constructor === Array) {</p><p>              var auth = entry.author[0];</p><p>              if (auth) {</p><p>                comment.author = {</p><p>                  name: (auth.name ? auth.name.$t : undefined),</p><p>                  profileUrl: (auth.uri ? auth.uri.$t : undefined),</p><p>                  avatarUrl: (auth.gd$image ? auth.gd$image.src : undefined)</p><p>                };</p><p>              }</p><p>            }</p><p>            if (entry.link) {</p><p>              if (entry.link[2]) {</p><p>                comment.link = comment.permalink = entry.link[2].href;</p><p>              }</p><p>              if (entry.link[3]) {</p><p>                var pid = /.*comments\/default\/(\d+)\?.*/.exec(entry.link[3].href);</p><p>                if (pid && pid[1]) {</p><p>                  comment.parentId = pid[1];</p><p>                }</p><p>              }</p><p>            }</p><p>            comment.deleteclass = 'item-control blog-admin';</p><p>            if (entry.gd$extendedProperty) {</p><p>              for (var k in entry.gd$extendedProperty) {</p><p>                if (entry.gd$extendedProperty[k].name == 'blogger.itemClass') {</p><p>                  comment.deleteclass += ' ' + entry.gd$extendedProperty[k].value;</p><p>                } else if (entry.gd$extendedProperty[k].name == 'blogger.displayTime') {</p><p>                  comment.displayTime = entry.gd$extendedProperty[k].value;</p><p>                }</p><p>              }</p><p>            }</p><p>            comments.push(comment);</p><p>          }</p><p>        }</p><p>        return comments;</p><p>      };</p><p></p><p>      var paginator = function(callback) {</p><p>        if (hasMore()) {</p><p>          var url = config.feed + '?alt=json&v=2&orderby=published&reverse=false&max-results=50';</p><p>          if (cursor) {</p><p>            url += '&published-min=' + new Date(cursor).toISOString();</p><p>          }</p><p>          window.bloggercomments = function(data) {</p><p>            var parsed = parse(data);</p><p>            cursor = parsed.length < 50 ? null</p><p>                : parseInt(parsed[parsed.length - 1].timestamp) + 1</p><p>            callback(parsed);</p><p>            window.bloggercomments = null;</p><p>          }</p><p>          url += '&callback=bloggercomments';</p><p>          var script = document.createElement('script');</p><p>          script.type = 'text/javascript';</p><p>          script.src = url;</p><p>          document.getElementsByTagName('head')[0].appendChild(script);</p><p>        }</p><p>      };</p><p>      var hasMore = function() {</p><p>        return !!cursor;</p><p>      };</p><p>      var getMeta = function(key, comment) {</p><p>        if ('iswriter' == key) {</p><p>          var matches = !!comment.author</p><p>              && comment.author.name == config.authorName</p><p>              && comment.author.profileUrl == config.authorUrl;</p><p>          return matches ? 'true' : '';</p><p>        } else if ('deletelink' == key) {</p><p>          return config.baseUri + '/delete-comment.g?blogID='</p><p>               + config.blogId + '&postID=' + comment.id;</p><p>        } else if ('deleteclass' == key) {</p><p>          return comment.deleteclass;</p><p>        }</p><p>        return '';</p><p>      };</p><p></p><p>      var replybox = null;</p><p>      var replyUrlParts = null;</p><p>      var replyParent = undefined;</p><p></p><p>      var onReply = function(commentId, domId) {</p><p>        if (replybox == null) {</p><p>          // lazily cache replybox, and adjust to suit this style:</p><p>          replybox = document.getElementById('comment-editor');</p><p>          if (replybox != null) {</p><p>            replybox.height = '250px';</p><p>            replybox.style.display = 'block';</p><p>            replyUrlParts = replybox.src.split('#');</p><p>          }</p><p>        }</p><p>        if (replybox && (commentId !== replyParent)) {</p><p>          document.getElementById(domId).insertBefore(replybox, null);</p><p>          replybox.src = replyUrlParts[0]</p><p>              + (commentId ? '&parentID=' + commentId : '')</p><p>              + '#' + replyUrlParts[1];</p><p>          replyParent = commentId;</p><p>        }</p><p>      };</p><p></p><p>      var hash = (window.location.hash || '#').substring(1);</p><p>      var startThread, targetComment;</p><p>      if (/^comment-form_/.test(hash)) {</p><p>        startThread = hash.substring('comment-form_'.length);</p><p>      } else if (/^c[0-9]+$/.test(hash)) {</p><p>        targetComment = hash.substring(1);</p><p>      }</p><p></p><p>      // Configure commenting API:</p><p>      var configJso = {</p><p>        'maxDepth': config.maxThreadDepth</p><p>      };</p><p>      var provider = {</p><p>        'id': config.postId,</p><p>        'data': items,</p><p>        'loadNext': paginator,</p><p>        'hasMore': hasMore,</p><p>        'getMeta': getMeta,</p><p>        'onReply': onReply,</p><p>        'rendered': true,</p><p>        'initComment': targetComment,</p><p>        'initReplyThread': startThread,</p><p>        'config': configJso,</p><p>        'messages': msgs</p><p>      };</p><p></p><p>      var render = function() {</p><p>        if (window.goog && window.goog.comments) {</p><p>          var holder = document.getElementById('comment-holder');</p><p>          window.goog.comments.render(holder, provider);</p><p>        }</p><p>      };</p><p></p><p>      // render now, or queue to render when library loads:</p><p>      if (window.goog && window.goog.comments) {</p><p>        render();</p><p>      } else {</p><p>        window.goog = window.goog || {};</p><p>        window.goog.comments = window.goog.comments || {};</p><p>        window.goog.comments.loadQueue = window.goog.comments.loadQueue || [];</p><p>        window.goog.comments.loadQueue.push(render);</p><p>      }</p><p>    })();</p><p>// </p><p>  </script>
</p>
</b:includable>

<b:includable id="threaded_comments" var="post">

<div id="comments" class="comments">

</p>
<a name="comments"></a>

#### <data:post.commentlabelfull></data:post.commentlabelfull>:

</p>

<div class="comments-content">

</p>
<b:if cond="data:post.embedCommentForm">

<b:include data="post" name="threaded_comment_js"></b:include>

</b:if>

<div id="comment-holder">

</p>
<data:post.commenthtml></data:post.commenthtml>

<p>

</div>

</p>
<p>

</div>

</p>

<b:if cond="data:post.allowNewComments">

<b:include data="post" name="threaded-comment-form"></b:include>

<b:else></b:else>

<data:post.nonewcommentstext></data:post.nonewcommentstext>

</b:if>

</p>

<b:if cond="data:showCmtPopup">

<div id="comment-popup">

</p>
<iframe allowtransparency="true" frameborder="0" id="comment-actions" name="comment-actions" scrolling="no">

</iframe>

<p>

</div>

</p>
</b:if>

<div id="backlinks-container">

</p>

<div
expr:id="data:widget.instanceId + &quot;_backlinks-container&quot;">

</p>
<b:if cond="data:post.showBacklinks">

<b:include data="post" name="backlinks"></b:include>

</b:if>

<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
</b:includable>

</b:widget>

</b:section>

<p>

</div>

</p>
<p>

</div>

</p>

<div class="column-left-outer">

</p>

<div class="column-left-inner">

</p>
<p>
<aside>
</p>
<macro:include id="main-column-left-sections" name="sections">

<macro:param default="0" name="num"></macro:param>

<macro:param default="sidebar-left" name="idPrefix"></macro:param>

<macro:param default="sidebar" name="class"></macro:param>

<macro:param default="true" name="includeBottom"></macro:param>

</macro:include>

<p>
</aside>
</p>
<p>

</div>

</p>
<p>

</div>

</p>

<div class="column-right-outer">

</p>

<div class="column-right-inner">

</p>
<p>
<aside>
</p>
<macro:include id="main-column-right-sections" name="sections">

<macro:param default="2" name="num"></macro:param>

<macro:param default="sidebar-right" name="idPrefix"></macro:param>

<macro:param default="sidebar" name="class"></macro:param>

<macro:param default="true" name="includeBottom"></macro:param>

</macro:include>

<p>
</aside>
</p>
<p>

</div>

</p>
<p>

</div>

</p>

<p>

</div>

</p>

<div style="clear: both">

</div>

</p>
<!-- columns -->

<p>

</div>

</p>

<!-- main -->

<p>

</div>

</p>
<p>

</div>

</p>

<div class="main-cap-bottom cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<p>
<footer>
</p>

<div class="footer-outer">

</p>

<div class="footer-cap-top cap-top">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>

<div class="fauxborder-left footer-fauxborder-left">

</p>

<div class="fauxborder-right footer-fauxborder-right">

</div>

</p>

<div class="region-inner footer-inner">

</p>
<macro:include id="footer-sections" name="sections">

<macro:param default="2" name="num"></macro:param>

<macro:param default="footer" name="idPrefix"></macro:param>

<macro:param default="foot" name="class"></macro:param>

<macro:param default="false" name="includeBottom"></macro:param>

</macro:include>

<!-- outside of the include in order to lock Attribution widget -->

<b:section class="foot" id="footer-3" showaddelement="no">

<b:widget id="Attribution1" locked="true" title type="Attribution">

<b:includable id="main">

<b:if cond="data:feedbackSurveyLink">

<div class="mobile-survey-link" style="text-align: center;">

</p>
<data:feedbacksurveylink></data:feedbacksurveylink>

<p>

</div>

</p>
</b:if>

<div class="widget-content" style="text-align: center;">

</p>
<b:if cond="data:attribution != &quot;&quot;">

<data:attribution></data:attribution>

</b:if>

<p>

</div>

</p>

<b:include name="quickedit"></b:include>

</b:includable>

</b:widget>

</b:section>

<p>

</div>

</p>
<p>

</div>

</p>

<div class="footer-cap-bottom cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
<p>
</footer>
</p>

<!-- content -->

<p>

</div>

</p>
<p>

</div>

</p>

<div class="content-cap-bottom cap-bottom">

</p>

<div class="cap-left">

</div>

</p>

<div class="cap-right">

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>
<p>

</div>

</p>

<p>
<script type="text/javascript"></p><p>    window.setTimeout(function() {</p><p>        document.body.className = document.body.className.replace('loading', '');</p><p>      }, 10);</p><p>  </script>
</p>
<b:include data="blog" name="google-analytics"></b:include>

<p>
</p>

<macro:includable id="sections" var="col">

<macro:if cond="data:col.num == 0">

<macro:else></macro:else>

<b:section mexpr:class="data:col.class" mexpr:id="data:col.idPrefix + &quot;-1&quot;" preferred="yes" showaddelement="yes"></b:section>

<macro:if cond="data:col.num &gt;= 2">

<table border="0" cellpadding="0" cellspacing="0" mexpr:class="&quot;section-columns columns-&quot; + data:col.num">
</p>
<p>
<tbody>
</p>
<p>
<tr>
</p>
<p>
<td class="first columns-cell">
</p>
<b:section mexpr:class="data:col.class" mexpr:id="data:col.idPrefix + &quot;-2-1&quot;"></b:section>

<p>
</td>
</p>

<p>
<td class="columns-cell">
</p>
<b:section mexpr:class="data:col.class" mexpr:id="data:col.idPrefix + &quot;-2-2&quot;"></b:section>

<p>
</td>
</p>

<macro:if cond="data:col.num &gt;= 3">

<p>
<td class="columns-cell">
</p>
<b:section mexpr:class="data:col.class" mexpr:id="data:col.idPrefix + &quot;-2-3&quot;"></b:section>

<p>
</td>
</p>
</macro:if>

<macro:if cond="data:col.num &gt;= 4">

<p>
<td class="columns-cell">
</p>
<b:section mexpr:class="data:col.class" mexpr:id="data:col.idPrefix + &quot;-2-4&quot;"></b:section>

<p>
</td>
</p>
</macro:if>

<p>
</tr>
</p>
<p>
</tbody>
</p>
<p>
</table>
</p>

<macro:if cond="data:col.includeBottom">

<b:section mexpr:class="data:col.class" mexpr:id="data:col.idPrefix + &quot;-3&quot;" showaddelement="no"></b:section>

</macro:if>

</macro:if>

</macro:if>

</macro:includable>

<b:section-contents id="sidebar-right-1">

<b:widget id="CustomSearch1" locked="false" title="Search-Stuff" type="CustomSearch">

<b:includable id="main">

<!-- only display title if it's non-empty -->

<b:if cond="data:title != &quot;&quot;">

<data:title></data:title> {.title}
-------------------------

</p>
</b:if>

<div class="widget-content">

</p>

<div expr:id="data:widget.instanceId + &quot;_form&quot;">

</p>
<span class="cse-status"><data:loadingmsg></data:loadingmsg></span>

<p>

</div>

</p>
<p>

</div>

</p>

<!-- override gsearch.css -->

<p>
<style type="text/css"></p><p>      #uds-searchControl .gs-result .gs-title,</p><p>      #uds-searchControl .gs-result .gs-title *,</p><p>      #uds-searchControl .gsc-results .gsc-trailing-more-results,</p><p>      #uds-searchControl .gsc-results .gsc-trailing-more-results * {</p><p>        color:<data:linkcolor></data:linkcolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gs-result .gs-title a:visited,</p><p>      #uds-searchControl .gs-result .gs-title a:visited * {</p><p>        color:<data:visitedlinkcolor></data:visitedlinkcolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gs-relativePublishedDate,</p><p>      #uds-searchControl .gs-publishedDate {</p><p>        color: <data:datecolor></data:datecolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gs-result a.gs-visibleUrl,</p><p>      #uds-searchControl .gs-result .gs-visibleUrl {</p><p>        color: <data:urlcolor></data:urlcolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gsc-results {</p><p>        border-color: <data:bordercolor></data:bordercolor>;</p><p>        background-color: <data:backgroundcolor></data:backgroundcolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gsc-tabhActive {</p><p>        border-color: <data:bordercolor></data:bordercolor>;</p><p>        border-top-color: <data:activebordercolor></data:activebordercolor>;</p><p>        background-color: <data:backgroundcolor></data:backgroundcolor>;</p><p>        color: <data:textcolor></data:textcolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gsc-tabhInactive {</p><p>        border-color: <data:bordercolor></data:bordercolor>;</p><p>        background-color: transparent;</p><p>        color: <data:linkcolor></data:linkcolor>;</p><p>      }</p><p></p><p>      #uds-searchClearResults {</p><p>        border-color: <data:bordercolor></data:bordercolor>;</p><p>      }</p><p></p><p>      #uds-searchClearResults:hover {</p><p>        border-color: <data:activebordercolor></data:activebordercolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gsc-cursor-page {</p><p>        color: <data:linkcolor></data:linkcolor>;</p><p>      }</p><p></p><p>      #uds-searchControl .gsc-cursor-current-page {</p><p>        color: <data:textcolor></data:textcolor>;</p><p>      }</p><p>    </style>
</p>

<b:include name="quickedit"></b:include>

</b:includable>

</b:widget>

<b:widget id="PlusOne1" locked="false" title="+1 Button" type="PlusOne">

<b:includable id="main">

<div class="widget-content">

</p>
<g:plusone expr:annotation="data:annotation" expr:href="data:blog.canonicalHomepageUrl" expr:size="data:size" source="blogger:blog:plusone" width="250"></g:plusone>

<p>
<script type="text/javascript"></p><p>      window.___gcfg = {"lang": "<data:language></data:language>"};</p><p>    </script>
</p>
<p>

</div>

</p>

</b:includable>

</b:widget>

<b:widget id="Profile1" locked="false" title="About me" type="Profile">

<b:includable id="main">

<b:if cond="data:title != &quot;&quot;">

<data:title></data:title>
-------------------------

</p>
</b:if>

<div class="widget-content">

</p>
<b:if cond="data:team == &quot;true&quot;"> <!-- team blog profile -->

-   <a class="profile-name-link g-profile" expr:href="data:i.userUrl" expr:style="&quot;background-image: url(&quot; + data:i.profileLogo + &quot;);&quot;"><data:i.display-name></data:i.display-name></a>

</p>

<b:else></b:else> <!-- normal blog profile -->

<b:if cond="data:photo.url != &quot;&quot;">

<a expr:href="data:userUrl"><img class="profile-img" expr:alt="data:photo.alt" expr:height="data:photo.height" expr:src="data:photo.url" expr:width="data:photo.width"></img></a>

</b:if>

<dl class="profile-datablock">
</p>
<p>
<dt class="profile-data">
</p>
<a class="profile-name-link g-profile" expr:href="data:userUrl" expr:style="&quot;background-image: url(&quot; + data:profileLogo + &quot;);&quot;" rel="author">

<data:displayname></data:displayname>

</a>

<b:if cond="data:hasgoogleprofile">

  

<div class="g-follow" data-annotation="bubble" data-height="20"
expr:data-href="data:userUrl">

</div>

</p>
</b:if>

<p>
</dt>
</p>

<b:if cond="data:showlocation == &quot;true&quot;">

<p>
<dd class="profile-data">
<data:location></data:location>
</dd>
</p>
</b:if>

<p>
<b:if cond="data:aboutme != &quot;&quot;">
<dd class="profile-textblock">
<data:aboutme></data:aboutme>
</dd>
</b:if>
</p>
<p>
</dl>
</p>
<a class="profile-link" expr:href="data:userUrl" rel="author"><data:viewprofilemsg></data:viewprofilemsg></a>

</b:if>

<b:include name="quickedit"></b:include>

<p>

</div>

</p>
</b:includable>

</b:widget>

<b:widget id="PopularPosts1" locked="false" title="My Top 5" type="PopularPosts">

<b:includable id="main">

<b:if cond="data:title">

<data:title></data:title>
-------------------------

</b:if>

</p>

<div class="widget-content popular-posts">

</p>

-   </p>
    <b:if cond="data:showThumbnails == &quot;false&quot;">

    <b:if cond="data:showSnippets == &quot;false&quot;">

    <!-- (1) No snippet/thumbnail -->

    <a expr:href="data:post.href"><data:post.title></data:post.title></a>

    <b:else></b:else>

    <!-- (2) Show only snippets -->

    <div class="item-title">

    <a expr:href="data:post.href"><data:post.title></data:post.title></a>

    </div>

    </p>

    <div class="item-snippet">

    <data:post.snippet></data:post.snippet>

    </div>

    </p>
    </b:if>

    <b:else></b:else>

    <b:if cond="data:showSnippets == &quot;false&quot;">

    <!-- (3) Show only thumbnails -->

    <div class="item-thumbnail-only">

    </p>
    <b:if cond="data:post.thumbnail">

    <div class="item-thumbnail">

    </p>
    <a expr:href="data:post.href" target="_blank">

    <img alt border="0" expr:height="data:thumbnailSize" expr:src="data:post.thumbnail" expr:width="data:thumbnailSize"></img>

    </a>

    <p>

    </div>

    </p>
    </b:if>

    <div class="item-title">

    <a expr:href="data:post.href"><data:post.title></data:post.title></a>

    </div>

    </p>
    <p>

    </div>

    </p>

    <div style="clear: both;">

    </div>

    </p>
    <b:else></b:else>

    <!-- (4) Show snippets and thumbnails -->

    <div class="item-content">

    </p>
    <b:if cond="data:post.thumbnail">

    <div class="item-thumbnail">

    </p>
    <a expr:href="data:post.href" target="_blank">

    <img alt border="0" expr:height="data:thumbnailSize" expr:src="data:post.thumbnail" expr:width="data:thumbnailSize"></img>

    </a>

    <p>

    </div>

    </p>
    </b:if>

    <div class="item-title">

    <a expr:href="data:post.href"><data:post.title></data:post.title></a>

    </div>

    </p>

    <div class="item-snippet">

    <data:post.snippet></data:post.snippet>

    </div>

    </p>
    <p>

    </div>

    </p>

    <div style="clear: both;">

    </div>

    </p>
    </b:if>

    </b:if>

    <p>

</p>
<b:include name="quickedit"></b:include>

<p>

</div>

</p>
</b:includable>

</b:widget>

<b:widget id="AdSense1" locked="false" title type="AdSense">

<b:includable id="main">

<div class="widget-content">

</p>
<b:if cond="data:blog.disableAdSenseWidget != &quot;true&quot;">

<data:adcode></data:adcode>

</b:if>

<b:include name="quickedit"></b:include>

<p>

</div>

</p>
</b:includable>

</b:widget>

<b:widget id="Label1" locked="false" title="Tags" type="Label">

<b:includable id="main">

<b:if cond="data:title">

<data:title></data:title>
-------------------------

</p>
</b:if>

<div
expr:class="&quot;widget-content &quot; + data:display + &quot;-label-widget-content&quot;">

</p>
<b:if cond="data:display == &quot;list&quot;">

-   </p>
    <b:if cond="data:blog.url == data:label.url">

    <span
    expr:dir="data:blog.languageDirection"><data:label.name></data:label.name></span>

    <b:else></b:else>

    <a expr:dir="data:blog.languageDirection" expr:href="data:label.url"><data:label.name></data:label.name></a>

    </b:if>

    <b:if cond="data:showFreqNumbers">

    <span dir="ltr">(<data:label.count></data:label.count>)</span>

    </b:if>

    <p>

</p>
<b:else></b:else>

<b:loop values="data:labels" var="label">

<span expr:class="&quot;label-size label-size-&quot; + data:label.cssSize">

<b:if cond="data:blog.url == data:label.url">

<span
expr:dir="data:blog.languageDirection"><data:label.name></data:label.name></span>

<b:else></b:else>

<a expr:dir="data:blog.languageDirection" expr:href="data:label.url"><data:label.name></data:label.name></a>

</b:if>

<b:if cond="data:showFreqNumbers">

<span class="label-count"
dir="ltr">(<data:label.count></data:label.count>)</span>

</b:if>

</span>

</b:loop>

</b:if>

<b:include name="quickedit"></b:include>

<p>

</div>

</p>
</b:includable>

</b:widget>

</b:section-contents><b:section-contents id="sidebar-right-2-1"></b:section-contents><b:section-contents id="sidebar-right-2-2"></b:section-contents><b:section-contents id="sidebar-right-3">

<b:widget id="BlogArchive1" locked="false" title="Archives" type="BlogArchive">

<b:includable id="main">

<b:if cond="data:title">

<data:title></data:title>
-------------------------

</p>
</b:if>

<div class="widget-content">

</p>

<div id="ArchiveList">

</p>

<div expr:id="data:widget.instanceId + &quot;_ArchiveList&quot;">

</p>
<b:if cond="data:style == &quot;HIERARCHY&quot;">

<b:include data="data" name="interval"></b:include>

</b:if>

<b:if cond="data:style == &quot;FLAT&quot;">

<b:include data="data" name="flat"></b:include>

</b:if>

<b:if cond="data:style == &quot;MENU&quot;">

<b:include data="data" name="menu"></b:include>

</b:if>

<p>

</div>

</p>
<p>

</div>

</p>
<b:include name="quickedit"></b:include>

<p>

</div>

</p>
</b:includable>

<b:includable id="flat" var="data">

-   </p>
    <a expr:href="data:i.url"><data:i.name></data:i.name></a>
    (<data:i.post-count></data:i.post-count>)

    <p>

</p>
</b:includable>

<b:includable id="interval" var="intervalData">

<b:loop values="data:intervalData" var="i">

-   </p>
    <b:include data="i" name="toggle"></b:include>

    <a class="post-count-link" expr:href="data:i.url"><data:i.name></data:i.name></a>

    <span class="post-count"
    dir="ltr">(<data:i.post-count></data:i.post-count>)</span>

    <b:if cond="data:i.data">

    <b:include data="i.data" name="interval"></b:include>

    </b:if>

    <b:if cond="data:i.posts">

    <b:include data="i.posts" name="posts"></b:include>

    </b:if>

    <p>

</p>
</b:loop>

</b:includable>

<b:includable id="menu" var="data">

<select expr:id="data:widget.instanceId + &quot;_ArchiveMenu&quot;">

<option value><data:title></data:title></option>

<b:loop values="data:data" var="i">

<option expr:value="data:i.url"><data:i.name></data:i.name>
(<data:i.post-count></data:i.post-count>)</option>

</b:loop>

</select>

</b:includable>

<b:includable id="posts" var="posts">

-   <a expr:href="data:i.url"><data:i.title></data:i.title></a>

</p>
</b:includable>

<b:includable id="toggle" var="interval">

<b:if cond="data:interval.toggleId">

<b:if cond="data:interval.expclass == &quot;expanded&quot;">

<a class="toggle" href="javascript:void(0)">

<span class="zippy toggle-open">▼ </span>

</a>

<b:else></b:else>

<a class="toggle" href="javascript:void(0)">

<span class="zippy">

<b:if cond="data:blog.languageDirection == &quot;rtl&quot;">

◄ 

<b:else></b:else>

► 

</b:if>

</span>

</a>

</b:if>

</b:if>

</b:includable>

</b:widget>

<b:widget id="Followers1" locked="false" title="Follow me!" type="Followers">

<b:includable id="main">

<b:if cond="data:title != &quot;&quot;">

<b:if cond="data:codeSnippet != &quot;&quot;">

<data:title></data:title> {.title}
-------------------------

</p>
<b:else></b:else>

<b:if cond="data:totalFollowerCount != &quot;&quot;">

<data:title></data:title> (<data:totalfollowercount></data:totalfollowercount>) {.title}
-------------------------------------------------------------------------------

</p>
</b:if>

</b:if>

</b:if>

<div class="widget-content">

</p>

<div expr:id="data:widget.instanceId + &quot;-wrapper&quot;">

</p>
<b:if cond="data:codeSnippet != &quot;&quot;">

<div style="margin-right:2px;">

</p>
<data:codesnippet></data:codesnippet>

<p>

</div>

</p>
<b:else></b:else>

<b:if cond="data:totalFollowerCount == &quot;&quot;">

<span class="item-control following-not-admin">

**<data:failuresnippet></data:failuresnippet>**

</span>

<span class="item-control blog-admin">

**<data:adminfailuresnippet></data:adminfailuresnippet>**

</span>

<b:else></b:else>

<b:if cond="data:followingLinkPresent">

<div
class="follow-this profile-link item-control following-follow-this">

</p>
<a expr:href="&quot;javascript:_FollowersView._openPopup(\&quot;&quot; + data:followUri + &quot;\&quot;);&quot;">

<data:followthismessage></data:followthismessage>

</a>

<p>

</div>

</p>

<div
class="follow-this profile-link item-control following-stop-following-this">

</p>
<a expr:href="&quot;javascript:_FollowersView._openPopup(\&quot;&quot; + data:followUri + &quot;\&quot;);&quot;">

<data:stopfollowingmessage></data:stopfollowingmessage>

</a>

<p>

</div>

</p>
</b:if>

<div class="followers-grid">

</p>
<b:if cond="data:totalFollowerCount == 0">

<div class="profile-link item-control following-follow-this">

</p>
<data:emptyfollowersmessage></data:emptyfollowersmessage>

<p>

</div>

</p>
</b:if>

<!--</p><p>            Relies on the js written out in navbar.gxp</p><p>            -->

<b:loop values="data:followers" var="follower">

<div class="follower">

</p>
<a expr:href="data:follower.profileUrl" expr:title="data:follower.displayName" rel="nofollow">

![](http://img1.blogblog.com/img/blank.gif)

</a>

<p>

</div>

</p>
</b:loop>

<div class="clear">

</div>

</p>
<p>

</div>

</p>

<div class="followers-canvas profile-link">

</p>
<data:followersfootermessage></data:followersfootermessage>

<span class="item-control following-not-admin">

<a expr:href="data:followersUri">

<data:viewallmessage></data:viewallmessage>

</a>

</span>

<span class="item-control blog-admin">

<a expr:href="data:manageFollowersUri">

<data:managefollowersmessage></data:managefollowersmessage>

</a>

</span>

<p>

</div>

</p>
</b:if>

</b:if>

<p>

</div>

</p>
<b:include name="quickedit"></b:include>

<p>

</div>

</p>
</b:includable>

</b:widget>

</b:section-contents><b:section-contents id="footer-1"></b:section-contents><b:section-contents id="footer-2-1">

<b:widget id="Subscribe1" locked="false" title="Subscribe To" type="Subscribe">

<b:includable id="main">

<b:if cond="data:isPublic">

<div style="white-space:nowrap">

</p>

<b:if cond="data:title != &quot;&quot;">

<data:title></data:title> {.title}
-------------------------

</p>
</b:if>

<div class="widget-content">

</p>
<b:loop values="data:feeds" var="feed">

<div
expr:class="&quot;subscribe-wrapper subscribe-type-&quot; + data:feed.type">

</p>

<div
expr:class="&quot;subscribe expanded subscribe-type-&quot; + data:feed.type"
expr:id="&quot;SW_READER_LIST_&quot; + data:widgetId + data:feed.type"
style="display:none;">

</p>

<div class="top">

</p>
<span class="inner" expr:onclick="&quot;return(_SW_toggleReaderList(event, \&quot;&quot; + data:widgetId +data:feed.type + &quot;\&quot;));&quot;">

<img class="subscribe-dropdown-arrow" expr:src="data:arrowDropdownImg"></img>

<img align="absmiddle" alt border="0" class="feed-icon" expr:src="data:feedIconImg"></img>

<data:feed.title></data:feed.title>

</span>

<div class="feed-reader-links">

</p>
<a class="feed-reader-link" expr:href="&quot;http://www.netvibes.com/subscribe.php?url=&quot; + data:feed.encodedUrl" target="_blank">

<img expr:src="data:imagePathBase + &quot;subscribe-netvibes.png&quot;"></img>

</a>

<a class="feed-reader-link" expr:href="&quot;http://add.my.yahoo.com/content?url=&quot; + data:feed.encodedUrl" target="_blank">

<img expr:src="data:imagePathBase + &quot;subscribe-yahoo.png&quot;"></img>

</a>

<a class="feed-reader-link" expr:href="data:feed.url" target="_blank">

<img align="absmiddle" class="feed-icon" expr:src="data:feedIconImg"></img>

Atom

</a>

<p>

</div>

</p>

<p>

</div>

</p>

<div class="bottom">

</div>

</p>
<p>

</div>

</p>

<div class="subscribe"
expr:id="&quot;SW_READER_LIST_CLOSED_&quot; + data:widgetId +data:feed.type"
expr:onclick="&quot;return(_SW_toggleReaderList(event, \&quot;&quot; + data:widgetId +data:feed.type + &quot;\&quot;));&quot;">

</p>

<div class="top">

</p>
<span class="inner">

<img class="subscribe-dropdown-arrow" expr:src="data:arrowDropdownImg"></img>

<span expr:onclick="&quot;return(_SW_toggleReaderList(event, \&quot;&quot; + data:widgetId +data:feed.type + &quot;\&quot;));&quot;">

<img align="absmiddle" alt border="0" class="feed-icon" expr:src="data:feedIconImg"></img>

<data:feed.title></data:feed.title>

</span>

</span>

<p>

</div>

</p>

<div class="bottom">

</div>

</p>
<p>

</div>

</p>

<p>

</div>

</p>
</b:loop>

<div style="clear:both">

</div>

</p>

<p>

</div>

</p>
<p>

</div>

</p>

<b:include name="quickedit"></b:include>

</b:if>

</b:includable>

</b:widget>

</b:section-contents><b:section-contents id="footer-2-2">

<b:widget id="HTML1" locked="false" title="Analytics" type="HTML">

<b:includable id="main">

<!-- only display title if it's non-empty -->

<b:if cond="data:title != &quot;&quot;">

<data:title></data:title> {.title}
-------------------------

</p>
</b:if>

<div class="widget-content">

</p>
<data:content></data:content>

<p>

</div>

</p>

<b:include name="quickedit"></b:include>

</b:includable>

</b:widget>

<p>
</b:section-contents>

</p>

