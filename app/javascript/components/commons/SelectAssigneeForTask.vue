<template>
  <v-select
    class="rb-select-assignee"
    @search:focus="onFocusAssignee"
    @input="onInputAssignee"
    :clearable="false"
    :options="assignee.assignees"
    label='username'
    v-model="assignee.selected"
    placeholder='Unassigned'
    value="id"
    ref="vSelect"
    dir="rtl"
    :components="{OpenIndicator}"
  >
    <template slot="selected-option" slot-scope="selected_option">
      <div @click="toggleVSelect" class="text-gray-500 text-xs text-nowrap">
        <span>{{ selected_option.username }}</span>
        <span v-if="selected_option.image" class="mr-1"><img class="rb-select-image rounded" :src="selected_option.image" /></span>
      </div>
    </template>
    <template slot="option" slot-scope="option">
      <span>{{ option.username }}</span>
      <span v-if="option.image" class="mr-2"><img class="rb-select-image rounded" :src="option.image" /></span>
    </template>
  </v-select>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import vSelect from 'vue-select'
import "vue-select/src/scss/vue-select.scss"

export default {
  name: 'SelectAssigneeForTask',
  props: {
    value: Object,
    projectId: String,
    ticket: Object,
    ticketType: String
  },
  components: {
    vSelect
  },
  data() {
    return {
      assignee: {
        selected: null,
        assignees: []
      },
      OpenIndicator: {
        render: () => null
      }
    }
  },
  mounted() {
    this.assignee.selected = this.value
    if (this.assignee == null) {
      this.assignee.selected = {
        id: null,
        username: 'Unassigned'
      }
    }
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
      }).then(result => {
        this.assignee.assignees = result
      })
    },
    onInputAssignee() {
      this.updateAssigneeForTask({
        projectId: this.projectId,
        ticketType: this.ticketType,
        ticketId: this.ticket.id,
        assigneeId: this.assignee.selected.id
      })
    },
    ...mapActions('Tickets', {
      getAssignees: 'getAssignees',
      updateAssigneeForTask: 'updateAssigneeForTask',
    })
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  $vs-border-width: 0px !default;
  $vs-selected-bg: #fff;

  @import "~vue-select/src/scss/vue-select.scss";
}

.rb-select-image {
  width: 20px;
  height: 20px;
}

.rb-select-assignee /deep/ .vs__search::placeholder {
  font-size: .7rem;
  color: #b7b9cc;
}

.rb-select-assignee {
  min-width: 120px;
}

.rb-select-assignee /deep/ .vs__search,.vs__search:focus {
  padding: 0px;
}

</style>