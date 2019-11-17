<template>
  <b-form-group
  id="assignee-group"
  :label="`${$t('ticket.assignee')}:`"
  label-for="assignee-input"
  >
    <v-select
      class="rb-select"
      @search:focus="onFocusAssignee"
      @input="onInputAssignee"
      :clearable="false"
      :options="assignee.assignees"
      :components="{OpenIndicator}"
      label='username'
      :placeholder="$t('title.unassigned')"
      v-model="assignee.selected"
      value="id"
      ref="vSelect"
    >
      <template slot="selected-option" slot-scope="selected_option">
        <div @click="toggleVSelect">
          <span v-if="selected_option.image" class="mr-1"><img class="rb-select-image rounded" :src="selected_option.image" /></span>
          <span>{{ selected_option.username }}</span>
        </div>
      </template>
      <template slot="option" slot-scope="option">
        <span v-if="option.image" class="mr-2"><img class="rb-select-image rounded" :src="option.image" /></span>
        <span>{{ option.username }}</span>
      </template>
    </v-select>
  </b-form-group>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import vSelect from 'vue-select'

export default {
  name: 'SelectAssignee',
  props: {
    value: Object,
    isNew: Boolean,
    projectId: String,
    ticket: Object,
    ticketType: String
  },
  components: {
    vSelect
  },
  data() {
    return {
      OpenIndicator: {
        render: createElement => createElement('i', {class: 'fas fa-caret-down'})
      }
    }
  },
  computed: {
    ...mapState('Tickets', {
      assignee: 'assignee'
    })
  },
  watch: {
    value: function(value, old) {
      this.assignee.selected = value
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
    onFocusAssignee() {
      this.getAssignees({
        projectId: this.projectId
      })
    },
    onInputAssignee() {
      if (!this.isNew) {
        this.updateAssignee({
          projectId: this.projectId,
          ticketType: this.ticketType,
          ticketId: this.ticket.id
        })
      } else {
        this.$emit('input', this.assignee.selected)
      }
    },
    ...mapActions('Tickets', {
      getAssignees: 'getAssignees',
      updateAssignee: 'updateAssignee',
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

.rb-select-image {
  width: 20px;
  height: 20px;
}

/deep/ .vs__search::placeholder {
  color: #b7b9cc;
}
</style>