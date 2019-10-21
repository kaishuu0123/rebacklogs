<template>
  <div>
    <div v-if="histories && histories.length > 0">
      <div class="card mb-3" v-for="history in histories" :key="history.id">
        <div class="card-body p-3">
          <p class="mb-0">{{ $t('ticket.updatedAt') }}: {{ toMoment(history.changed_at) }}</p>
          <p>{{ $t('ticket.updatedBy') }}: {{ history.changed_by }}</p>

          <div v-for="change in history.changes" :key="change.attribute">
            <div v-if="change.attribute == 'body'">
              <p class="font-weight-bold">{{ $t(`ticket.${change.attribute}`) }}</p>
              <pre class="p-2 mb-0 alert-danger rounded">{{ change.before }}</pre>
              <div class="d-flex w-100 justify-content-center my-3">
                <i class="fas fa-arrow-down"></i>
              </div>
              <pre class="p-2 mb-0 alert-success rounded">{{ change.after }}</pre>
            </div>
            <div v-else>
              <div class="row mb-3">
                <div class="col-3">
                  <span class="font-weight-bold">{{ $t(`ticket.${change.attribute}`) }}</span>
                </div>
                <div class="col-9">
                  <span class="p-2 alert-danger rounded">{{ change.before }}</span>
                  <i class="fas fa-arrow-right mx-1"></i>
                  <span class="p-2 alert-success rounded">{{ change.after }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="w-100 p-2 rounded border bg-gray-100">
        {{ $t('message.historyIsEmpty') }}
      </div>
    </div>
  </div>
</template>

<script>
import CustomMoment from '../../commons/custom-moment'

export default {
  props: {
    histories: Array
  },
  methods: {
    toMoment(datetime) {
      return CustomMoment(datetime).format('LLLL')
    }
  }
}
</script>

<style>

</style>