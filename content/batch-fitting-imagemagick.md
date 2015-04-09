Title: Batch fitting pictures in ImageMagick
Date: 2015-04-09 12:00
Category: FOSS
Tags: ImageMagick, images, bash, scripts
Slug: batch-fitting-imagemagick

I recently bought a digital frame for some of my more elderly relatives.  
The frame's firmware was quite retarded, and I had 2 issues with it:


### 1. Pictures were always displayed in order
This might be a "not a bug but a feature" type of situation, but still.  
I solved this using bash's `$RANDOM`, which evaluates to a different random number every time:
```bash
rename 's/\.jpg$/.jpg/i' *.* # Just makes it look nice
for F in *.jpg; do mv "$F" ${RANDOM}.jpg; done
```
I couldn't use `xargs` rather than the for loop, because I needed to evaluate the variable for every file
### 2. Pictures were stretched to the frame's proportions
Assuming I treated my relatives with the following apple pictures:  
![](|filename|/images/batch-fitting-imagemagick/old1.jpg)
![](|filename|/images/batch-fitting-imagemagick/old2.jpg)
![](|filename|/images/batch-fitting-imagemagick/old3.jpg)  
The frame would show them like this:  
![](|filename|/images/batch-fitting-imagemagick/smear1.jpg)
![](|filename|/images/batch-fitting-imagemagick/smear2.jpg)
![](|filename|/images/batch-fitting-imagemagick/smear3.jpg)  

Obviously, there was no setting in the software to stop doing that, so I had to modify the pictures themselves.
I settled for resizing the pictures (without modifying the aspect ratio) to a certain resolution (the frame's screen's resolution), and padding it if it's not the right size (for instance, the picture is too short / too wide).  
I modified the pictures to look like this:  
![](|filename|/images/batch-fitting-imagemagick/pan1.jpg)
![](|filename|/images/batch-fitting-imagemagick/pan2.jpg)
![](|filename|/images/batch-fitting-imagemagick/pan3.jpg)  

**The script** uses ImageMagick, which is apparently built for these things (I initially considered using gimp).
```bash
RES=2048x1536
BG=black
ls *.jpg | xargs -n1 mogrify -gravity center -background $BG -resize $RES -extent $RES
```
Note I'm using `mogrify`, which performes in-place updates of the file. To create a different modified file, use `convert` and specify a new filename at the end.  
Note<sup>2</sup> `resize` does the actual image resizing (while keeping aspect ratio, unless [specified otherwise](http://www.imagemagick.org/Usage/resize/#resize)), and `extent` fills in the missing sides with the background.

### attribution
Delicious apples taken from:

* [http://blic-domain-images-pictures/apple-pictures/ripe-apple-on-branch.jpg.html](http://blic-domain-images-pictures/apple-pictures/ripe-apple-on-branch.jpg.html)
* [http://pixabay.com/en/apples-fresh-green-red-health-455396/](http://pixabay.com/en/apples-fresh-green-red-health-455396/)
* [http://apple--art.deviantart.com/](http://apple--art.deviantart.com/)
