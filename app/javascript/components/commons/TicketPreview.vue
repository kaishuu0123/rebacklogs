<template>
  <div>
    <h1 class="h4 text-gray-800 mb-3">{{ ticket.title }}</h1>
    <MarkdownText :content="ticket.body" v-if="ticket.body" />
    <div v-else class="d-flex bg-gray-100 align-items-center border rounded">
      <p class="text-xs text-gray-500 p-1 mb-0"> {{ $t('message.noDescription') }}</p>
    </div>
  </div>
</template>

<script>
import MarkdownText from '../MarkdownText'

export default {
  name: 'TicketPreview',
  components: {
    MarkdownText
  },
  props: {
    projectId: String,
    ticket: Object,
    ticketType: String
  }
}
</script>

<style>

</style>