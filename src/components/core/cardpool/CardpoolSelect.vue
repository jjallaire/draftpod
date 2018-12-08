

<script>

// TODO: number of cards in standard display
// TODO: validate that errors are fired at the right times

// TODO: look and feel of status

// TODO: refactor/cleanup

import { CARDPOOL } from '@/store/constants'
import { SET_CARDPOOL, REMOVE_CARDPOOL } from '@/store/mutations'

import * as set from '@/store/modules/draft/set/'

import { mapGetters, mapMutations } from 'vuex'
import * as filters from '@/components/core/filters'

import * as messagebox from '@/components/core/messagebox.js'

import CardpoolUploadStatus from './CardpoolUploadStatus'

import Papa from 'papaparse'
import DeleteIcon from "vue-material-design-icons/DeleteOutline.vue"
import UploadIcon from "vue-material-design-icons/CloudUpload.vue"

export default {
  name: 'CardpoolSelect',

  props: {
    value: {
      type: String,
      required: true
    },
    set_code: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      inputVal: this.value,
      new_cardpool: {
        name: null,
        cards: [],
        upload_status: this.noUploadStatus()
      },
      custom_cardpool: {
        upload_status: this.noUploadStatus()
      }
    }
  },

  created() {
    this.validateInputVal();
  },

  watch: {
    set_code() {
      this.validateInputVal();
    }
  },

  computed: {
    ...mapGetters([
      'cardpool',
      'cardpools',
    ]),
    cardpool_options() {
      return {
        cubes: [
          {
            value: CARDPOOL.CUBE + '4/4/1/1',
            caption: '4x Common, 4x Uncommon, 1x Rare, 1x Mythic'
          },
          {
            value: CARDPOOL.CUBE + '4/4/2/1',
            caption: '4x Common, 4x Uncommon, 2x Rare, 1x Mythic'
          },
          {
            value: CARDPOOL.CUBE + '3/2/1/1',
            caption: '3x Common, 2x Uncommon, 1x Rare, 1x Mythic'
          },
          {
            value: CARDPOOL.CUBE + '4/4/0/0',
            caption: '4x Common, 4x Uncommon'
          }
        ],
        custom: this.cardpools(this.set_code).map(cardpool => {
          return {
            value: CARDPOOL.CUSTOM + cardpool.name,
            caption: cardpool.name
          };
        })
      }
    },

    is_new_cardpool() {
      return this.inputVal === 'new-cardpool';
    },

    is_custom_cardpool() {
      return this.inputVal.startsWith(CARDPOOL.CUSTOM);
    },

    selected_custom_cardpool() {
      const isInputVal = (option) => option.value === this.inputVal;
      let option = this.cardpool_options.custom.find(isInputVal);
      let name = option.value.replace(CARDPOOL.CUSTOM, '');
      return {
        name: name,
        value: option.value,
        caption: option.caption,
        updated: this.cardpool(this.set_code, name).updated
      }
    }
  },

  methods: {
    ...mapMutations({
      setCardpool: SET_CARDPOOL,
      removeCardpool: REMOVE_CARDPOOL
    }),
    onCardpoolChanged(event) {
      this.inputVal = event.target.value;
      this.clearCardpoolInput();
      if (this.is_new_cardpool) {
        this.focusCardpoolName();
      } else {
        this.$emit('input', this.inputVal);
      }
    },
    onCardpoolUploaded(event) {

      this.new_cardpool.upload_status = this.noUploadStatus();

      const file = event.target.files[0];
      if (!file)
        return;

      this.handleCardpoolUpload(file, (cards, status) => {
        
        // handle cards if we got them
        if (cards) {
          this.new_cardpool.cards = cards;
          if (!this.new_cardpool.name)
            this.focusCardpoolName();
        }

        // update status
        this.new_cardpool.upload_status = status;
        
      });
    },
    onUseCardpool() {
      if (!this.new_cardpool.name)
        messagebox.alert('Please provide a name for the cardpool', this.focusCardpoolName);
      else if (this.new_cardpool.cards.length === 0)
        messagebox.alert('Please upload a CSV for the cardpool');
      else {
        this.setCardpool({
          set_code: this.set_code,
          name: this.new_cardpool.name,
          cards: this.new_cardpool.cards
        });
        this.$nextTick(() => {
          this.inputVal = CARDPOOL.CUSTOM + this.new_cardpool.name;
          this.$emit('input', this.inputVal);
          this.clearNewCardpoolInput();
        });
      }

    
    },

    onRemoveCardpool() {
      let cardpool = this.selected_custom_cardpool;
      messagebox.confirm(
        "Are you sure you want to remove the " + cardpool.caption + " cardpool?",
        () => {
          this.removeCardpool({
            set_code: this.set_code, 
            name: cardpool.name
          }); 
          this.validateInputVal();
        }
      )
    },

    onUpdateCardpool() {
      this.custom_cardpool.upload_status = this.noUploadStatus();
      this.$refs.cardpool_upload_update.click();
    },

    onCardpoolUpdateUploaded(event) {

      const file = event.target.files[0];
      if (!file)
        return;

      this.handleCardpoolUpload(file, (cards, status) => {

        // handle cards if we got them
        if (cards) {
          let cardpool = this.selected_custom_cardpool;
          this.setCardpool({
            set_code: this.set_code,
            name: cardpool.name,
            cards: cards
          });
        }

        // provide status
        this.custom_cardpool.upload_status = status;
      });
    },


    handleCardpoolUpload(file, complete) {
      
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          
          // track status
          let status = this.noUploadStatus();

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
              "The uploaded cardpool file could not be parsed. Are you sure it's a CSV with " +
              "the required id and quantity fields?"
            );
          } else if (!readId(cards[0])) {
            valid = false;
            status.error.push(
              "The uploaded cardpool CSV does not have an id field. Please ensure that " +
              "this field is included."
            );
          } else if (!readQuantity(cards[0])) {
            valid = false;
            status.error.push(
              "The uploaded cardpool CSV does not have a quantity field. Please ensure that " +
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
            let id = card['id'] || card['Mvid'];
            let quantity = card['quantity'] || card['Total Qty'];
            return {
              id: id,
              quantity: quantity
            }
          });

          // see how many cards are from the current set
          set.cards(this.set_code).then(set_cards => {

            // alias set name
            let set_name = set.name(this.set_code);

            // filter out cards that aren't in the set (record number of
            // cards before and after for validation)
            const cardsInSet = set_cards.map((card) => card.id);
            cards = cards.filter((card) => cardsInSet.includes(card.id));
            let total_cards = this.countCards(cards);

            // if this leaves us with no cards then that's an error
            if (total_cards === 0) {
              valid = false;
              status.error.push(
                "The cardpool you uploaded does not have cards from " + set_name + "."
              );
            } else if (total_cards < 360) {
              valid = false;
              status.error.push(
                "The uploaded cardpool has " + total_cards + " cards from " + set_name + 
                ", which is less than the 360 cards required for an 8-player draft."
              );
            }
          
            // complete successfully if the file was valid
            if (valid) {
              status.success.push(
                "Upload complete (" + total_cards + " " + set_name + " cards imported)"
              );
              complete(cards, status);
            } else {
              complete(null, status);
            }
            
              

          });
        },
      
        error: function(error) {
          status.error.push("Unexpected error occurred parsing cardpool CSV: " +
                            error.message);
          complete(null, status);
        }
      });     
    },

    clearCardpoolInput() {
      this.clearNewCardpoolInput();
      this.clearCustomCardpoolInput();
    },

    clearNewCardpoolInput() {
      this.new_cardpool.name = null;
      this.new_cardpool.cards = [];
      this.new_cardpool.upload_status = this.noUploadStatus();
    },

    clearCustomCardpoolInput() {
      this.custom_cardpool.upload_status = this.noUploadStatus();
    },

    noUploadStatus() {
      return {
        success: [],
        warning: [],
        error: []
      }
    },

    countCards(cards) {
      return cards.reduce((total, card) => total + card.quantity, 0);
    },

    focusCardpoolName() {
      this.$nextTick(() => {
        this.$refs.cardpool_name.focus();
      });
    },

    // validate that the inputVal is an available option. if it's not then
    // set it to the first cube
    validateInputVal() {
      if (!this.hasInputVal(this.cardpool_options.cubes) && 
          !this.hasInputVal(this.cardpool_options.custom)) {
       this.inputVal = this.cardpool_options.cubes[0].value;
       this.$emit('input', this.inputVal);
      }
    },

    hasInputVal(options) {
      return options.filter((option) => option.value == this.inputVal).length > 0
    }
  },

  filters: {
    prettyDate: filters.prettyDate
  },

  components: {
    DeleteIcon, UploadIcon, CardpoolUploadStatus
  }
}

</script>

<template>

<div class="form-group row">
  <label for="draft-cardpool" class="col-sm-3 col-form-label">Cardpool:</label>
  <div class="col-sm-8">
    <select id="draft-cardpool" class="form-control" :value="inputVal"
            @change="onCardpoolChanged">
      <optgroup label="Set Cube">
        <option v-for="option in cardpool_options.cubes" :key="option.value"
                :value="option.value">{{ option.caption }}</option>
      </optgroup>
      <optgroup label="Custom">
        <option v-for="option in cardpool_options.custom" :key="option.value"
                :value="option.value">{{ option.caption }}</option>
        <option value="new-cardpool">New Custom Cardpool...</option>
      </optgroup>
    </select>
    <div>
      <div class="custom-cardpool">
        <div class="card-body bg-primary" v-if="is_new_cardpool">
          <div class="form-group">
            <label for="custom-cardpool-name">Cardpool Name:</label>
            <input class="form-control" id="custom-cardpool-name" placeholder="Enter name" 
                   ref="cardpool_name" v-model="new_cardpool.name"/>
          </div>
          <div class="form-group">
            <label for="custom-cardpool-upload">Upload Cardpool CSV:</label>
            <input type="file"  id="custom-cardpool-upload" class="form-control cardpool-upload" 
                   aria-describedby="custom-cardpool-upload-help" 
                   accept="text/csv" @change="onCardpoolUploaded"/>
            <CardpoolUploadStatus :status="new_cardpool.upload_status" />
            <small id="custom-cardpool-upload-help" class="form-text text-muted">
              <p>The cardpool CSV should include <strong>id</strong> (Multiverse ID) 
              and <strong>quantity</strong> (number of each card) fields.
              CSV files exported from <a href="http://www.deckedbuilder.com" target="_blank">Decked Builder</a> 
              collections meet these requirements.</p>
            </small>

            <div class="form-group">
              <button type="button" class="btn btn-warning" @click="onUseCardpool">Use Cardpool</button>
            </div>
          </div>
        </div>
        <div class="cardpool-bar" v-else-if="is_custom_cardpool">
          <div>
            Updated: {{ selected_custom_cardpool.updated | prettyDate }}
            <a class="cardpool-action float-right" @click="onRemoveCardpool"><DeleteIcon title="Remove Cardpool"/><span>Remove</span></a>
            <a class="cardpool-action float-right" @click="onUpdateCardpool"><UploadIcon title="Update Cardpool"/><span>Update...</span></a>
            <input type="file"  id="custom-cardpool-update" ref="cardpool_upload_update"
                  accept="text/csv" @change="onCardpoolUpdateUploaded"/>
          </div>
          <div style="clear: both;"/>
          <CardpoolUploadStatus :status="custom_cardpool.upload_status" />
         </div>
      </div>
    </div>
  </div>
</div>
</template>

<style>

.custom-cardpool {
  padding-top: 10px;
}

.custom-cardpool .card-body {
  padding-top: 15px;
  padding-bottom: 15px;
}

.custom-cardpool .btn {
  margin-top: 10px;
}

.cardpool-bar {
  padding-right: 8px;
}

.cardpool-bar .cardpool-action {
  margin-left: 18px;
  cursor: pointer;
}

.cardpool-bar .cardpool-action:hover {
  color: #e9ecef !important;
}


.cardpool-bar .cardpool-action .material-design-icon {
  margin-right: 3px;
}

.cardpool-bar #custom-cardpool-update {
  display: none;
}

.cardpool-bar .cardpool-action .cloud-upload-icon {
  margin-right: 6px;
}

.cardpool-upload, .cardpool-upload:focus {
  background: transparent;
  border: 0;
  color: #aaa;
}

.form-text.text-muted a {
  color: #cbd3da !important;
  text-decoration: none;
}

.form-text.text-muted a:hover {
  text-decoration: underline;
}


</style>