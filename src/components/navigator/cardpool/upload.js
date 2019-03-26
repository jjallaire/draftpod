
import Papa from 'papaparse'
import YAML from 'yaml'

import _compact from 'lodash/compact'
import _intersection from 'lodash/intersection'

import * as filters from '@/components/core/filters'

import * as set from '@/store/modules/draft/set/'

import * as selectors from '@/store/selectors'


export function handleCardpoolUpload(set_code, file, complete) {
  let extension = file.name.split('.').pop();
  if (extension === "coll2")
    return handleCardpoolColl2Upload(set_code, file, complete);
  else
    return handleCardpoolCsvUpload(set_code, file, complete);
}

export function handleCardpoolColl2Upload(set_code, file, complete) {

  // if the file is a string then convert it to a Blob
  if (typeof file === 'string' || file instanceof String)
    file = new Blob([file], { type: 'text/plain' });

  let reader = new FileReader();
  reader.onload = function() {
    
    // track status
    let status = uploadStatusEmpty();
    
    // read the yaml
    let text = this.result;
    let doc = null;
    try {
      doc = YAML.parse(text).doc;
    } catch(e) {
      status.error.push("Error parsing collection file: " + e.message);
      complete(null, status);
      return;
    }
   
    // validate the structure
    if (doc.length !== 2 || !doc[0].version || !doc[1].items) {
      status.error.push("Uploaded file was not a valid Decked Builder collection");
      complete(null, status);
      return;
    }

    // read the cards
    let cards = doc[1].items.map(item => {
      return {
        id: set.card_id_filter(set_code, item[0].id),
        quantity: item[1].r
      }
    });

    // complete upload
    completeCardpoolUpload(set_code, cards, false, complete);
  };
  reader.readAsText(file);
}

export function handleCardpoolCsvUpload(set_code, file, complete) {
      
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      
      // track status
      let status = uploadStatusEmpty();

      // track whether the upload is valid
      let valid = true;

      // get the results
      let cards = results.data;

      // functions for reading card fields
      const readId = (card) => card['Mvid'] || card['Card Number'] || card['id'] ;
      const readQuantity = (card) => card['Total Qty'] || card ['Count'] || card['quantity'];

      // validate that we have data
      if (!cards || (cards.length === 0)) {
        valid = false;
        status.error.push(
          "The uploaded CSV file could not be parsed. Are you sure it's a CSV with " +
          "the required id and quantity fields?"
        );
      } else if (!readId(cards[0])) {
        valid = false;
        status.error.push(
          "The uploaded CSV does not have an id field. Please ensure that " +
          "this field is included."
        );
      } else if (!readQuantity(cards[0])) {
        valid = false;
        status.error.push(
          "The uploaded CSV does not have a quantity field. Please ensure that " +
          "this field is included."
        );
      }

      // bail if we don't have valid data to proceed with
      if (!valid) {
        complete(null, status);
        return;
      }

      // check whether this is a deckbox upload. 
      let deckboxKeys = ['Card Number', 'Count', 'Edition'];
      let deckbox = _intersection(deckboxKeys, Object.keys(cards[0])).length === deckboxKeys.length;

      // some special handling for deckbox
      if (deckbox) {
        // filter by edition (need to do this b/c 'Card Number' has no meaning outside of the edition)
        cards = cards.filter(card => set.is_edition(set_code, card.Edition));

        // consoliate counts across variations (e.g. foil, signed, alternate art, etc.)
        let reduced_cards = cards.reduce((reduced, card) => {
          if (reduced[card['Card Number']])
            reduced[card['Card Number']]['Count'] += card['Count'];
          else
            reduced[card['Card Number']] = card;
          return reduced;
        }, {});
        cards = Object.values(reduced_cards);
      }

      // extract the fields
      cards = cards.map((card) => {
        let id = set.card_id_filter(set_code, readId(card));
        let quantity = readQuantity(card);
        return {
          id: id,
          quantity: quantity
        }
      });

      // complete upload
      completeCardpoolUpload(set_code, cards, deckbox, complete);
    },
  
    error: function(error) {
      status.error.push("Unexpected error occurred parsing CSV: " +
                        error.message);
      complete(null, status);
    }
  });     
}


function completeCardpoolUpload(set_code, cards, deckbox, complete) {

   // track status
   let status = uploadStatusEmpty();

   // see how many cards are from the current set
   set.cards(set_code).then(set_cards => {

    // alias set name
    let set_name = set.name(set_code);

    // if it's a deckbox upload then we need to convert Card Number to Mvid
    if (deckbox) {
      // build a hash table by collector number
      let cardsByCollectorNumber = {};
      set_cards.forEach(card => {
        cardsByCollectorNumber[card.collector_number] = card;
      });
      // convert to mvid (filter out cards we don't have in our database, e.g. cards
      // from plainswalker decks)
      cards = _compact(cards.map(card => { 
        let cardInfo = cardsByCollectorNumber[card.id];
        if (cardInfo) {
          return { ...card, id: cardInfo.id } 
        } else {
          return null;
        }
      }));
    }

    // filter out cards that aren't in the set (record number of
    // cards before and after for validation)
    const cardsInSet = set_cards.map((card) => card.id);
    cards = cards.filter((card) => cardsInSet.includes(card.id));
    let total_cards = selectors.countCardpoolCards(cards);

    // establish how many cards we need for a standard 
    // 3-pack draft of this set (we don't bother checking
    // for a 5-pack draft b/c Arena/MTGO drafts will 
    // use a custom cardpoool limited to 4/4/1/1)
    let set_cards_required = 24 * set.pack_cards(set_code);

    // if this leaves us with no cards then that's an error
    let valid = true;
    if (total_cards === 0) {
      valid = false;
      status.error.push(
        "The file you uploaded does not contain cards from " + set_name + "."
      );
    } else if (total_cards < set_cards_required) {
      valid = false;
      status.error.push(
        "The uploaded file has only " + total_cards + " cards from " + set_name + 
        ", which is less than the " + set_cards_required + " cards required for an 8-player draft."
      );
    }
  
    // complete successfully if the file was valid
    if (valid) {
      status.success.push(
        "Upload complete (" + filters.prettyNumber(total_cards) + 
        " " + set_name + " cards imported)"
      );
      complete(cards, status);
    } else {
      complete(null, status);
    }
  });

}

export function uploadStatusEmpty() {
  return {
    success: [],
    warning: [],
    error: []
  }
}
