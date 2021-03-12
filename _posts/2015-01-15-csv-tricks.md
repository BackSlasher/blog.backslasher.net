---
title: CSV Tricks
categories:
- FOSS
tags:
  - Linux
  - Ruby
  - CSV
  - Spreadsheets
  - Office
  - LibreOffice
---

## The Story
I've been requested to recreate some spreadsheet for our execs. Being annoying as usual, I made it a point to only use scripting to build the tables.  
Most of the reconstruction is interesting in an unrelated way, but I wanted to post about some little gimmicks that helped me create the spreadsheet-like part using plain-old CSV.
I used Ruby as my CSV generator, which I then imported by LibreOffice's Calc for some formatting touch-ups (bold titles etc.) and then to Google Docs.

## Formulas survive
I see no reason why they shouldn't, but it still surprised me - when generating CSV files, you can keep cells with formulas (e.g. `=1+1`) and they will be honored by LibreOffice's Calc. This allowed me to preserve the spreadsheet's formulated structure (e.g. calculated averages) while generating basic CSV, using Ruby's `CSV` module.

## R1C1 Notation
This is a way to represent cell addresses differently than the default `A1` notation.  
In `A1`, every cell gets a column index in letters (`A,B,C..ZZZZZZZ`) and a row index in numbers (`1,2,3...9999`). The first cell is `A1`.  
In `R1C1` notation, every cell is getting a numeral row index (`R1,R2..R9999`) and column index (`C1,C2..C9999`) joined together.  
While `R1C1` seems more cumbersome, it allows relative addressing, such as `RC[-1]` (Cell to my left), `R3C` (Third cell from the top in my column) and `R[1]C[1]` (Cell immediately below and right to me). This allows you to address other cells without calculating their/your location, which is easy when using GUI, hard when pushing lines into a file.  
This notation isn't honored by default (my guess is because it can conflict with `A1` notation), but you can either:

* Change your application's settings to work with `R1C1` (Which I don't like, since it's a global setting and will probably break other spreadsheets)
* Use the `INDIRECT` function ([LibreOffice documentation](https://help.libreoffice.org/Calc/Spreadsheet_Functions#INDIRECT)) to address a cell, like `=INDIRECT("RC[-1]",0)` for the cell to the immediate left. This function is also implemented in Google Docs.

Since you're scripting anyway, you're probably better off using the second option.


Should I encounter any other neat CSV discoveries, I'll update this post.

## Credits
* R1C1 in [stackoverflow](http://stackoverflow.com/questions/507253/excel-formula-to-reference-cell-to-the-left)
