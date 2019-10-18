<template>
  <b-form ref="form" @submit.stop.prevent="handleSubmit">
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
    <div class="d-flex align-items-center">
      <b-form-text><i class="fab fa-markdown"></i> Markdown available</b-form-text>
      <b-button class="ml-auto" variant="primary" size="sm" type="submit">{{ $t('action.submit') }}</b-button>
    </div>
  </b-form>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  props: {
    projectId: String,
    ticket: Object,
    ticketType: String,
    isLoading: Boolean,
    afterSubmit: Function
  },
  mounted() {
    Vue.nextTick(() => {
      // Focus Input
      this.$refs.titleInput.focus()
    })
  },
  methods: {
    updateValue(key, value) {
      this.ticket[key] = value;
      this.$emit('input', this.value)
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