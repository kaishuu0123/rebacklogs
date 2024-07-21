<template>
  <b-form-group
    id="ticket-status-group"
    :label="`${$t('ticket.status')}:`"
    label-for="ticket-status-input"
  >
    <v-select
      class="rb-select"
      @search:focus="onFocusProjectTicketStatus"
      @input="onInputProjectTicketStatus"
      :clearable="false"
      :options="projectTicketStatus.statuses"
      :components="{OpenIndicator}"
      label='title'
      v-model="projectTicketStatus.selected"
      value="id"
    >
      <template slot="selected-option" slot-scope="selected_option">
        {{ selected_option.title }}
      </template>
      <template slot="option" slot-scope="option">
        {{ option.title }}
      </template>
    </v-select>
  </b-form-group>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import vSelect from 'vue-select'

export default {
  name: 'SelectStatus',
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
      projectTicketStatus: 'projectTicketStatus'
    })
  },
  watch: {
    value: function(value, old) {
      this.projectTicketStatus.selected = value
    }
  },
  methods: {
    onFocusProjectTicketStatus() {
      this.getProjectTicketStatuses({
        projectId: this.projectId
      })
    },
    onInputProjectTicketStatus() {
      if (!this.isNew) {
        this.updateProjectTicketStatus({
          projectId: this.projectId,
          ticketType: this.ticketType,
          ticketId: this.ticket.id
        })
      } else {
        this.$emit('input', this.projectTicketStatus.selected)
      }
    },
    ...mapActions('Tickets', {
      getProjectTicketStatuses: 'getProjectTicketStatuses',
      updateProjectTicketStatus: 'updateProjectTicketStatus',
    })
  }
}
</script>

<style lang="scss" scoped>
$vs-border-width: 0px !default;

::v-deep {
  @import "~vue-select/src/scss/vue-select.scss";
}

.rb-select {
  border-bottom: 1px solid #888
}

::v-deep .vs__search::placeholder {
  color: #b7b9cc;
}
</style>