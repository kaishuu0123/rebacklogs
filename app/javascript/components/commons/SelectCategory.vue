<template>
  <b-form-group
    id="ticket-category-group"
    :label="`${$t('ticket.category')}:`"
    label-for="ticket-category-input"
  >
    <v-select
      class="rb-select"
      @search:focus="onFocusProjectTicketCategory"
      @input="onInputProjectTicketCategory"
      :clearable="false"
      :options="projectTicketCategory.categories"
      :components="{OpenIndicator}"
      v-model="projectTicketCategory.selected"
      placeholder="None"
      value="id"
      label="title"
      ref="vSelect"
    >
      <template slot="selected-option" slot-scope="selected_option">
        <div @click="toggleVSelect">
          <span :style="textColor(selected_option)" class="mr-1"><i class="fas fa-square"></i></span>
          <span class="text-truncate">{{ selected_option.title }}</span>
        </div>
      </template>
      <template slot="option" slot-scope="option">
        <div>
          <span :style="textColor(option)" class="mr-1"><i class="fas fa-square"></i></span>
          <span>{{ option.title }}</span>
        </div>
      </template>
    </v-select>
  </b-form-group>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import vSelect from 'vue-select'

export default {
  name: 'SelectCategory',
  props: {
    value: Object,
    isNew: Boolean,
    projectId: String,
    ticket: Object,
    ticketType: String
  },
  data() {
    return {
      OpenIndicator: {
        render: createElement => createElement('i', {class: 'fas fa-caret-down'})
      }
    }
  },
  components: {
    vSelect
  },
  computed: {
    ...mapState('Tickets', {
      projectTicketCategory: 'projectTicketCategory'
    })
  },
  watch: {
    value: function(value, old) {
      this.projectTicketCategory.selected = value
    }
  },
  methods: {
    // XXX: WORKAROUND
    // refs: https://github.com/sagalbot/vue-select/issues/882
    toggleVSelect() {
      if (!this.$refs.vSelect.open) {
        this.$refs.vSelect.open = true;
        this.$refs.vSelect.searchEl.focus();
      }
    },
    textColor(option) {
      return {
        "color": option.color
      }
    },
    onFocusProjectTicketCategory() {
      this.getProjectTicketCategories({
        projectId: this.projectId
      })
    },
    onInputProjectTicketCategory() {
      if (!this.isNew) {
        this.updateProjectTicketCategory({
          projectId: this.projectId,
          ticketType: this.ticketType,
          ticketId: this.ticket.id
        })
      } else {
        this.$emit('input', this.projectTicketCategory.selected)
      }
    },
    ...mapActions('Tickets', {
      getProjectTicketCategories: 'getProjectTicketCategories',
      updateProjectTicketCategory: 'updateProjectTicketCategory',
    })
  }
}
</script>

<style lang="scss" scoped>
$vs-border-width: 0px !default;

/deep/ {
  @import "~vue-select/src/scss/vue-select.scss";
}

.rb-select {
  border-bottom: 1px solid #888
}

/deep/ .vs__search::placeholder {
  color: #b7b9cc;
}
</style>