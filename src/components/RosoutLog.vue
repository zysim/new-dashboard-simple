<template>

  <div>
    <h2>/rosout🤖</h2>
    <button class="btn btn-info" @click="togglePause">{{pauseLoggingText}}</button>
    <ul class="nav nav-tabs">
      <li class="nav-item" v-for="(l, index) of levels" :key="index" :id="`rosout-level-${l.toLowerCase()}`" @click.prevent="activeLevel = (1 << index)">
        <a class="nav-link" :class="levelClass(1 << index)" href="/">{{l}}</a>
      </li>
    </ul>
    <rosout-table id="rosout-display" :display-level="activeLevel" :new-message="newMessage"></rosout-table>
  </div>

</template>

<script>
import RosoutTable from './RosoutTable.vue';

export default Vue.component('rosout-log', {
  data() {

  },
  components: {
    RosoutTable
  }
});
</script>

<style lang="scss">

</style>

