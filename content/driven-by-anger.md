Title: Driven by anger - my modus machinor
Date: 2018-01-01 12:00
Category: Misc
Tags: Ramblings
Slug: driven-by-anger

`modus machinor` - my adjustment of "modus operandi" for "engineering"

I recently noticed that I'm doing engineering work out of anger.  
However, it seems like I'm doing a good job, so I thought I'd share my method, which I worked hard on.  
You might recognize yourself in some of this, but not all. If you have something to say, I'm happy to recieve feedback / insults.  

## TL;DR:
1. Get annoyed by things
1. Write a fix
1. Make sure to publish the fix


## 1. Get annoyed by things
Throughout my time working on comp-u-ters, I've encountered things that annoy me. I can divide them into those common annoyances:

1. The thing is manual, where it should be automated 
1. The thing is missing a feature that would make my life easier
1. The thing takes a long time
1. The thing is erroring out

In all of those cases, my main response to the thing is anger. I'm so spoiled and used to everything working perfectly, that finding a fault in something angers me. How can this be not fixed? Am I the only one that notices something is wrong here?

## 2. Write a fix
All of this anger should not be wasted on getting high blood pressure, abusing your relatives, or strangling small animals. Instead, it's best channeled into **fixing the broken thing**.  
Using your anger to fix the thing that angered you serves multiple purposes:

1. If you encountered said thing during your work, fixing it probably counts as work
1. It fills you with the feeling of victory, a.k.a:
    1. "I have vanquished thee, annoying thing!"
    1. "I fixed the problem those others ignored. At least SOMEONE is capable around here."
    1. "I actually did a thing today"
1. You won't encounter this problem again, reducing the chances of you getting annoyed in future

## 3. Make sure to publish the fix
This is the tricky part. As an egoist, lazy bastard, you probably think you're done by now. **Wrong**.  
Publishing your fix, whether it's by writing a blog post, sending an email on the devlist, or sending a PR (best option), has those benefits:

1. It *looks* as an altruistic act, making you more valued amongst your colleagues 
1. Integrating your fix into the product / community means that more people will use it, meaning there's less chance of it breaking because of someone else making a change in the thing.
  This applies more strongly to a PR that you manage to push upstream, but can also apply if you change the "accepted" way of utilizing the product.
1. You might gain recognition as "the guy that fixed the thing".  
  For instance, in FB, where I'm currently working, you're credited for time/trouble being saved for others by fixing things that you're both using.

## Success anecdotes 
As I've already said, in Facebook, you're credited for helping others, both directly and indirectly.  
One of my proudest moments in the last year is shaving off ~100h per week from a certain process, by moving 3LoC around.  
I did this not because it was my responsibility, but because I was waiting for this process to finish and was annoyed by "what the hell is it doing while I'm sitting here waiting".  

Another issue I had - an internal bot broke down. I found it out by tagging it and getting no response. I asked around and was told that "yeah, it's broken for a while". I was angered by this approach, something like "is no one cleaning up here? I'll do it". So I fixed this bot, and afterwards found out that this bot has hundreds of invocations a month, each and every one of them failing for the last 3 months. More credit for me!  

While I was working at my previous job, I was missing a small feature in Chef. This annoyed me greatly, as Chef was answering all my needs and was obviously designed by clever people. How could they neglect that part?  
Instead of building around this in a hacky way that I'd dare not show to other people, I made a proper fix and submitted it to Chef. Not only was my problem resolved, but I also got a cool "I help make Chef AWESOME" sticker for my laptop.  

## Summary
Other, smarter people might define this approach differently. They might call the steps fancy names like "identify, remediate, notify". But you and I know the truth. Things make us angry. We can't let them win. My approach allows us to fight back, and claim the spoils of war. Most of the time.  

**Small note**: The reason closed-code products suck so hard, is that you can't use the above with them. My biggest issue with working with Microsoft products is being unable to prod into them to find out what exactly is wrong. This *also* made me angry, but sadly there was no easy way to fight back.  
