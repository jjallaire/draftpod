
import Papa from 'papaparse'

import * as filters from '@/components/core/filters'

import * as set from '@/store/modules/draft/set/'

import * as selectors from '@/store/selectors'

export function handleCardpoolUpload(set_code, file, complete) {
      
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
      const readId = (card) => card['id'] || card['Mvid'];
      const readQuantity = (card) => card['quantity'] || card['Total Qty'];

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

      // extract the fields
      cards = cards.map((card) => {
        let id = set.card_id_filter(set_code, card['id'] || card['Mvid']);
        let quantity = card['quantity'] || card['Total Qty'];
        return {
          id: id,
          quantity: quantity
        }
      });

      // see how many cards are from the current set
      set.cards(set_code).then(set_cards => {

        // alias set name
        let set_name = set.name(set_code);

        // filter out cards that aren't in the set (record number of
        // cards before and after for validation)
        const cardsInSet = set_cards.map((card) => card.id);
        cards = cards.filter((card) => cardsInSet.includes(card.id));
        let total_cards = selectors.countCardpoolCards(cards);

        // establish how many cards we need for this set
        let set_cards_required = 24 * set.pack_cards(set_code);

        // if this leaves us with no cards then that's an error
        if (total_cards === 0) {
          valid = false;
          status.error.push(
            "The CSV you uploaded does not contain cards from " + set_name + "."
          );
        } else if (total_cards < set_cards_required) {
          valid = false;
          status.error.push(
            "The uploaded CSV has only " + total_cards + " cards from " + set_name + 
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
    },
  
    error: function(error) {
      status.error.push("Unexpected error occurred parsing CSV: " +
                        error.message);
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
