Title: Extracting SGN files used by the Israeli Court System
Date: 2020-06-21 12:00
Category: FOSS
Tags: Scripts, Linux
Slug: sgn-extractor

# The Story
One of my friends has some dealings with the Israeli courts.  
The noteworthy (and annoying) part of their digital documents is that these documents are using a novel format instead of some industry standard.  
Files arriving by email have the SGN suffix, and the email includes the following footer:
```text
המסמך המצורף חתום דיגיטלית. כדי לצפות בקובץ יש להוריד תוכנה בכתובת :
https://www.court.gov.il/NGCS.Web.Site/DigitalSignature/Court Digital Signature Application.msi
)התוכנה תואמת למערכת הפעלה Windows בלבד(
```
English Google translation:
```text
The attached document is digitally signed. To view the file you need to download software at:
https://www.court.gov.il/NGCS.Web.Site/DigitalSignature/Court Digital Signature Application.msi
) The software is compatible with Windows operating system only (
```

This friend doesn't have Windows, so how can he read those docs?  

## My solution
From taking a peek in the doc, I saw that it's basically a ginormous XML, with fields containing the following:

1. Original filename
1. Content, encoded as base64
1. Signer identity

I was willing to skip verifying the signer, and settled instead for just extracting the original file.  
THe quick solution is:
```bash
xq -r '.DocumentEnvelope.SignaturePackage.Signature.Object.DocumentContent["#text"]' | base64 --decode
```
[xq](https://github.com/mikefarah/yq) is a `jq`-like command for XML. It has a YAML equivalent as well, and was highly useful here.  
`base64` is a bash utility for decoding/encoding base64 data.

I made a nicer version in my [sgn-court-extract repo](https://github.com/BackSlasher/sgn-court-extract). I might migrate it to a proper Python script one day.

Feel free to use it yourself!
