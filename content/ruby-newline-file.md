Title: Appending Newline to File Ends with Ruby
Date: 2015-05-13 10:00
Category: FOSS
Tags: Script, Ruby, Windows, Linux
Slug: ruby-newline-file

I recently took over managing some config files from my dev colleagues.
I was extremely annoyed to be reminded that Notepad (Windows' text editor) does 2 major Unix-incompatible things:

1. CRLF [line ending](http://en.wikipedia.org/wiki/Newline) (`\r\n` and not `\n`)
2. No newline at the end of file, which is something of a nicety to help process files (allows you to assume each line ends with `\n`).  
  We can see `vim` complaigining about it:  
  ![](|filename|/images/ruby-newline-file/noeol-vim.png)  
  And `git` too:  
  ![](|filename|/images/ruby-newline-file/noeol-git.png)

Issue 1 is easily solved with `dos2unix`, like this:
```bash
find -not -path '*/.git/*' -type f | xargs dos2unix
```

Issue 2 is a little bit more challenging, and I wrote this ruby oneliner for it:
```ruby
Dir.glob("**/**").select{|f|File.file?(f)}.select{|f|!File.read(f)[/\n$/]}.each{|f|File.open(f,'a'){|h|h<<"\n"}}
```
Works nicely.
