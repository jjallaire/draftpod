import * as set from './set'
import * as selectors from './selectors'
import * as serializer from './serializer'

import _remove from 'lodash/remove'
import shortUuid from 'short-uuid'

export function generate(player_id, draft) {

  // draft log
  let botIdx = 1;
  let playerIdx = 1;
  let log = {
    id: draft.id,
    time: draft.table.start_time,
    players: draft.table.players.map(player => {
      if (player.id === player_id) {
        playerIdx++;
        return "Me";
      } else if (player.name)
        return "Player"  + playerIdx++;
      else 
        return "Bot" + botIdx++;
    }),
    packs: [...Array(3)].map(function() {
      return {
        set: draft.set.code.toUpperCase(),
        picks: []
      };
    })
  };

  // replay the draft using the saved packs and pick orders
  let all_packs = JSON.parse(JSON.stringify(draft.packs)).map(pack => {
    return pack.split(',').map(parseFloat);
  });
  let players = draft.table.players.map(player => {
    return {
      pick_order: player.picks.pick_order,
      picks: []
    }
  });

  // get a reference to the player
  let player_index = selectors.playerIndex(player_id, draft.table);
  
  // for each pack
  for (let pack_index=0; pack_index<3; pack_index++) {

    // get the next set of 8 packs and distribute it
    for (let i = 0; i < players.length; i++)
      players[i].pack = all_packs.shift();

    // cycle through the ~ 15 cards in the pack
    let pack_cards = set.pack_cards(draft.set.code, draft.options.number_of_packs);
    for (let i = 0; i<pack_cards; i++) {

      // have all the players make their next pick
      for (let p = 0; p<players.length; p++) {

        // determine the pick
        let player = players[p];
        let pick_index = (pack_index * pack_cards) + i;
        let pick = player.pick_order[pick_index];

        // record for the player_index we are building a log for
        if (p === player_index) {
          let player_pick = {
            pack: JSON.parse(JSON.stringify(player.pack)),
            pick: pick
          };
          log.packs[pack_index].picks.push(player_pick);
        }

        // remove the pick from the pack
        _remove(player.pack, card => card === pick);
      }

      // pass the packs
      let next_packs = [...Array(players.length)];
      for (let p = 0; p<players.length; p++) {
        let next_index = selectors.nextPlayerIndex(p, players.length, pack_index + 1);
        next_packs[next_index] = JSON.parse(JSON.stringify(players[p].pack));
      }
      for (let p = 0; p<players.length; p++) {
        players[p].pack = next_packs[p];
      }

    }

  }
  
  return log;
}

export function asMtgoLog(log) {

  // setup set downloads
  let sets = {};
  let setDownloads = [];
  log.packs.forEach(pack => {
    if (!sets[pack.set]) {
      setDownloads.push(set.cards(pack.set.toLowerCase()).then(set_cards => {
        sets[pack.set] = serializer.idsToCards(set_cards);
      }));
    }
  });

  // perform set downloads then build log
  let lines = [];
  return Promise.all(setDownloads).then(() => {

    // preamble
    lines.push("Event #: " + shortUuid().new());
    lines.push("Time:    " + new Date(log.time).toLocaleDateString('en-US'));
    lines.push("Players:");
    log.players.forEach(player => {
      let indent = player === "Me" ? "--> " : "    ";
      lines.push(indent + player);
    });
    lines.push("");

    // packs
    for (let i = 0; i<log.packs.length; i++) {
      
      let pack = log.packs[i];

      let idsToCards = sets[pack.set];

      lines.push("------ " + pack.set + " ------ ");
      lines.push("");

      for (let j = 0; j < pack.picks.length; j++) {
        lines.push("Pack " + (i+1) + " pick " + (j+1) + ":");
        let pick = pack.picks[j];
        let pack_cards = idsToCards(pick.pack);

        for (let k = 0; k<pack_cards.length; k++) {
          let pack_card = pack_cards[k];
          let indent = pick.pick === pack_card.id ? "--> " : "    ";
          lines.push(indent + pack_card.name);
        }

        lines.push("");
      }

      
    }
    

    return lines.join("\n");
  });


  

}

