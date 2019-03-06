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

The [ChannelFireball](https://www.channelfireball.com/articles/) and [Star City Games](http://www.starcitygames.com/articles/tags/Limited/2018-10-23/2019-01-23) websites also both feature a steady stream of articles on drafting (covering both recent sets as well as overall strategy).

You can also sit on the shoulder of the some of the very best Magic players in the world as they draft by watching streams and/or YouTube videos. You can find lots of streams on [Twitch](https://www.twitch.tv/magic/videos) as well as archives of previous drafts from [Ben Stark](https://www.youtube.com/results?search_query=Channel+BenS), [Reid Duke](https://www.youtube.com/results?search_query=Channel+Reid), [Luis Scott-Vargas](https://www.youtube.com/results?search_query=Channel+LSV), and [Marshall Sutcliffe](https://www.youtube.com/results?search_query=Channel+Marshall) (among others) on the ChannelFireball YouTube channel.

#### Where can I find card ratings and suggested pick orders?

When preparing to draft a specific set, you might want to study the card evaluations of other players in the Magic community. You can find draft-specific ratings and pick orders at the following sites:

- [LSV's Limited Set Reviews](https://www.channelfireball.com/tag/lsvs-set-review/) on ChannelFireball.com provide both numerical ratings and commentary on each card in the set.

- [Draftaholics Anonymous](http://www.draftaholicsanonymous.com/) publishes set pick orders that are derived from presenting users with a choice of 2 cards for a hypothetical P1P1.

- [Magic Community Set Reviews](https://www.mtgcommunityreview.com/) provides an aggregation of full set ratings done by community members.

#### Draftpod is a free service. Will it always be free?

Yes, Draftpod is free and will always remain so. We won't ever show adds, sell or share personal information, or charge a subscription fee of any kind. 

Draftpod was created by a group of software engineers that love to play Magic and even more so love to draft. After trying various forms of 2 and 3 player draft (Winston Draft, etc.) and feeling like they were nowhere even close to "real" drafts, we wanted to find a better way. We built Draftpod as a way of solving the problem of [drafting in small numbers](http://theendgamesblog.com/?p=5138) for ourselves, and hope that the rest of the Magic community also finds it useful. 

#### How do Draftpod bots decide which cards to pick?

The key to making virtual drafts feel as close as possible to real drafts are the draft bots. Creating bots that provide a realistic experience is quite challenging and always a work in progress. The core approach to draft bots taken by Draftpod is as follows:

- Bots evaluate picks using a set of card ratings that range from 0.0 to 5.0 (see below for how these ratings are derived). 

- During the first 2 or 3 picks of Pack 1 bots typically take the highest rated card in the pack.

- Bots then attempt to find color lanes over the remainer of pack 1, giving an escalating bonus to cards that match the colors of the ones in their pile.

- Once a bot has found their color lanes they "lock in" to picking cards from only those colors. Depending on the bot, this occurs late in pack 1 or early in pack 2.

Those are the core mechanics which drive the bots. In addition, some variance is applied to bot behavior so that it is less predictable from draft to draft. Specifically, some bots favor certain colors, some bots are better than others at card evaluation (i.e. how closely their picks track to underlying ratings), and some bots lock into colors sooner than others.

It's important to note that bots don't need to know how to build good decks. Rather, they just need to take cards out of the pool _in aggregate_ in a fashion that approximates what real players do. We're very interested in improving bot behavior to model real drafts as closely as possible, so please [let us know](/guide#contact/) how well it's working for you and how you think it could be improved.

#### How are Draftpod card ratings derived?

When a set is first released, card ratings are derived from the community-based P1P1 pick order lists published by [Draftaholics Anonymous](https://draftaholicsanonymous.com/). Subsequently, we collect data on the picks made during Draftpod drafts, and modify the ratings to reflect this data.

Pick orders are translated into a rating scale for each card from 0 to 5, which makes it possible for bots to apply color bonuses to picks (e.g. +1.0 or +2.0 for on-color cards). Ratings are allocated across the pick order according to the distribution of ratings found in the [LSV set reviews](https://www.channelfireball.com/tag/lsvs-set-review/) published on ChannelFireball.com. 

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





