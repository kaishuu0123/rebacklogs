<template>
  <b-form-group
    id="ticket-point"
    :label="`${$t('ticket.point')}:`"
    label-for="ticket-point-input"
  >
    <b-form-input size="sm"
      @blur="onBlurPoint" @keyup.enter="onEnterPoint"
      type="number" v-model="point" step="0.5"
      class="rb-point-input"
      ref="inputPoint"
    />
  </b-form-group>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'InputPoint',
  props: {
    projectId: String,
    ticket: Object,
    ticketType: String
  },
  data() {
    return {
      point: null
    }
  },
  mounted() {
    this.point = this.ticket.point
  },
  methods: {
    onBlurPoint() {
      this.updateTicketPoint({
        projectId: this.projectId,
        ticketType: this.ticketType,
        ticketId: this.ticket.id,
        point: this.point
      })
    },
    onEnterPoint() {
      this.$nextTick(() => {
        this.$refs.inputPoint.blur()
      })
    },
    ...mapActions('Tickets', {
      updateTicketPoint: 'updateTicketPoint'
    })
  }
}
</script>

<style scoped>
.rb-point-input {
  border: none;
  border-bottom: 1px solid #888;
  background-color: transparent;
}
</style>