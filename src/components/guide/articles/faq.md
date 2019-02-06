## Frequently Asked Questions


#### How can I practice drafting on my own?

While Draftpod single-player mode enables you to practice draft decision making, there is no substitute for playing real matches to learn firsthand how the cards play and interact. If you don't have a friend or group to draft with, the best way to practice on your own is [Magic Arena](https://magic.wizards.com/en/mtgarena), which offers a fantastic solo-drafting experience (you draft against bots and then play games against real opponents online).

Magic Arena also offers a [ranking system](https://magic.wizards.com/en/articles/archive/december-state-beta-rank-10-breakdown-2018-12-12) that enables you to track your improvement as a drafter over time, as well increase the quality of your opponents as your skills progress.

#### What are some good resources for learning how to draft?

If you are entirely new to drafting, Reid Duke has a set of articles introducing booster draft as well as covering intermediate and advanced drafting techniques:

* [The Basics of Booster Draft](https://magic.wizards.com/en/articles/archive/level-one/basics-booster-draft-2015-08-03)
* [Signals in Booster Draft](https://magic.wizards.com/en/articles/archive/level-one/signals-booster-draft-2015-01-19)
* [Booster Draft, Part 3](https://magic.wizards.com/en/articles/archive/level-one/booster-draft-part-3-2015-02-02)

After you've mastered the basics, one of the best resources for improving your skills is the [Limited Resources](http://lrcast.com/) podcast hosted by Marshall Sutcliffe and Luis Scott-Vargas. Another excellent podcast dedicated exclusively to limited play is [Lords of Limited](https://lordsoflimited.libsyn.com/). 

The [Channel Fireball](https://www.channelfireball.com/articles/) and [Star City Games](http://www.starcitygames.com/articles/tags/Limited/2018-10-23/2019-01-23) websites also both feature a steady stream of articles on drafting (covering both recent sets as well as overall strategy).

You can also sit on the shoulder of the some of the very best Magic players in the world as they draft by watching streams and/or YouTube videos. You can find lots of streams on [Twitch](https://www.twitch.tv/magic/videos) as well as archives of previous drafts from [Ben Stark](https://www.youtube.com/results?search_query=Channel+BenS), [Reid Duke](https://www.youtube.com/results?search_query=Channel+Reid), [Luis Scott Vargas](https://www.youtube.com/results?search_query=Channel+LSV), and [Marshall Sutcliffe](https://www.youtube.com/results?search_query=Channel+Marshall) (among others) on the Channel Fireball YouTube channel.

#### How are Draftpod card ratings derived?

The card ratings used by Draftpod are based on the P1P1 community evaluations available at [https://draftaholicsanonymous.com/](https://draftaholicsanonymous.com/). 

The site publishes a list of cards for each set in order of community preference (e.g. here's the ordering for [Ravnica Allegiance](https://www.draftaholicsanonymous.com/p1p1-ravnica-allegiance/)).

For the purposes of drafting, this pick order is then translated into a rating scale for each card from 0 to 5. This is done by applying the distribution of ratings for recent sets provided by Luis Scott Vargas on [Channel Fireball](https://www.channelfireball.com/articles/ravnica-allegiance-limited-set-review-white/) to the pick order:

<p>
<img src="/images/guide/ratings-distribution.png" width="100%" />
</p>

So the first one or two cards in the pick order will have a rating of 5.0, the next several a rating of 4.5, and so on until the last few cards in the set receive a rating of 0. 

Applying the LSV distribution to pick orders enables us to derive ratings for any set for which an ordering is available (as opposed to only the sets that LSV has already rated). It also allow us to track the drafting "meta" as the community evaluation of cards changes over the course of a set release.

#### How do Draftpod bots decide which cards to pick?

The key to making virtual drafts feel as close as possible to real drafts are the draft bots. Creating bots that provide a realistic experience is quite challenging and always a work in progress. The core approach to draft bots taken by Draftpod is as follows:

- Bots use a baseline set of pick ratings derived from the P1P1 community evaluations available at [https://draftaholicsanonymous.com/](https://draftaholicsanonymous.com/).

- Bots attempt to find color lanes over the first pack of the draft, giving a bonus to cards that match the colors of the ones in their pile.

- Once a bot has found their color lanes they "lock in" to picking cards from only those colors. Depending on the bot, this occurs late in pack 1 or early in pack 2.

Those are the core mechanics which drive the bots. In addition, some variance is applied to bot behavior so that it is less predictable from draft to draft. Specifically, some bots favor certain colors, some bots are better than others are card evaluation (i.e. how closely their picks track to underlying ratings), and some bots lock into colors sooner than others.

It's important to note that bots don't need to know how to build good decks. Rather, they just need to take cards out of the pool _in aggregate_ in a fashion that approximates what real players do. We're very interested in improving bot behavior to model real drafts as closely as possible, so please [let us know](https://forum.draftpod.io/) how well it's working for you and how you think it could be improved.

#### Who created Draftpod? What are the goals of the project?

Draftpod was created by [J.J. Allaire](https://github.com/jjallaire), a software engineer that loves to play Magic and even more-so loves to draft. After trying various forms of 2 or 3 player draft (Winston Draft, Half-Pack Draft, etc.) and feeling like they were nowhere even close to "real" drafts, he wanted to find a better way. 

The goal of Draftpod is to provide a compelling solution to the problem of [drafting in small numbers](http://theendgamesblog.com/?p=5138). We hope the Magic community finds the site useful, and that it enables lots of players to draft more and draft better.  

Draftpod is a free service and will always remain so. We won't ever show adds, sell or share personal information, or charge a subscription fee of any kind. 


#### Where are my previous drafts stored?

Your last several drafts are saved by Draftpod within your web browser's local storage. You can review and return to these recent drafts so long as you are using the same browser (if you switch to another browser you won't see the drafts created within the first browser).

If you want to keep a more permanent record of your drafts, you can download draft logs and deck lists using the **Download** button within the deck builder:

<p>
<img src="/images/guide/download-deck.png" width="100%" />
</p>

The download includes 2 files:

- **Draftlog.txt** &mdash; A log of every pick made in the draft
- **Decklist.txt** &mdash; List of main deck and sideboard cards
         
These files can in turn be uploaded to these websites, both of which allow you to view a pick-by-pick replay of your draft:

  - <https://magic.flooey.org/draft/upload>
  - <http://draftsignals.com/>





