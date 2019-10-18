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
    <div class="container">
      <div class="row">
        <div class="col-9">
          <div class="d-flex mb-2">
            <div class="mr-2">
              <div v-if="task.id != null">
                <button type="button" class="btn rb-btn-s btn-outline-danger shadow-sm" @click="onClickDelete">
                  <i class="fas fa-trash-alt mr-1" /> {{ $t('action.delete') }}
                </button>
              </div>
            </div>
            <div class="d-flex ml-auto">
              <div v-if="!isEdit" class="mr-2">
                <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.isEdit = true">
                  <i class="fas fa-pen mr-1" /> {{ $t('action.edit') }}
                </button>
              </div>
              <button type="button" class="btn rb-btn-s btn-outline-secondary shadow-sm" @click="() => this.$refs.modal.hide()">
                <i class="fas fa-times mr-1" /> {{ $t('action.close') }}
              </button>
            </div>
          </div>
          <div class="d-flex align-items-center mb-2" v-if="task.id">
            <h2 class="h5 m-0">
              <span class="badge badge-info mr-2" :style="badgeColor">
                {{task.ticket_number_with_ticket_prefix}}
              </span>
            </h2>
            <div class="mr-2">
              <span v-if="task.created_user">
                Created by {{ task.created_user.username }}
                 <span :title="toMoment(task.created_at)">{{ fromNow(task.created_at) }}</span>
              </span>
            </div>
            <div>
              <span v-if="task.last_updated_user">
                Last updated by {{ task.last_updated_user.username }}
                 <span :title="toMoment(task.updated_at)">{{ fromNow(task.updated_at) }}</span>
              </span>
            </div>
          </div>
          <div class="mb-2">
            <TicketForm
              v-if="isEdit"
              :projectId="projectId"
              :ticket="task"
              ticketType="tasks"
              :isLoading="isLoading"
              :afterSubmit="afterSubmit" />
            <TicketPreview
              v-else
              :projectId="projectId"
              :ticket="task"
              ticketType="tasks"
              :isLoading="isLoading" />
          </div>
          <hr />
          <div>
            <div class="mb-3">
              <CommentFormAndList
                v-if="task.id"
                :projectId="projectId"
                :ticket="selectedTask"
                ticketType="tasks"
                :isLoading="isLoading"
              />
            </div>
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
                    <span class="badge badge-info mr-2" :style="badgeColorForStory">
                      {{ task.story.ticket_number_with_ticket_prefix }}
                    </span>{{ task.story.title }}
                  </div>
                </router-link>
              </b-form-group>
            </div>
            <SelectAssignee :projectId="projectId" :ticket="task" ticketType="tasks" :isNew="task.id == null" v-model="task.assignee" />
            <SelectStatus :projectId="projectId" :ticket="task" ticketType="tasks" :isNew="task.id == null" v-model="task.projectTicketStatus" />
          </div>
        </div>
      </div>
    </div>
  </b-modal>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import axios from 'axios'
import MarkdownText from '../MarkdownText'
import TicketForm from '../commons/TicketForm'
import TicketPreview from '../commons/TicketPreview'
import SelectCategory from '../commons/SelectCategory'
import SelectAssignee from '../commons/SelectAssignee'
import SelectStatus from '../commons/SelectStatus'
import CommentFormAndList from '../commons/CommentFormAndList'
import CustomMoment from '../../commons/custom-moment'

export default {
  components: {
    TicketForm,
    TicketPreview,
    SelectCategory,
    SelectAssignee,
    SelectStatus,
    CommentFormAndList
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
    badgeColor() {
      let color = '#858796'
      if (this.task.project_ticket_category) {
        color = this.task.project_ticket_category.color
      }

      return {
        "background-color": color
      }
    },
    badgeColorForStory() {
      let color = '#858796'
      if (this.task.story.project_ticket_category) {
        color = this.task.story.project_ticket_category.color
      }

      return {
        "background-color": color
      }
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
.rb-modal {
  font-size: 0.8rem;

  .modal-dialog {
    max-width: 75%
  }
}

.rb-select {
  border-bottom: 1px solid #888
}
</style>