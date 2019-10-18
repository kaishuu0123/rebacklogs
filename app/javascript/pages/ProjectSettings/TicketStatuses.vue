<template>
  <div>
    <div class="row">
      <div class="card w-100">
        <div class="card-body">
          <div class="d-flex mb-3">
            <router-link :to="createNewTicketStatus()" class="btn btn-sm btn-primary">
              {{ $t('action.addStatus') }}
            </router-link>
          </div>
          <table class="table table-sm w-100">
            <thead>
              <tr>
                <th>{{ $t('status.title') }}</th>
                <th>{{ $t('status.sortOrder') }}</th>
                <th>{{ $t('status.isDone') }}</th>
                <th>{{ $t('action.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="status in ticketStatuses" :key="status.id">
                <td>{{status.title}}</td>
                <td>{{status.sort_order}}</td>
                <td>
                  <b-form-checkbox
                    :id="`checkbox-${status.id}`"
                    v-model="status.is_done"
                    :disabled="true"
                  >
                  </b-form-checkbox>
                </td>
                <td>
                  <router-link :to="createEditTicketStatus(status)" class="btn btn-sm btn-link">
                    <i class="fas fa-pen"></i>
                  </router-link>
                  <button type="button" class="btn btn-sm btn-link text-danger" @click="onClickDeleteTicketStatus(status)">
                    <i class="far fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <b-modal
      id="statusModal"
      ref="modal"
      @shown="onShow"
      @hidden="onHide"
      hide-header
      hide-footer
      no-fade
    >
      <b-form ref="form" @submit.stop.prevent="handleSubmit">
        <div class="my-2" v-for="input in inputAttributes" :key="input.attributeName">
          <b-form-group
            :label="$t(`status.${input.attributeName}`)"
            :label-for="`input-${input.attributeName}`">
            <b-form-checkbox v-if="input.attributeName === 'is_done'" size="sm" v-model="status[input.attributeName]"></b-form-checkbox>
            <b-form-input v-else size="sm" v-model="status[input.attributeName]"></b-form-input>
          </b-form-group>
        </div>
        <div class="d-flex justify-content-end">
          <b-button class="mr-1" variant="primary" size="sm" type="submit">{{ $t('action.save') }}</b-button>
          <b-button variant="secondary" size="sm" @click="handleCancel">{{ $t('action.cancel') }}</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  data() {
    return {
      projectId: null,
      status: {
        title: null,
        sort_order: null,
        is_done: null
      },
      inputAttributes: [
        {
          label: 'Title',
          attributeName: 'title',
        },
        {
          label: 'Sort Order',
          attributeName: 'sort_order',
        },
        {
          label: 'Done?',
          type: 'boolean',
          attributeName: 'is_done',
        },
      ]
    }
  },
  mounted() {
    this.projectId = this.$route.meta.projectId

    this.getTicketStatuses(this.projectId)

    if (this.$route.meta.showModal) {
      this.$bvModal.show('statusModal')
    }
  },
  watch: {
    '$route': function(to, from) {
      if (this.$route.meta.showModal) {
        this.$bvModal.show('statusModal')
      }
    }
  },
  computed: {
    ...mapState('TicketStatuses', {
      ticketStatuses: 'ticketStatuses'
    })
  },
  methods: {
    createNewTicketStatus() {
      return { name: 'AddTicketStatus' }
    },
    createEditTicketStatus(status) {
      return { name: 'EditTicketStatus', params: { id: status.id } }
    },
    onClickDeleteTicketStatus(status) {
      this.deleteTicketStatus({
        projectId: this.projectId,
        status: status
      })
    },
    onShow() {
      this.resetForm()
      if (this.$route.name === 'EditTicketStatus') {
        const statusId = this.$route.params.id

        this.getTicketStatus({
          projectId: this.projectId,
          statusId: statusId
        }).then(status => {
          this.status = status
        })
      }

      this.$refs.form[0].focus()
    },
    onHide() {
      this.resetForm()
      this.$router.push({ name: 'TicketStatuses' })
    },
    resetForm() {
      this.status = {
        title: null,
        sort_order: null,
        color: null
      }
    },
    handleSubmit() {
      if (this.$route.name === 'EditTicketStatus') {
        this.status.id = this.$route.params.id

        this.updateTicketStatus({
          projectId: this.projectId,
          status: this.status
        })
      } else {
        this.createTicketStatus({
          projectId: this.projectId,
          status: this.status
        })
      }
      this.$refs.modal.hide()
    },
    handleCancel() {
      this.resetForm()
      this.$refs.modal.hide()
    },
    ...mapActions('TicketStatuses', {
      getTicketStatuses: 'getTicketStatuses',
      getTicketStatus: 'getTicketStatus',
      createTicketStatus: 'createTicketStatus',
      updateTicketStatus: 'updateTicketStatus',
      deleteTicketStatus: 'deleteTicketStatus'
    })
  }
}
</script>

<style>

</style>