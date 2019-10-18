<template>
  <div>
    <b-nav pills vertical>
      <b-nav-item to="/" exact-active-class="active">{{ $t('settings.generalSettings') }}</b-nav-item>
      <b-nav-item to="/group_managements" exact-active-class="active">{{ $t('settings.groupManagements') }}</b-nav-item>
      <b-nav-item to="/ticket_categories" exact-active-class="active">{{ $t('settings.ticketCategories') }}</b-nav-item>
      <b-nav-item to="/ticket_statuses" exact-active-class="active">{{ $t('settings.ticketStatuses') }}</b-nav-item>
    </b-nav>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>