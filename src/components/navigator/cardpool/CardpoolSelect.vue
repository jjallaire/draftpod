<script>

import { CARDPOOL } from '@/store/constants'
import { SET_CARDPOOL, REMOVE_CARDPOOL } from '@/store/mutations'

import { mapGetters, mapMutations } from 'vuex'
import * as utils from '@/components/core/utils'
import * as filters from '@/components/core/filters'
import * as selectors from '@/store/selectors.js'

import { handleCardpoolUpload, uploadStatusEmpty } from './upload'

import * as messagebox from '@/components/core/messagebox.js'

import CardpoolUploadStatus from './CardpoolUploadStatus'

import DeleteIcon from "vue-material-design-icons/DeleteOutline.vue"
import UploadIcon from "vue-material-design-icons/CloudUpload.vue"

export default {
  name: 'CardpoolSelect',

  props: {
    value: {
      type: String,
      required: true
    },
    disabled: {
      type: Boolean,
      required: true
    },
    options: {
      type: Object,
      required: true
    },
    set_code: {
      type: String,
      required: true
    }
  },

  data: function() {
    return {
      new_cardpool: {
        name: null,
        cards: [],
        upload_status: uploadStatusEmpty()
      },
      custom_cardpool: {
        upload_status: uploadStatusEmpty()
      }
    }
  },

  watch: {
    set_code() {
      this.clearCardpoolInput();
    },
    value(newValue, oldValue) {
      if (this.is_new_cardpool) {
        this.focusCardpoolName();
        utils.scrollIntoView(this.$refs.selectCardpool);
      } else if (oldValue === 'new-cardpool') {
        this.$emit('newCardpoolComplete')
      }
    }
  },

  computed: {
    ...mapGetters([
      'cardpool',
    ]),
  
    is_new_cardpool() {
      return this.value === 'new-cardpool';
    },

    selected_custom_cardpool() {
      const isInputVal = (option) => option.value === this.value;
      let option = this.options.custom.find(isInputVal);
      if (option) {
        let name = option.value.replace(CARDPOOL.CUSTOM, '');
        return {
          name: name,
          value: option.value,
          caption: option.caption,
          updated: this.cardpool(this.set_code, name).updated
        }
      } else {
        return null;
      }
    },

    selected_custom_cardpool_card_count() {
      if (this.selected_custom_cardpool) {
        let name = this.selected_custom_cardpool.name;
        let cardpool = this.cardpool(this.set_code, name);
        return selectors.countCardpoolCards(cardpool.cards);
      } else {
        return 0;
      }
    }
  },

  methods: {

    ...mapMutations({
      setCardpool: SET_CARDPOOL,
      removeCardpool: REMOVE_CARDPOOL
    }),

    onChangeCardpool(event) {
      this.clearCardpoolInput();
      this.$emit('input', event.target.value);
    },

    onUploadCardpool(event) {

      // clear status ui
      this.new_cardpool.upload_status = uploadStatusEmpty();

      // check for file input (null on cancel)
      const file = event.target.files[0];
      if (!file)
        return;

      // handle upload
      handleCardpoolUpload(this.set_code, file, (cards, status) => {
        
        // handle cards if we got them
        if (cards) {
          this.new_cardpool.cards = cards;
          if (!this.new_cardpool.name)
            this.focusCardpoolName();
        
        // otherwise clear the input
        } else {
          event.target.value = "";
        }    

        // update status
        this.new_cardpool.upload_status = status;
        
      });
    },

    onUseCardpool() {
      // validate inputs
      if (!this.new_cardpool.name)
        messagebox.alert('Please provide a name for the cardpool', this.focusCardpoolName);
      else if (this.new_cardpool.cards.length === 0)
        messagebox.alert('Please upload a CSV for the cardpool');
      else {
        // save the cardpool
        this.setCardpool({
          set_code: this.set_code,
          name: this.new_cardpool.name,
          cards: this.new_cardpool.cards
        });
        // notify parent listener of the selection
        this.$nextTick(() => {
          this.$emit('input', CARDPOOL.CUSTOM + this.new_cardpool.name);
          this.clearNewCardpoolInput();
        });
      }
    },

    onRemoveCardpool() {
      this.clearCustomCardpoolUploadStatus();
      let cardpool = this.selected_custom_cardpool;
      messagebox.confirm(
        "Are you sure you want to remove the " + cardpool.caption + " cardpool?",
        () => {
          this.removeCardpool({
            set_code: this.set_code, 
            name: cardpool.name
          }); 
          this.$emit('input', this.options.cubes[0].value);
        }
      )
    },

    onUpdateCardpoolClicked() {
      this.clearCustomCardpoolUploadStatus();
      this.$refs.cardpool_upload_update.click();
    },

    onUpdateCardpoolUpload(event) {

      const file = event.target.files[0];
      if (!file)
        return;

      handleCardpoolUpload(this.set_code, file, (cards, status) => {

        // handle cards if we got them
        if (cards) {
          let cardpool = this.selected_custom_cardpool;
          this.setCardpool({
            set_code: this.set_code,
            name: cardpool.name,
            cards: cards
          });
        }

        // clear input
        event.target.value = "";

        // provide status
        this.custom_cardpool.upload_status = status;
      });
    },

    clearCardpoolInput() {
      this.clearNewCardpoolInput();
      this.clearCustomCardpoolInput();
    },

    clearNewCardpoolInput() {
      this.new_cardpool.name = null;
      this.new_cardpool.cards = [];
      this.new_cardpool.upload_status = uploadStatusEmpty();
    },

    clearCustomCardpoolInput() {
      this.clearCustomCardpoolUploadStatus();
    },

    clearCustomCardpoolUploadStatus() {
      this.custom_cardpool.upload_status = uploadStatusEmpty();
    },

    focusCardpoolName() {
      this.$nextTick(() => {
        this.$refs.cardpool_name.focus();
      });
    },

   
  },

  filters: {
    prettyDate: filters.prettyDate,
    prettyNumber: filters.prettyNumber
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
    <select :disabled="disabled" id="draft-cardpool" class="form-control" :value="value"
            @change="onChangeCardpool" ref="selectCardpool">
      <optgroup label="Set Cube">
        <option v-for="option in options.cubes" :key="option.value"
                :value="option.value">{{ option.caption }}</option>
      </optgroup>
      <optgroup label="Custom">
        <option v-for="option in options.custom" :key="option.value"
                :value="option.value">{{ option.caption }}</option>
        <option value="new-cardpool">New Custom Cardpool...</option>
      </optgroup>
    </select>
    <div>
      <div class="custom-cardpool">
        <div class="cardpool-new navigator-inline-panel card-body bg-primary" v-if="is_new_cardpool">
          <div class="form-group">
            <label for="custom-cardpool-name">Cardpool Name:</label>
            <input class="form-control" id="custom-cardpool-name" placeholder="Enter name" 
                   ref="cardpool_name" v-model="new_cardpool.name"/>
          </div>
          <div class="form-group">
            <label for="custom-cardpool-upload">Upload Cardpool CSV:</label>
            <input type="file"  id="custom-cardpool-upload" class="form-control cardpool-upload" 
                   aria-describedby="custom-cardpool-upload-help" 
                   accept="text/csv" @change="onUploadCardpool"/>
            <CardpoolUploadStatus :status="new_cardpool.upload_status" />
            <small id="custom-cardpool-upload-help" class="form-text text-muted">
              <p>The cardpool CSV should include <strong>id</strong> 
              and <strong>quantity</strong> fields (Multiverse ID and number of each card).
              CSVs exported from <a href="http://www.deckedbuilder.com" target="_blank">Decked Builder</a> 
              collections meet these requirements.</p>
            </small>

            <div class="form-group">
              <button type="button" class="btn btn-warning" @click="onUseCardpool">Use Cardpool</button>
            </div>
          </div>
        </div>
        <div class="cardpool-bar" v-else-if="selected_custom_cardpool">
          <span class="cardpool-card-count">
              {{ selected_custom_cardpool_card_count | prettyNumber }} cards
          </span>
            {{ selected_custom_cardpool.updated | prettyDate }}
          <a class="cardpool-action float-right" @click="onRemoveCardpool"><DeleteIcon title="Remove Cardpool"/><span>Remove</span></a>
          <a class="cardpool-action float-right" @click="onUpdateCardpoolClicked"><UploadIcon title="Update Cardpool"/><span>Update...</span></a>
          <input type="file"  id="custom-cardpool-update" ref="cardpool_upload_update"
                accept="text/csv" @change="onUpdateCardpoolUpload"/>
        </div>
        <div style="clear: both;"></div>
        <CardpoolUploadStatus :status="custom_cardpool.upload_status" />
      </div>
    </div>
  </div>
</div>
</template>

<style>

.custom-cardpool .btn {
  margin-top: 10px;
}

.cardpool-bar {
  padding-right: 8px;
  vertical-align: middle;
}

.cardpool-bar .cardpool-card-count {
  padding-right: 20px;
}

.cardpool-bar .cardpool-action {
  margin-top: -2px;
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