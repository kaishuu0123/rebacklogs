<template>
  <div class="card shadow-sm mb-2" :class="assignedUserClass(task)">
    <div class="card-body px-2 py-1">
      <div class="d-flex align-items-center">
        <router-link :to="createSelectTaskPath(storyId, task.id)">
          <span class="text-gray-500 text-xs mr-1">{{ task.ticket_number_with_ticket_prefix }}</span>
          <span class="text-secondary">
            <s v-if="task.is_done">{{task.title}}</s>
            <span v-else>{{task.title}}</span>
          </span>
        </router-link>
      </div>
      <div class="d-flex flex-row justify-content-end">
        <SelectAssigneeForTask :projectId="projectId" :ticket="task" ticketType="tasks" v-model="task.assignee" />
      </div>
    </div>
  </div>
</template>

<script>
import SelectAssigneeForTask from '../commons/SelectAssigneeForTask'

export default {
  name: 'TaskCard',
  props: {
    projectId: String,
    storyId: Number,
    task: Object
  },
  components: {
    SelectAssigneeForTask
  },
  methods: {
    assignedUserClass(task) {
      if (task.assignee) {
        return 'border-left-primary'
      }

      return 'border-left-secondary'
    },
    createSelectTaskPath(storyId, taskId) {
      return { name: 'ShowTask', params: {storyId: storyId, taskId: taskId}}
    }
  }
}
</script>

<style>

</style>