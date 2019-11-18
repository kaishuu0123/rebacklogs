<template>
  <div>
    <v-select
      @search:focus="onFocusTags"
      @input="onInputTag"
      :clearable="true"
      :options="projectTags.tags"
      v-model="projectTags.selected"
      label="name"
      :placeholder="$t('message.tagInput')"
      :components="{OpenIndicator}"
      :multiple="true"
      :create-option="tag => ({ name: tag })"
      :taggable="true"
      ref="vSelect"
    >
      <template slot="selected-option" slot-scope="selected_option">
        <span class="text-gray-600">
          {{ selected_option.name }}
        </span>
      </template>
    </v-select>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import { mapState, mapActions } from 'vuex'

export default {
  name: 'TagInput',
  components: {
    vSelect
  },
  props: {
    value: Array,
    projectId: String,
  },
  data () {
    return {
      options: [
        'Vue.js',
        'Javascript',
        'Open Source'
      ],
      OpenIndicator: {
        render: createElement => createElement('i', {class: 'fas fa-caret-down'})
      }
    }
  },
  watch: {
    value: function(value, old) {
      this.projectTags.selected = value
    }
  },
  mounted() {
    this.projectTags.selected = this.value
  },
  computed: {
    ...mapState('Tickets', {
      projectTags: 'projectTags'
    })
  },
  methods: {
    onInputTag(tags) {
      this.$emit('input', tags)
    },
    onFocusTags() {
      this.getProjectTags({
        projectId: this.projectId
      })
    },
    ...mapActions('Tickets', {
      getProjectTags: 'getProjectTags'
    })
  }
}
</script>

<style lang="scss" scoped>
$vs-selected-bg: #eaecf4;
$vs-selected-border-color: #b7b9cc;

/deep/ {
  @import "~vue-select/src/scss/vue-select.scss";

  .vs__search::placeholder {
    color: #b7b9cc;
  }
}
</style>
