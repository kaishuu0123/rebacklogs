<template>
  <div id="rb-backlogs" class="container-fluid mt-2">
    <div class="row">
      <div v-if="sprints.length > 0" class="col-6">
        <SprintCard class="mb-3" v-for="sprint in sprints" :key="sprint.id" :sprint="sprint" :projectId="projectId" />
      </div>
      <div v-else class="col-6">
        <div class="w-100 rb-alert-primary mt-2 p-3 border rounded rb-border-dotted">
          <p class="m-0"><i class="fas fa-info-circle mr-1"></i> {{ $t('message.sprintDoesNotExists')}} </p>
        </div>
      </div>
      <div class="col-6">
        <BacklogsCard :stories='storiesInBacklogs' :projectId='projectId' />
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
    StoryListItem
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
}

.rb-alert-primary {
  @extend .alert;
  @extend .alert-primary;
}
</style>