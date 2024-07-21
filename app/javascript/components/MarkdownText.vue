<template>
  <div class="markdown-body" ref="markdown-it-vue-container"></div>
</template>

<script>
import MarkdownIt from 'markdown-it'
import MarkdownItIns from 'markdown-it-ins'
import MarkdownItSanitizer from 'markdown-it-sanitizer'
import hljs from '../src/custom_hljs'
import 'highlight.js/styles/github-gist.css'

export default {
  name: 'MarkdownText',
  props: {
    content: {
      type: String
    }
  },
  watch: {
    content: {
      immediate: true,
      handler(val) {
        this.$nextTick(() => {
          this.$refs['markdown-it-vue-container'].innerHTML = this.md.render(
            val
          )
        })
      }
    }
  },
  data() {
    const md = new MarkdownIt({
      highlight: function(code, lang) {
        return hljs.highlightAuto(code, [lang]).value
      },
      html: false,
      linkify: true,
      breaks: true,
      typographer: true
    })
      .use(MarkdownItSanitizer)
      .use(MarkdownItIns)

    return {
      md: md
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~bootstrap/scss/functions';
@import '~bootstrap/scss/variables';
@import '~bootstrap/scss/mixins';
@import '~bootstrap/scss/type';

.markdown-body ::v-deep {
  h1 {
    @include font-size($h4-font-size);
  }
  h2 {
    @include font-size($h5-font-size);
  }
  h3 {
    @include font-size($h6-font-size);
  }
  pre {
    background-color: #f8f9fc;
    padding: 0.5rem;
  }
  :last-child {
    margin-bottom: 0px;
  }
}
</style>