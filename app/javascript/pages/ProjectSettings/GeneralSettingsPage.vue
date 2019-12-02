<template>
  <div>
    <div class="card">
      <div class="card-body">
        <div>
          <div class="mb-3">
            <b-form class="w-100" @submit.stop.prevent="handleSubmit">
              <b-form-group
                id="project-title"
                :label="$t('settings.general.title')">
                <b-form-input
                  v-model="project.title"
                  required
                  />
              </b-form-group>
              <b-form-group
                id="project-body"
                :label="$t('settings.general.description')">
                <b-form-textarea
                  id="textarea"
                  v-model="project.body"
                  rows="6"
                  :placeholder="$t('message.leaveADescription')"
                ></b-form-textarea>
              </b-form-group>
              <b-form-group
                id="project-ticket-prefix"
                :label="$t('settings.general.ticketPrefix')">
                <b-form-input
                  v-model="project.ticket_prefix"
                  required
                  />
              </b-form-group>
              <b-form-group>
                <b-form-checkbox
                  v-model="project.is_public"
                  required
                >
                  {{ $t('settings.general.isPublic') }}
                </b-form-checkbox>
              </b-form-group>

              <b-button type="submit" variant="primary" class="btn-sm">{{ $t('action.save') }}</b-button>
            </b-form>
          </div>
          <div class="conainer-fluid">
            <div class="row">
              <div class="col-3">
                <p class="mb-1">
                  {{ $t('settings.general.currentImage') }}
                </p>
                <div class="mb-4">
                  <img :src="project.image" width="90" class="rounded" />
                </div>
              </div>
              <div class="col-6">
                <b-form @submit.stop.prevent="onUploadImage">
                  <b-form-group :label="`${ $t('settings.general.projectImage') }:`">
                    <b-form-file
                      v-model="file"
                      :state="Boolean(file)"
                      :placeholder="$t('message.chooseAFile')"
                      drop-placeholder="Drop file here..."
                      :browseText="$t('action.browse')"
                    ></b-form-file>
                  </b-form-group>

                  <div class="d-flex">
                    <b-button type="submit" variant="primary" class="btn-sm mr-2">{{ $t('action.upload') }}</b-button>
                    <div v-if="project.is_image_attached">
                      <button type="button" class="btn btn-sm btn-danger" @click="onDeleteImage">{{ $t('action.delete') }}</button>
                    </div>
                  </div>
                </b-form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState } from 'vuex'
import { FormPlugin } from 'bootstrap-vue'
Vue.use(FormPlugin)

export default {
  data() {
    return {
      projectId: null,
      project: {
        title: null,
        body: null
      },
      file: null
    }
  },
  watch: {
    'stateProject': function (project, oldProject) {
      this.project = project
    }
  },
  mounted() {
    this.projectId = this.$route.meta.projectId

    this.getProject(this.projectId)
  },
  computed: {
    ...mapState('Generals', {
      stateProject: 'project'
    })
  },
  methods: {
    handleSubmit() {
      this.updateProject({
        projectId: this.projectId,
        project: this.project
      })
      .then(result => {
        this.$bvToast.toast(this.$t('message.updateProjectSettingsSuccess'), {
          noCloseButton: true,
          variant: 'success',
          autoHideDelay: 3000
        })
      })
    },
    onUploadImage() {
      this.uploadImage({
          projectId: this.projectId,
          file: this.file
        })
        .then(result => {
          this.reload()
        })
    },
    onDeleteImage() {
      this.deleteImage(this.projectId)
        .then(result => {
          this.reload()
        })
    },
    reload() {
      this.$router.go({path: this.$router.currentRoute.path, force: true});
    },
    ...mapActions('Generals', {
      getProject: 'getProject',
      updateProject: 'updateProject',
      uploadImage: 'uploadImage',
      deleteImage: 'deleteImage'
    })
  }
}
</script>

<style>

</style>