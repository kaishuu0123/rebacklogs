<template>
  <div class="card mt-2 shadow-sm mb-3">
    <div class="card-header px-2 py-2 d-flex flex-row flex-wrap align-items-center justify-content-between">
      <h6 class="m-0 text-gray-700">{{ $t('title.productBacklogs') }}</h6>
      <div class="d-flex flex-row flex-wrap align-items-center">
        <router-link :to="createStoryPath" class="btn rb-btn-xs p-1 btn-outline-primary shadow-sm mr-2">
          <i class="fas fa-plus-circle mr-1"></i>{{ $t('action.addStory') }}
        </router-link>
        <a href="#" @click="createEmptySprint" class="btn rb-btn-xs btn-outline-primary shadow-sm p-1">
          <i class="fas fa-plus-circle mr-1"></i>{{ $t('action.addSprint') }}
        </a>
      </div>
    </div>
    <ul class="list-group list-group-flush rb-draggable">
      <VueDraggable
        class="draggable_area"
        :list="stories"
        v-bind="dragOptions"
        :emptyInsertThreshold="40"
        :data-sprint-id="null"
        @end="dragEnd">
        <StoryListItem :story="story" v-for="story in searchStoryByKeyword(stories)" :key="story.id" :data-story-id="story.id" />
        <li v-if="stories.length == 0" class="list-group-item rb-alert-primary px-3 py-2">
          <div class="d-flex align-items-center">
            <i class="fas fa-info-circle mr-1"></i> {{ $t('message.storyDoesNotExists') }}
          </div>
        </li>
      </VueDraggable>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import VueDraggable from 'vuedraggable'
import StoryListItem from './StoryListItem'

export default {
  name: 'BacklogsCard',
  props: {
    projectId: String,
    stories: Array,
    searchKeyword: String,
  },
  components: {
    StoryListItem,
    VueDraggable
  },
  computed: {
    createStoryPath() {
      return `/stories/new`
    },
    dragOptions() {
      return {
        animation: 100,
        group: 'STORIES',
        ghostClass: 'ghost'
      }
    }
  },
  methods: {
    createEmptySprint() {
      this.createSprint({
        projectId: this.projectId,
        sprint: {
          title: 'untitled sprint'
        }
      })
    },
    dragEnd($event) {
      const from = {
        sprintId: parseInt($event.from.dataset.sprintId),
        oldIndex: parseInt($event.oldIndex)
      }
      const to = {
        sprintId: parseInt($event.to.dataset.sprintId),
        newIndex: parseInt($event.newIndex)
      }
      const storyId = parseInt($event.item.dataset.storyId)
      this.updateStoryByDrag({
        projectId: this.projectId,
        from: from,
        to: to,
        storyId, storyId
      })
    },
    searchStoryByKeyword(stories) {
      return stories.filter(story => {
        return this.searchKeyword.toLowerCase()
          .split(/\s+/)
          .map(query => {
            return (
              story.ticket_number_with_ticket_prefix.toLowerCase().indexOf(query) > -1
              || story.title.toLowerCase().indexOf(query) > -1
              || story.tags.some(tag => tag.name.toLowerCase().indexOf(query) > -1)
            )
          })
          .every(result => result === true)
      });
    },
    ...mapActions([
      'createSprint',
      'updateStoryByDrag'
    ])
  }
}
</script>

<style lang="scss" scoped>
@import '../../stylesheets/application.scss';

.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  /* background: #c8ebfb; */
}
.empty_area {
  min-height: 30px;
}
.rb-draggable {
  min-height: 30px;
}

li.rb-alert-primary {
  @extend .alert;
  @extend .alert-primary;
}
</style>