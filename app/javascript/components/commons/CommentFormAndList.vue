<template>
  <div>
    <div class="mb-3">
      <b-form @submit.stop.prevent="handleComment">
        <b-form-group
          id="comment-group"
          label-for="body-input"
        >
          <b-form-textarea
            id="comment-input"
            :placeholder="$t('message.leaveAComment')"
            :disabled="isLoading"
            v-model="commentBody"
            rows="3"
            size="sm"
          />
        </b-form-group>
        <div class="d-flex">
          <b-form-text><i class="fab fa-markdown"></i> Markdown available</b-form-text>
          <b-button class="ml-auto" variant="primary" size="sm" type="submit">{{ $t('action.comment') }}</b-button>
        </div>
      </b-form>
    </div>
    <div v-if="ticket">
      <div class="card mb-3" v-for="comment in ticket.comments" :key="comment.id">
        <div class="card-header p-2">
          <div class="d-flex">
            <div>
              <span class="rb-select-image mr-2"><img :src="comment.user.image" width="25" class="rounded" /></span><span class="font-weight-bold">{{comment.user.username}}</span> commented {{ toMoment(comment.created_at) }}
            </div>
            <div class="ml-auto">
              <button type="button" class="text-danger btn rb-btn-xs btn-link" @click="onClickDeleteComment(comment.id)">
                <i class="far fa-trash-alt"></i>
              </button>
            </div>
          </div>
        </div>
        <div class="card-body p-3">
          <MarkdownText :content="comment.body" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex'
import MarkdownText from '../MarkdownText'
import CustomMoment from '../../commons/custom-moment'

export default {
  name: 'CommentFormAndList',
  components: {
    MarkdownText
  },
  props: {
    projectId: String,
    ticket: Object,
    ticketType: String,
    isLoading: Boolean
  },
  data() {
    return {
      commentBody: null
    }
  },
  methods: {
    handleComment(event) {
      this.createComment({
        projectId: this.projectId,
        ticketType: this.ticketType,
        ticketId: this.ticket.id,
        commentBody: this.commentBody
      }).then((result) => {
        switch(this.ticketType) {
        case 'stories':
          this.getStory({
            projectId: this.projectId,
            storyId: this.ticket.id
          })
        case 'tasks':
          this.getTask({
            projectId: this.projectId,
            taskId: this.ticket.id
          })
          break;
        }

        this.commentBody = null;
      })
    },
    onClickDeleteComment(commentId) {
      this.deleteComment({
        projectId: this.projectId,
        ticketType: this.ticketType,
        ticketId: this.ticket.id,
        commentId: commentId
      }).then((result) => {
        switch(this.ticketType) {
        case 'stories':
          this.getStory({
            projectId: this.projectId,
            storyId: this.ticket.id
          })
        case 'tasks':
          this.getTask({
            projectId: this.projectId,
            taskId: this.ticket.id
          })
          break;
        }

        this.commentBody = null;
      })
    },
    toMoment(datetime) {
      return CustomMoment(datetime).format('LLLL')
    },
    ...mapActions('Stories', {
      getStory: 'getStory'
    }),
    ...mapActions('Tasks', {
      getTask: 'getTask'
    }),
    ...mapActions('Tickets', {
      createComment: 'createComment',
      deleteComment: 'deleteComment'
    })
  }
}
</script>

<style>

</style>