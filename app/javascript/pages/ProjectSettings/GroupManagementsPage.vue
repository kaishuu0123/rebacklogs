<template>
  <div class="container mt-2">
    <div class="row">
      <div class="card w-100 mb-4">
        <div class="card-body">
          <p>{{ $t('message.addGroup') }}</p>
          <b-form ref="form" class="w-100" @submit.stop.prevent="handleSubmit" @keydown.enter.prevent.self="">
            <div class="form-group row">
              <label class="col-sm-3 col-form-label">{{ $t('action.selectGroup') }}</label>
              <div class="col-sm-9">
                <v-select
                  @search="onSearchGroups"
                  :clearable="true"
                  v-model="selectedGroup"
                  label='name'
                  :options="matchedGroups"
                  :components="{OpenIndicator}"
                >
                  <template slot="option" slot-scope="option">
                    {{ option.name }}
                  </template>
                </v-select>
              </div>
            </div>
            <div class="d-flex align-items-center">
              <b-button class="ml-auto" variant="primary" size="sm" type="submit">{{ $t('action.addGroup') }}</b-button>
            </div>
          </b-form>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="card w-100">
        <div class="card-header">
          {{ $t('message.groups') }}
        </div>
        <ul class="list-group list-group list-group-flush">
          <li class="list-group-item" v-for="group in groups" :key="group.id">
            <div class="d-flex align-items-center">
              <div class="mr-2">
                <img :src="group.image" width="32" class="rounded" />
              </div>
              <div>
                {{ group.name }}
              </div>
              <div class="ml-auto">
                <a href="#" @click="onClickDelete(group.id)" class="text-danger">
                  <i class="far fa-trash-alt"></i>
                </a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapMutations } from 'vuex';
import vSelect from 'vue-select'
import "vue-select/src/scss/vue-select.scss"

export default {
  components: {
    vSelect
  },
  data() {
    return {
      projectId: null,
      matchedGroups: [],
      selectedGroup: null,
      OpenIndicator: {
        render: createElement => createElement('i', {class: 'fas fa-caret-down'})
      }
    };
  },
  mounted() {
    this.projectId = this.$route.meta.projectId
    this.getGroupsByName('').then(groups => { this.matchedGroups = groups })
  },
  computed: {
    ...mapState('GroupManagements', {
      groups: 'groups'
    })
  },
  methods: {
    onSearchGroups(search, loading) {
      let vm = this

      loading(true)
      this.getGroupsByName(search)
        .then(groups => {
          this.matchedGroups = groups
          loading(false)
        })
    },
    handleSubmit() {
      this.addGroup({
        projectId: this.projectId,
        group: this.selectedGroup
      })
    },
    onClickDelete(groupId) {
      this.deleteGroup({
        projectId: this.projectId,
        groupId: groupId
      })
    },
    ...mapActions('GroupManagements', {
      addGroup: 'addGroup',
      deleteGroup: 'deleteGroup',
      getGroupsByName: 'getGroupsByName'
    })
  }
}
</script>

<style lang="scss" scoped>

</style>