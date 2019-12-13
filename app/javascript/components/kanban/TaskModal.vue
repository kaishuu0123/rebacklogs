<template>
  <b-modal
    id="taskModal"
    modal-class="rb-modal"
    size="lg"
    ref="modal"
    :visible='visible'
    @shown="onShow"
    @hidden="onHide"
    hide-header
    hide-footer
    no-fade>
    <div id="rb-task-modal" class="container-fluid" ref="container">
      <loading
        :active.sync="isLoading"
        :can-cancel="false"
        :is-full-page="false"
        color="#4e73df"
        background-color="#f8f9fc"
        loader="dots"></loading>

      <div class="row">
        <div class="col-9">
          <div class="d-flex mb-2">
            <div class="mr-2">
              <div v-if="!isNew">
                <button type="button" class="btn rb-btn-s btn-outline-danger shadow-sm" @click="onClickDelete">
                  <i class="fas fa-trash-alt mr-1" /> {{ $t('action.delete') }}
                </button>
              </div>
            </div>
            <div class="d-flex ml-auto">
              <div class="mr-2" v-if="!isNew">
                <div class="dropdown">
                  <button class="btn rb-btn-s btn-outline-secondary shadow-sm dropdown-toggle" type="button" id="clickboardMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <i class="fas fa-paperclip mr-1" /> {{ $t('action.copyToClipboard') }}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="clickboardMenuButton">
                    <a class="dropdown-item" @click="onClickCopyTitle">
                      <div class="text-gray-600 font-weight-bold">Title</div>
                      <pre class="text-gray-500 small mb-0">{{ taskTitle }}</pre>
                    </a>
                    <a class="dropdown-item" @click="onClickCopyURL">
                      <div class="text-gray-600 font-weight-bold">URL</div>
                      <pre class="text-gray-500 mb-0">{{ taskURL }}</pre>
                    </a>
                    <a class="dropdown-item" @click="onClickCopyURLWithTitle">
                      <div class="text-gray-600 font-weight-bold">URL with Title</div>
                      <pre class="text-gray-500 small mb-0">{{ taskURLWithTitle }}</pre>
                    </a>
                    <div class="dropdown-divider"></div>
                    <h6 class="dropdown-header">With Story</h6>
                    <a class="dropdown-item" @click="onClickCopyTitleWithStory">
                      <div class="text-gray-600 font-weight-bold">Title</div>
                      <pre class="text-gray-500 small mb-0">{{ taskTitleWithStory }}</pre>
                    </a>
                    <a class="dropdown-item" @click="onClickCopyURLWithStory">
                      <div class="text-gray-600 font-weight-bold">URL</div>
                      <pre class="text-gray-500 small mb-0">{{ taskURLWithStory }}</pre>
                    </a>
                  </div>
                </div>
              </div>
              <div v-if="!isEdit" class="mr-2">
                <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.isEdit = true">
                  <i class="fas fa-pen mr-1" /> {{ $t('action.edit') }}
                </button>
              </div>
              <div v-else-if="isEdit && !isNew" class="mr-2">
                <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.$refs.ticketForm.handleSubmit()">
                  <i class="fas fa-pen mr-1" /> {{ $t('action.submit') }}
                </button>
              </div>
              <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.$refs.modal.hide()">
                <i class="fas fa-times mr-1" /> {{ $t('action.close') }}
              </button>
            </div>
          </div>
          <div class="d-flex align-items-center mb-2" v-if="task.id">
            <h2 class="h6 m-0">
              <span class="badge badge-secondary badge-outlined rb-badge-radius mr-2">
                {{task.ticket_number_with_ticket_prefix}}
              </span>
              <span class="badge badge-secondary rb-badge-radius mr-2">
                {{ $t('title.task') }}
              </span>
            </h2>
            <div class="d-flex ml-auto">
              <div class="mr-2">
                <span v-if="task.created_user">
                  {{ $t('ticket.createdBy') }} {{ task.created_user.username }}
                  <span :title="toMoment(task.created_at)">{{ fromNow(task.created_at) }}</span>
                </span>
              </div>
              <div>
                <span v-if="task.last_updated_user">
                  {{ $t('ticket.lastUpdatedBy') }} {{ task.last_updated_user.username }}
                  <span :title="toMoment(task.updated_at)">{{ fromNow(task.updated_at) }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="mb-2">
            <TicketForm
              v-if="isEdit"
              :isNew="isNew"
              :projectId="projectId"
              :ticket="task"
              ticketType="tasks"
              :isLoading="isLoading"
              :afterSubmit="afterSubmit"
              ref="ticketForm" />
            <TicketPreview
              v-else
              :projectId="projectId"
              :ticket="task"
              ticketType="tasks"
              :isLoading="isLoading" />
          </div>
          <hr />
          <div>
            <b-tabs content-class="mt-3" v-if="!isNew">
              <b-tab>
                <template v-slot:title>
                  <i class="fas fa-comment"></i> {{ $t('tab.comment') }}
                </template>
                <CommentFormAndList
                  :projectId="projectId"
                  :ticket="selectedTask"
                  ticketType="tasks"
                  :isLoading="isLoading"
                />
              </b-tab>
              <b-tab>
                <template v-slot:title>
                  <i class="fas fa-clock"></i> {{ $t('tab.history') }}
                </template>
                <HistoryList
                  :histories="task.histories"
                />
              </b-tab>
            </b-tabs>
          </div>
        </div>
        <div class="col-3 p-0">
          <div class="p-3 bg-gray-100">
            <div v-if="task.story">
              <b-form-group
                label="Story:"
                >
                <router-link :to="createShowStoryPath(task.story.id)">
                  <div class="rb-select py-2 text-truncate text-secondary">
                    <span class="badge badge-secondary badge-outlined rb-badge-radius mr-2">
                      {{ task.story.ticket_number_with_ticket_prefix }}
                    </span>{{ task.story.title }}
                  </div>
                </router-link>
              </b-form-group>
            </div>
            <SelectAssignee :projectId="projectId" :ticket="task" ticketType="tasks" :isNew="isNew" v-model="task.assignee" />
            <SelectStatus :projectId="projectId" :ticket="task" ticketType="tasks" :isNew="isNew" v-model="task.projectTicketStatus" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'
import MarkdownText from '../MarkdownText'
import TicketForm from '../commons/TicketForm'
import TicketPreview from '../commons/TicketPreview'
import SelectCategory from '../commons/SelectCategory'
import SelectAssignee from '../commons/SelectAssignee'
import SelectStatus from '../commons/SelectStatus'
import CommentFormAndList from '../commons/CommentFormAndList'
import HistoryList from '../commons/HistoryList'
import CustomMoment from '../../commons/custom-moment'
import urlparse from 'url-parse'
import VueClipboard2 from 'vue-clipboard2'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

Vue.use(VueClipboard2)

export default {
  components: {
    TicketForm,
    TicketPreview,
    SelectCategory,
    SelectAssignee,
    SelectStatus,
    CommentFormAndList,
    HistoryList,
    Loading
  },
  name: 'TaskModal',
  props: {
    projectId: String,
    visible: Boolean
  },
  data() {
    return {
      isEdit: false,
      isLoading: false,
      task: {
        story_id: null,
        id: null,
        title: '',
        body: '',
        projectTicketStatus: null,
        assignee: null
      }
    }
  },
  computed: {
    taskTitle() {
      return `${this.task.ticket_number_with_ticket_prefix} ${this.task.title}`
    },
    taskURL() {
      return `${urlparse().origin + '/' + this.task.ticket_number_with_ticket_prefix}`
    },
    taskURLWithTitle() {
      return `${this.taskTitle}\n` +
             `${this.taskURL}`
    },
    taskTitleWithStory() {
      return `${this.task.story.ticket_number_with_ticket_prefix} ${this.task.story.title}\n` +
             `  ${this.task.ticket_number_with_ticket_prefix} ${this.task.title}`
    },
    taskURLWithStory() {
      return `${urlparse().origin + '/' + this.task.story.ticket_number_with_ticket_prefix}\n` +
             `  ${urlparse().origin + '/' + this.task.ticket_number_with_ticket_prefix}`
    },
    isNew() {
      return this.task.id == null;
    },
    ...mapState({
      selectedTask: 'selectedTask'
    })
  },
  watch: {
    selectedTask: function (task, oldTask) {
      this.task = task

      if (task.assignee) {
        this.SET_ASSIGNEE({
          id: task.assignee.id,
          username: task.assignee.username,
          image: task.assignee.image,
        });
      }

      if (task.project_ticket_status) {
        task.projectTicketStatus = task.project_ticket_status
        this.SET_PROJECT_TICKET_STATUS({
          id: task.project_ticket_status.id,
          title: task.project_ticket_status.title,
        })
      }
    }
  },
  methods: {
    onShow() {
      this.resetData()
      this.task.story_id = this.$route.params.storyId

      if (this.$route.params.taskId) {
        this.isLoading = true
        this.getTask({
            projectId: this.projectId,
            taskId: this.$route.params.taskId
          })
          .then(task => {
            this.isLoading = false
          })
      } else {
        this.isEdit = true
      }
    },
    onHide() {
      this.resetData()
      this.$router.push('/')
    },
    afterSubmit() {
      if (this.task.id) {
        this.isEdit = false
      } else {
        this.$refs.modal.hide()
      }
    },
    onClickCopyTitle () {
      const textBody = this.taskTitle
      this.copyText(textBody)
    },
    onClickCopyURL () {
      const textBody = this.taskURL
      this.copyText(textBody)
    },
    onClickCopyURLWithTitle() {
      const textBody = this.taskURLWithTitle
      this.copyText(textBody)
    },
    onClickCopyTitleWithStory() {
      const textBody = this.taskTitleWithStory
      this.copyText(textBody)
    },
    onClickCopyURLWithStory() {
      const textBody = this.taskURLWithStory
      this.copyText(textBody)
    },
    copyText(textBody) {
      const container = this.$refs.container
      this.$copyText(textBody, container).then((e) => {
        this.$bvToast.toast(this.$t('action.copiedToClipboard'), {
          noCloseButton: true,
          variant: 'success',
          autoHideDelay: 2000
        })
      }, (e) => {
        this.$bvToast.toast(this.$t('action.cannotCopiedToClipboard'), {
          noCloseButton: true,
          variant: 'danger',
          autoHideDelay: 3000
        })
      })
    },
    onClickDelete() {
      if (confirm('Are you sure?')) {
        this.deleteTask({
          projectId: this.projectId,
          taskId: this.task.id
        })

        this.$refs.modal.hide()
      }
    },
    fromNow(datetime) {
      return CustomMoment(datetime).fromNow()
    },
    toMoment(datetime) {
      return CustomMoment(datetime).format('LLLL')
    },
    resetData() {
      this.task = {
        id: null,
        title: '',
        body: '',
        projectTicketStatus: null,
        assignee: null
      }
      this.isEdit = false
      this.SET_SELECTED_TASK(this.task)
      this.RESET_TICKET_ATTRIBUTES()
    },
    createShowStoryPath(storyId) {
      return { name: 'ShowStory', params: {storyId: storyId} }
    },
    ...mapActions('Tasks', {
      getTask: 'getTask',
      deleteTask: 'deleteTask'
    }),
    ...mapMutations([
      'SET_SELECTED_TASK'
    ]),
    ...mapMutations('Tickets', [
      'SET_ASSIGNEE',
      'SET_PROJECT_TICKET_STATUS',
      'SET_PROJECT_TICKET_CATEGORY',
      'RESET_TICKET_ATTRIBUTES'
    ])
  }
}
</script>

<style lang="scss">
#rb-task-modal {
  /* for vue-loading-overlay */
  position: relative;
}

.rb-modal {
  font-size: 0.8rem;

  .modal-dialog {
    max-width: 75%k
  }
}

/**
* Bootstrap Modal
*/
.modal {
    z-index: 1101 !important;
}

/**
* Vue Loading
*/
.vld-overlay.is-full-page {
    z-index: 1103 !important;
}

.rb-select {
  border-bottom: 1px solid #888
}
</style>