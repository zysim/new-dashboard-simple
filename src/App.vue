<template>
  <div id="app" class="container">
    <div class="row">
      <div class="col-md-12">
        <connection-overlays :disconnected="isDisconnected" :connecting="isConnecting"></connection-overlays>
      </div>
    </div>

    <div class="row">
      <div class="col-md-4">
        <ros-topics :topics="topics"></ros-topics>
      </div>

      <div class="col-md-8">
        <magic-compass :compasses="compasses"></magic-compass>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <!-- <rosout-log @togglePause></rosout-log> -->
      </div>
    </div>
  </div>
</template>


<script lang="ts">
  import ConnectionOverlays from './components/ConnectionOverlays.vue';
  import MagicCompass from './components/MagicCompass.vue';
  import RosTopics from './components/RosTopics.vue';

  const testTopics = [
  {
    id: 1,
    name: 'test_string_that\'s_hella_long_test_string_that\'s_hella_long_test_string_that\'s_hella_long_test_string_that\'s_hella_long_',
    value: 100
  },
  {
    id: 2,
    name: 'Another_topic_name_but_this_one_ain\'t_as_long',
    value: 'Henlo'
  }
];

  export default {
    data() {
      return {
        compasses: [],
        topics: testTopics,
        isDisconnected: false,
        isConnecting: false
      }
    },
    components: {
      ConnectionOverlays,
      MagicCompass,
      RosTopics
    }
  }

</script>

<style lang="scss" scoped>
  @import "../node_modules/bootstrap/scss/bootstrap.scss";
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

</style>
