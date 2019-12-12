<template>
  <div id="rb-backlogs" class="container-fluid mt-3">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="false"
      color="#4e73df"
      background-color="#f8f9fc"
      loader="dots"></loading>
    <div class="row px-2">
      <div class="d-flex w-100 align-items-center justify-content-between mb-2">
        <h1 class="h4 mb-0 text-gray-700">{{ $t('title.masterBacklogs')}}</h1>
        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center mr-2">
            <b-form-input
              id="searchInput"
              v-model="searchKeyword"
              type="text"
              size="sm"
              :placeholder="$t('title.search')"
            ></b-form-input>
          </div>
          <div class="d-flex align-items-center">
            <span class="h6 mb-0 mr-2">{{ $t('title.layout') }}: </span>
            <b-form-radio-group
              id="layout-radios"
              v-model="layout"
              :options="layoutOptions"
              buttons
              button-variant="outline-secondary"
              size="sm"
              name="radio-btn-outline"
            ></b-form-radio-group>
          </div>
        </div>
      </div>
    </div>

    <div class="row" v-if="layout === 'HORIZONTAL'">
      <div class="row flex-row flex-sm-nowrap w-100 rb-overflow-x" >
        <div class="col-6">
          <BacklogsCard :stories='storiesInBacklogs' :projectId='projectId' :searchKeyword="searchKeyword" />
        </div>
        <div v-for="sprint in sprints" :key="sprint.id" class="col-6">
          <SprintCard class="mb-3" :sprint="sprint" :projectId="projectId" :searchKeyword="searchKeyword" />
        </div>
        <div v-if="sprints.length <= 0" class="col-6">
          <div class="rb-alert-primary mt-2 p-3 border rounded rb-border-dotted">
            <p class="m-0"><i class="fas fa-info-circle mr-1"></i> {{ $t('message.sprintDoesNotExists')}} </p>
          </div>
        </div>
      </div>
    </div>
    <div class="row" v-else>
      <div v-if="sprints.length > 0" class="col-6">
        <SprintCard class="mb-3" v-for="sprint in sprints" :key="sprint.id" :sprint="sprint" :projectId="projectId" :searchKeyword="searchKeyword" />
      </div>
      <div v-else class="col-6">
        <div class="w-100 rb-alert-primary mt-2 p-3 border rounded rb-border-dotted">
          <p class="m-0"><i class="fas fa-info-circle mr-1"></i> {{ $t('message.sprintDoesNotExists')}} </p>
        </div>
      </div>
      <div class="col-6">
        <BacklogsCard :stories='storiesInBacklogs' :projectId='projectId' :searchKeyword="searchKeyword" />
      </div>
    </div>

    <StoryModal id="storyModal" :projectId="projectId" :isLoading="isLoading" />
  </div>
</template>

<script>
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { mapState, mapActions, mapMutations } from 'vuex'
import StoryModal from '../components/backlogs/StoryModal'
import BacklogsCard from '../components/backlogs/BacklogsCard'
import SprintCard from '../components/backlogs/SprintCard'
import StoryListItem from '../components/backlogs/StoryListItem'
import '../commons/custom-bootstrap-vue'
// Import component
import Loading from 'vue-loading-overlay';
// Import stylesheet
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
  data () {
    return {
      projectId: null,
      newStory: false,
      layout: 'DEFAULT',
      searchKeyword: '',
      layoutOptions: [
        {
          text: this.$t('title.default'),
          value: 'DEFAULT'
        },
        {
          text: this.$t('title.horizontal'),
          value: 'HORIZONTAL'
        }
      ]
    }
  },
  components: {
    StoryModal,
    BacklogsCard,
    SprintCard,
    StoryListItem,
    Loading
  },
  mounted() {
    this.projectId = this.$route.meta.projectId
    this.newStory = this.$route.meta.newStory

    this.getSprintsWithStories(this.projectId)
    if (this.$route.meta.newStory || this.$route.params.storyId) {
      this.$bvModal.show('storyModal')
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.meta.newStory || this.$route.params.storyId) {
        this.$bvModal.show('storyModal')
      }
      this.getSprintsWithStories(this.projectId)
    }
  },
  computed: {
    ...mapState({
      isLoading: 'isLoading',
      sprints: 'sprints',
      storiesInBacklogs: 'storiesInBacklogs'
    }),
    ...mapState('Stories', {
      storyModalVisible: 'storyModalVisible'
    })
  },
  methods: {
    ...mapActions([
      'getSprintsWithStories',
    ])
  }
}
</script>

<style lang="scss">
@import '../stylesheets/application.scss';

#rb-backlogs {
  font-size: 0.8em;

  /* for vue-loading-overlay */
  position: relative;
}

.rb-alert-primary {
  @extend .alert;
  @extend .alert-primary;
}

.rb-overflow-x {
  overflow-x: scroll;
}

.rb-overflow-x::-webkit-scrollbar {
  height: 5px;
  background:#eee;
  -webkit-border-radius: 10px;
  border-radius: 10px;
}

.rb-overflow-x::-webkit-scrollbar:horizontal {
  height: 5px;
}

.rb-overflow-x::-webkit-scrollbar-thumb {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  background:#666;
}
</style>