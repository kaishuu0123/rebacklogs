<template>
  <div class="card mt-2 shadow-sm">
    <div v-if="isEdit" class="card-header px-3 py-2">
      <b-form ref="form" class="d-flex flex-row flex-wrap align-items-center justify-content-between mb-2" @submit.stop.prevent="handleSubmit">
        <h6 class="m-0 font-weight-bold text-primary">
          <b-form-input
            id="title-input"
            v-model="dirtySprint.title"
            required
            ref="titleInput"
            size="sm"
          />
        </h6>
        <div class="d-flex flex-row align-items-center">
          <date-range-picker
            ref="picker"
            :locale-data="localeData"
            :timePicker="false"
            :autoApply="true"
            v-model="dateRange"
            @update="updateValues"
          >
            <div slot="input" slot-scope="picker" style="min-width: 200px;">
              {{ picker.startDate | date }} - {{ picker.endDate | date }}
            </div>
          </date-range-picker>
        </div>
      </b-form>
      <div class="d-flex flex-wrap justify-content-end">
        <a href="#" @click="editDone(true)" class="btn rb-btn-s btn-primary mr-1" key="check-button">
          <i class="fas fa-check"></i> {{ $t('action.save') }}
        </a>
        <a href="#" @click="editDone(false)" class="btn rb-btn-s btn-secondary" key="ban-button">
          <i class="fas fa-ban"></i> {{ $t('action.cancel') }}
        </a>
      </div>
    </div>
    <div v-else class="card-header px-2 py-2 d-flex flex-wrap align-items-center justify-content-between">
      <h6 class="m-0 text-gray-700" @click="editEnter">{{ sprint.title }}</h6>
      <div class="d-flex flex-wrap align-items-center">
        <div class="mr-3" @click="editEnter">
          <div v-if="sprint.start_datetime" class="text-xs text-muted">
            <span>{{ sprint.start_datetime | date }}</span>
            <span><i class="fas fa-angle-right"></i></span>
            <span>{{ sprint.end_datetime | date }}</span>
          </div>
          <div v-else>
            <span class="text-muted text-xs">{{ $t('message.noPeriodSpecified') }}</span>
          </div>
        </div>
        <div class="mr-2">
          <a :href="`/projects/${projectId}/sprints/${sprint.id}/kanban`" class="btn rb-btn-s btn-link p-1 mr-1" key="kanban-button" v-b-tooltip.hover :title="$t('action.viewKanban')">
            <i class="fa fa-border-all"></i>
          </a>
          <a href="#" v-if="!sprint.closed" @click='editEnter' class="btn rb-btn-s btn-link p-1 mr-1" v-b-tooltip.hover :title="$t('action.editSprint')">
            <i class="fas fa-pen"></i>
          </a>
          <a href="#" v-if="!sprint.closed" @click='onClickCloseSprint' class="btn rb-btn-s btn-link p-1" v-b-tooltip.hover :title="$t('action.closeSprint')">
            <i class="far fa-calendar-check"></i>
          </a>
          <a href="#" v-if="sprint.closed" @click='onClickOpenSprint' class="btn rb-btn-s btn-link p-1" v-b-tooltip.hover :title="$t('action.openSprint')">
            <i class="fas fa-door-open"></i>
          </a>
        </div>
        <div>
            {{ totalSprintPoint | numeral('0.0') }}
        </div>
      </div>
    </div>
    <ul class="list-group list-group-flush rb-draggable">
      <VueDraggable
        class="draggable_area"
        :list="sprint.stories"
        v-bind="dragOptions"
        :emptyInsertThreshold="40"
        :data-sprint-id="sprint.id"
        @end="dragEnd">
        <StoryListItem v-for="story in searchStoryByKeyword(sprint.stories)" :key="story.id" :story="story" :data-story-id="story.id" />
        <li v-if="sprint.stories.length == 0" class="list-group-item rb-alert-primary px-3 py-2">
          <div class="d-flex align-items-center">
            <i class="fas fa-info-circle mr-1"></i> {{ $t('message.storyDoesNotExistsInSprint') }}
          </div>
        </li>
      </VueDraggable>
    </ul>
  </div>
</template>

<script>
import Vue from 'vue'
import vueNumeralFilter from 'vue-numeral-filter'
import { mapActions } from 'vuex'
import DateRangePicker from 'vue2-daterange-picker'
//you need to import the CSS manually (in case you want to override it)
import 'vue2-daterange-picker/dist/vue2-daterange-picker.css'
import VueDraggable from 'vuedraggable'
import StoryListItem from './StoryListItem'
import CustomMoment from '../../commons/custom-moment'
import moment from '../../commons/custom-moment'

Vue.use(vueNumeralFilter)

export default {
  name: 'SprintCard',
  components: {
    VueDraggable,
    DateRangePicker,
    StoryListItem
  },
  props: {
    sprint: Object,
    projectId: String,
    searchKeyword: String,
  },
  mounted () {
    this.dirtySprint = this.sprint
    this.dateRange = {
      startDate: this.sprint.start_datetime,
      endDate: this.sprint.end_datetime
    }
  },
  filters: {
    date (value) {
      if (!value)
        return ''

      let options = {year: 'numeric', month: 'numeric', day: 'numeric'};
      let m = moment(value)
      return Intl.DateTimeFormat('en-ZA', options).format(m)
    }
  },
  data() {
    return {
      isEdit: false,
      dateRange: {
        startDate: null,
        endDate: null
      },
      dirtySprint: {
        id: null,
        title: '',
        start_datetime: null,
        end_datetime: null
      }
    }
  },
  watch: {
    sprint: function (val, oldVal) {
      this.dirtySprint = Object.assign({}, this.sprint)
    }
  },
  methods: {
    editEnter() {
      if (this.sprint.closed) {
        return;
      }

      this.isEdit = true
      Vue.nextTick(() => {
        this.$refs.titleInput.focus()
      })
    },
    editDone(isSave) {
      this.isEdit = false
      if (isSave) {
        this.updateSprint({
          projectId: this.projectId,
          sprint: this.dirtySprint
        })
      }
    },
    onClickCloseSprint() {
      this.closeSprint({
        projectId: this.projectId,
        sprint: this.sprint
      })
    },
    onClickOpenSprint() {
      this.openSprint({
        projectId: this.projectId,
        sprint: this.sprint
      })
    },
    handleSubmit() {
      this.editDone(true)
    },
    updateValues() {
      this.dirtySprint.start_datetime = this.dateRange.startDate
      this.dirtySprint.end_datetime = this.dateRange.endDate
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
        storyId: storyId
      })
    },
    searchStoryByKeyword(stories) {
      if (this.searchKeyword == null) {
        return stories;
      }

      return stories.filter(story => {
        return this.searchKeyword.toLowerCase()
          .split(/\s+/)
          .map(query => {
            return (
              story.ticket_number_with_ticket_prefix.toLowerCase().indexOf(query) > -1
              || story.title.toLowerCase().indexOf(query) > -1
              || (story.tags && story.tags.some(tag => tag.name.toLowerCase().indexOf(query) > -1))
            )
          })
          .every(result => result === true)
      });
    },
    ...mapActions({
      updateSprint: 'updateSprint',
      updateStoryByDrag: 'updateStoryByDrag',
      closeSprint: 'closeSprint',
      openSprint: 'openSprint'
    })
  },
  computed: {
    dragOptions() {
      return {
        animation: 100,
        group: 'STORIES',
        ghostClass: 'ghost'
      }
    },
    localeData() {
      return {
        firstDay: 1,
        format: CustomMoment.localeData().longDateFormat('L')
      }
    },
    totalSprintPoint() {
      return this.sprint.stories.reduce((a, b) => {
        return a + b.point
      }, 0)
    }
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
.vue-daterange-picker ::v-deep .reportrange-text {
  @extend .form-control-sm;
}

li.rb-alert-primary {
  @extend .alert;
  @extend .alert-primary;
}
</style>