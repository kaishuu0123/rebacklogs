<template>
  <b-form ref="form" @submit.stop.prevent="handleSubmit" @keydown.enter="onEnterKeyDown">
    <b-form-group
      id="title-group"
      label-for="title-input"
    >
      <b-form-input
        id="title-input"
        :placeholder="$t('ticket.title')"
        :value="ticket.title"
        @input="updateValue('title', $event)"
        required
        :disabled="isLoading"
        ref="titleInput"
        size="sm"
      />
    </b-form-group>
    <b-form-group
      id="body-group"
      label-for="body-input"
    >
      <b-form-textarea
        id="body-input"
        :placeholder="$t('message.leaveADescription')"
        :value="ticket.body"
        @input="updateValue('body', $event)"
        :disabled="isLoading"
        rows="6"
        size="sm"
      />
    </b-form-group>
    <b-form-group
      id="tag-group"
      label-for="tag-input"
    >
      <div class="d-flex align-items-center">
        <div class="text-nowrap text-gray-600 mr-2">
          {{ $t('title.tag') }}:
        </div>
        <div class="w-100">
          <TagInput v-model="ticket.tags" :projectId="projectId" />
        </div>
      </div>
    </b-form-group>
    <div class="d-flex align-items-center">
      <b-form-text><i class="fab fa-markdown"></i> Markdown available</b-form-text>
      <b-button class="ml-auto" variant="primary" size="sm" type="submit">
        {{ (() => isNew ? $t('action.create') : $t('action.submit'))() }}
      </b-button>
    </div>
  </b-form>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import TagInput from './TagInput'

export default {
  components: {
    TagInput
  },
  props: {
    projectId: String,
    ticket: Object,
    ticketType: String,
    isLoading: Boolean,
    isNew: Boolean,
    afterSubmit: Function
  },
  data() {
    return {
      initialFocused: false
    };
  },
  mounted() {
    Vue.nextTick(() => {
      // Focus Input
      this.$refs.titleInput.focus()
    })
  },
  watch: {
    isLoading: function(newLoading, oldLoading) {
      // XXX:
      // 一度だけ Title に Focus する
      // この条件がないと、新規作成時に isLoading が変わる度に
      // titleInput に focus があたってしまう
      if (this.initialFocused === false) {
        Vue.nextTick(() => {
          // Focus Input
          this.$refs.titleInput.focus()
          this.initialFocused = true
        })
      }
    }
  },
  methods: {
    updateValue(key, value) {
      this.ticket[key] = value;
      this.$emit('input', this.value)
    },
    onEnterKeyDown(e) {
      if (e.target.className.includes("vs__search")) {
        e.preventDefault();
      }
    },
    handleSubmit(event) {
      if (!this.$refs.form.checkValidity()) {
        this.$refs.form.reportValidity()
        return
      }

      if (this.ticket.id) {
        switch(this.ticketType) {
        case 'stories':
          this.updateStory({
            projectId: this.projectId,
            story: this.ticket
          })
          break;
        case 'tasks':
          this.updateTask({
            projectId: this.projectId,
            task: this.ticket
          })
          break;
        }
      } else {
        switch(this.ticketType) {
        case 'stories':
          this.createStory({
            projectId: this.projectId,
            story: this.ticket
          })
          break;
        case 'tasks':
          this.createTask({
            projectId: this.projectId,
            task: this.ticket
          })
          break;
        }
      }

      Vue.nextTick(() => {
        if (this.afterSubmit) {
          this.afterSubmit()
        }
      })
    },
    ...mapActions('Stories', {
      createStory: 'createStory',
      updateStory: 'updateStory',
    }),
    ...mapActions('Tasks', {
      createTask: 'createTask',
      updateTask: 'updateTask'
    })
  }
}
</script>

<style>
</style>
