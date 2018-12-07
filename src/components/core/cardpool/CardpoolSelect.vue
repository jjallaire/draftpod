

<script>

// TODO: refactor/cleanup

// TODO: error/input checking on upload (including validation of cards and feedback)
// TODO: perhaps summarize cube stats

// TODO: consider supporting Decked Builder YAML (.coll2)

import { CARDPOOL } from '@/store/constants'
import { SET_CARDPOOL, REMOVE_CARDPOOL } from '@/store/mutations'
import { mapGetters, mapMutations } from 'vuex'
import * as filters from '@/components/core/filters'

import * as messagebox from '@/components/core/messagebox.js'

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
        name: '',
        cards: []
      }
    }
  },

  created() {
    this.validateInputVal();
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
      if (this.inputVal === 'new-cardpool') {
        this.new_cardpool.name = '';
        this.new_cardpool.cards = [];
        this.focusCardpoolName();
      } else {
        this.$emit('input', this.inputVal);
      }
    },
    onCardpoolUploaded(event) {
      const file = event.target.files[0];
      this.handleCardpoolUpload(file, (cards) => {
        this.new_cardpool.cards = cards;
        this.focusCardpoolName();
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
      this.$refs.cardpool_upload_update.click();
    },

    onCardpoolUpdateUploaded(event) {

      const file = event.target.files[0];
      this.handleCardpoolUpload(file, (cards) => {
        let cardpool = this.selected_custom_cardpool;
        this.setCardpool({
          set_code: this.set_code,
          name: cardpool.name,
          cards: cards
        });
      });
    },


    handleCardpoolUpload(file, complete) {
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          let cards = results.data
            .map((card) => {
              let id = card['id'] || card['Mvid'];
              let quantity = card['quantity'] || card['Total Qty'];
              return {
                id,
                quantity
              }
            });
            complete(cards);
        },
        error: function() {
          // TODO: handle various types of upload errors
        }
      });
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
    DeleteIcon, UploadIcon
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
        <option value="new-cardpool">New Cardpool...</option>
      </optgroup>
    </select>
    <div>
      <div class="custom-cardpool">
        <div class="card-body bg-primary" v-if="inputVal === 'new-cardpool'">
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
            <small id="custom-cardpool-upload-help" class="form-text text-muted">
              <p>Please upload a CSV file that enumerates the cards in your cardpool (note that all 
              cards must be from the set selected above).</p>
              <p>The CSV should include an <em>id</em> field (Multiverse ID) and a <em>quantity</em>
              field indicating how many of each card are in the pool. The most straightforward way 
              to do this is to create a <a href="http://www.deckedbuilder.com" target="_blank">Decked Builder</a> 
              collection and export it as a CSV.</p>
            </small>

            <div class="form-group">
              <button type="button" class="btn btn-warning" @click="onUseCardpool">Use Cardpool</button>
            </div>
          </div>
        </div>
        <div class="cardpool-bar" v-else-if="is_custom_cardpool">
          Updated: {{ selected_custom_cardpool.updated | prettyDate }}
          <a class="cardpool-action float-right" @click="onRemoveCardpool"><DeleteIcon title="Remove Cardpool"/><span>Remove</span></a>
          <a class="cardpool-action float-right" @click="onUpdateCardpool"><UploadIcon title="Update Cardpool"/><span>Update...</span></a>
            <input type="file"  id="custom-cardpool-update" ref="cardpool_upload_update"
                accept="text/csv" @change="onCardpoolUpdateUploaded"/>
         </div>
      </div>
    </div>
  </div>
</div>
</template>

<style>

.custom-cardpool {
  margin-top: 10px;
  margin-bottom: 20px;
}

.custom-cardpool .card-body {
  padding-top: 20px;
  padding-bottom: 20px;
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