<template>
  <div class="container-fluid mt-2">
    <div class="row mb-2 bg-light sticky-top">
      <nav class="navbar px-1 py-0 navbar-light">
        <a class="navbar-brand text-gray-700" href="#">{{ sprintTitle }}</a>
        <ul class="navbar-nav">
          <li class="nav-item">
              <a :href="`/projects/${projectId}`" class="nav-link"><i class="fas fa-angle-double-left"></i> {{ $t('action.backToBacklogs') }}</a>
          </li>
        </ul>
      </nav>
    </div>
    <div class="row">
      <table class="table table-bordered rb-table-fixed">
        <thead>
          <tr>
            <th v-for="status in projectTicketStatuses" :key="status.id">
              {{ status.title }}
            </th>
          </tr>
        </thead>
        <tbody v-for="story in stories" :key="story.id">
          <tr>
            <td :colspan="statusesLength" class="border-bottom-0">
              <div class="d-flex align-items-center">
                <div class="mr-2">
                  <router-link :to="createNewTaskPath(story.id)" class="btn rb-btn-xs btn-outline-primary shadow-sm">
                    <i class="fas fa-plus-circle mr-1"></i> {{ $t('action.addTask') }}
                  </router-link>
                </div>
                <div>
                  <router-link :id="`popover-story-${story.id}`" :to="createShowStoryPath(story.id)" class="text-secondary">
                    <span class="badge badge-info mr-1" :style="badgeColor(story)">
                      {{story.ticket_number_with_ticket_prefix}}
                    </span>
                    <span>
                      <s v-if="story.is_done">{{ story.title }}</s>
                      <span v-else>{{ story.title }}</span>
                    </span>
                  </router-link>
                  <b-popover :target="`popover-story-${story.id}`" triggers="hover" placement="right" delay="500">
                    <dl>
                      <dt>{{ $t('ticket.title') }}</dt>
                      <dd>{{ story.title }}</dd>
                      <dt>{{ $t('ticket.body') }}</dt>
                      <dd><MarkdownText :content="story.body" /></dd>
                    </dl>
                  </b-popover>
                </div>
              </div>
            </td>
          </tr>
          <tr>
            <td class="rb-task-column border-top-0 pt-0 rb-draggable" v-for="status in projectTicketStatuses" :key="status.id">
              <VueDraggable
                class="rb-draggable-area"
                :list="tasksByStatus(story.tasks, status)"
                v-bind="dragOptions"
                :data-story-id="story.id"
                :emptyInsertThreshold="60"
                :data-project-ticket-status-id="status.id"
                @end="dragEnd($event, story)">
                  <TaskCard
                    v-for="task in tasksByStatus(story.tasks, status)"
                    :projectId="projectId"
                    :key="task.id"
                    :task="task"
                    :storyId="story.id"
                    :data-story="story"
                    :data-task-id="task.id" />
              </VueDraggable>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TaskModal :projectId="projectId" />
    <StoryModal :projectId="projectId" />
  </div>
</template>

<script>
import Vue from 'vue'
import { mapActions, mapState, mapMutations } from 'vuex';
import StoryModal from '../components/backlogs/StoryModal'
import TaskModal from '../components/kanban/TaskModal'
import TaskCard from '../components/kanban/TaskCard'
import MarkdownText from '../components/MarkdownText'
import VueDraggable from 'vuedraggable'
import '../commons/custom-bootstrap-vue'

export default {
  components: {
    StoryModal,
    TaskModal,
    TaskCard,
    MarkdownText,
    VueDraggable
  },
  data () {
    return {
      projectId: null,
      sprintId: null,
      sprintTitle: null,
      newTask: false
    }
  },
  mounted() {
    this.projectId = this.$route.meta.projectId
    this.sprintId = this.$route.meta.sprintId
    this.sprintTitle = this.$route.meta.sprintTitle
    this.newTask = this.$route.meta.newTask

    this.setProjectId(this.projectId)
    this.setSprintId(this.sprintId)

    this.getProjectTicketStatuses()
      .then(data => {
        this.getStoriesWithTasks()
      })

    if (this.newTask || this.$route.params.taskId) {
      this.$bvModal.show('taskModal')
    }
    if (this.$route.name === 'ShowStory') {
      this.$bvModal.show('storyModal')
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.meta.newTask || this.$route.params.taskId) {
        this.$bvModal.show('taskModal')
      }
      if (this.$route.name === 'ShowStory') {
        this.$bvModal.show('storyModal')
      }

      this.getStoriesWithTasks()
    }
  },
  computed: {
    dragOptions() {
      return {
        animation: 100,
        group: 'TASKS',
        ghostClass: 'ghost'
      }
    },
    statusesLength() {
      return this.projectTicketStatuses.length
    },
    ...mapState([
      'stories',
      'projectTicketStatuses'
    ])
  },
  methods: {
    tasksByStatus(tasks, status) {
      return tasks.filter((task) => {
        return task.project_ticket_status_id === status.id
      })
    },
    createNewTaskPath(storyId) {
      return { name: 'NewTask', params: {storyId: storyId} }
    },
    createShowStoryPath(storyId) {
      return { name: 'ShowStory', params: {storyId: storyId} }
    },
    dragEnd($event, story) {
      const from = {
        storyId: parseInt($event.from.dataset.storyId),
        statusId: parseInt($event.from.dataset.projectTicketStatusId),
        oldIndex: parseInt($event.oldIndex)
      }
      const to = {
        storyId: parseInt($event.to.dataset.storyId),
        statusId: parseInt($event.to.dataset.projectTicketStatusId),
        newIndex: parseInt($event.newIndex)
      }
      const taskId = parseInt($event.item.dataset.taskId)

      story.tasks.some((task) => {
        if (task.id === taskId) {
          task.story_id = to.storyId
          task.project_ticket_status_id = to.statusId
          return true
        }
        return false
      });

      this.updateTaskByDrag({
        from: from,
        to: to,
        taskId: taskId
      })
    },
    badgeColor(story) {
      let color = '#858796'
      if (story.project_ticket_category) {
        color = story.project_ticket_category.color
      }

      return {
        "background-color": color
      }
    },
    ...mapMutations({
      setSprintId: 'SET_SPRINT_ID',
      setProjectId: 'SET_PROJECT_ID'
    }),
    ...mapActions({
      getStoriesWithTasks: 'getStoriesWithTasks',
      getProjectTicketStatuses: 'getProjectTicketStatuses',
      updateTaskByDrag: 'updateTaskByDrag'
    })
  }
}
</script>

<style lang="scss">
.no-move {
  transition: transform 0s;
}

#wrapper {
  font-size: 0.85rem;
}
.rb-table-fixed {
  table-layout: fixed;
  th {
    font-weight: 500;
  }
  th, td {
    padding: 0.6rem;
  }
}
.rb-task-column {
  height: 100%;
}
.rb-user-image {
  width: 16px;
  height: 16px;
}
.rb-draggable-area {
  min-height: 60px;
}
</style>