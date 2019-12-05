<template>
  <div class="container-fluid">
    <loading
      :active.sync="isLoading"
      :can-cancel="false"
      :is-full-page="false"
      color="#4e73df"
      background-color="#f8f9fc"
      loader="dots"></loading>

    <div class="row">
      <div class="col-6" v-for="sprint in sprints" :key="sprint.id">
        <SprintCard class="mb-3" :sprint="sprint" :projectId="projectId" />
      </div>
      <div v-if="sprints.length == 0" class="mt-4 p-4 col-6 mx-auto d-flex bg-gray-200 justify-content-center align-items-center border rounded w-100">
        <h6 class="m-0">{{ $t('message.closedSprintDoesNotExists') }}</h6>
      </div>
    </div>

    <StoryModal id="storyModal" :projectId="projectId" />
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
      newStory: false
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

    this.getClosedSprintsWithStories(this.projectId)
    if (this.$route.meta.newStory || this.$route.params.storyId) {
      this.$bvModal.show('storyModal')
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.$route.meta.newStory || this.$route.params.storyId) {
        this.$bvModal.show('storyModal')
      }
      this.getClosedSprintsWithStories(this.projectId)
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
      'getClosedSprintsWithStories',
    ])
  }
}
</script>

<style>
#wrapper {
  font-size: 0.8em;
}
</style>