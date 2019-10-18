<template>
  <div>
    <div class="row">
      <div class="card w-100">
        <div class="card-body">
          <div class="d-flex mb-3">
            <router-link :to="createNewTicketCategory()" class="btn btn-sm btn-primary">
              {{ $t('action.addCategory') }}
            </router-link>
          </div>
          <table class="table table-sm w-100">
            <thead>
              <tr>
                <th>{{ $t('category.title') }}</th>
                <th>{{ $t('category.sortOrder') }}</th>
                <th>{{ $t('category.color') }}</th>
                <th>{{ $t('action.actions') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in ticketCategories" :key="category.id">
                <td class="align-middle">{{category.title}}</td>
                <td class="align-middle">{{category.sort_order}}</td>
                <td class="align-middle">
                  <span :style="textColor(category)" class="mr-1"><i class="fas fa-square"></i></span>
                  <span class="text-truncate">{{ category.color }}</span>
                </td>
                <td>
                  <router-link :to="createEditTicketCategory(category)" class="btn btn-sm btn-link">
                    <i class="fas fa-pen"></i>
                  </router-link>
                  <button type="button" class="btn btn-sm btn-link text-danger" @click="onClickDeleteTicketCategory(category)">
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
      id="categoryModal"
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
            :label="$t(`category.${input.attributeName}`)"
            :label-for="`input-${input.attributeName}`">
            <div v-if="input.attributeName === 'color'" class="d-flex align-items-center">
              <span :style="textColor(category)" class="mr-2"><i class="fas fa-square"></i></span>
              <b-form-input size="sm" v-model="category[input.attributeName]"></b-form-input>
            </div>
            <b-form-input v-else size="sm" v-model="category[input.attributeName]"></b-form-input>
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
      category: {
        title: null,
        sort_order: null,
        color: null
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
          label: 'Color',
          attributeName: 'color',
        },
      ]
    }
  },
  mounted() {
    this.projectId = this.$route.meta.projectId

    this.getTicketCategories(this.projectId)

    if (this.$route.meta.showModal) {
      this.$bvModal.show('categoryModal')
    }
  },
  watch: {
    '$route': function(to, from) {
      if (this.$route.meta.showModal) {
        this.$bvModal.show('categoryModal')
      }
    }
  },
  computed: {
    ...mapState('TicketCategories', {
      ticketCategories: 'ticketCategories'
    })
  },
  methods: {
    createNewTicketCategory() {
      return { name: 'AddTicketCategory' }
    },
    createEditTicketCategory(category) {
      return { name: 'EditTicketCategory', params: { id: category.id } }
    },
    onClickDeleteTicketCategory(category) {
      this.deleteTicketCategory({
        projectId: this.projectId,
        category: category
      })
    },
    onShow() {
      this.resetForm()
      if (this.$route.name === 'EditTicketCategory') {
        const categoryId = this.$route.params.id

        this.getTicketCategory({
          projectId: this.projectId,
          categoryId: categoryId
        }).then(category => {
          this.category = category
        })
      }

      this.$refs.form[0].focus()
    },
    onHide() {
      this.resetForm()
      this.$router.push({ name: 'TicketCategories' })
    },
    resetForm() {
      this.category = {
        title: null,
        sort_order: null,
        color: null
      }
    },
    textColor(option) {
      return {
        "color": option.color
      }
    },
    handleSubmit() {
      if (this.$route.name === 'EditTicketCategory') {
        this.category.id = this.$route.params.id

        this.updateTicketCategory({
          projectId: this.projectId,
          category: this.category
        })
      } else {
        this.createTicketCategory({
          projectId: this.projectId,
          category: this.category
        })
      }
      this.$refs.modal.hide()
    },
    handleCancel() {
      this.resetForm()
      this.$refs.modal.hide()
    },
    ...mapActions('TicketCategories', {
      getTicketCategories: 'getTicketCategories',
      getTicketCategory: 'getTicketCategory',
      createTicketCategory: 'createTicketCategory',
      updateTicketCategory: 'updateTicketCategory',
      deleteTicketCategory: 'deleteTicketCategory'
    })
  }
}
</script>

<style>

</style>