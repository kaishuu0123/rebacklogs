<template>
  <div class="container-fluid mt-3">
    <div class="row">
      <SideBar class="col-3"/>
      <router-view class="col-9" />
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import SideBar from '../components/ProjectSettings/SideBar'
import '../commons/custom-bootstrap-vue'

export default {
  components: {
    SideBar
  }
}
</script>

<style>

</style>