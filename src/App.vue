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
        <button class="btn btn-primary" v-if="D" @click="updateCompass()">Update</button>
        <magic-compass :compasses="compasses"></magic-compass>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <rosout-log></rosout-log>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
interface Compass {
  name: string,
  bearing: number
}

  import ConnectionOverlays from './components/ConnectionOverlays.vue';
  import MagicCompass from './components/MagicCompass.vue';
  import RosTopics from './components/RosTopics.vue';
  import RosoutLog from './components/RosoutLog.vue';
  import Vue from 'vue';
  import * as ROSLIB from 'roslib';

  // Debug flag, for testing glory
  const D = true;

  // Dummy topic names to test out word wrapping within table cell
  const testTopics = [
    {
      id: 1,
      name: 'Long_test_string_Long_test_string_Long_test_string_Long_test_string_Long_test_string_Long_test_string_Long_test_string_Long_test_string',
      value: 100
    },
    {
      id: 2,
      name: 'Another_topic_name_but_this_one_ain\'t_as_long',
      value: 'Hello'
    }
  ];

  let testCompasses: Compass[] = [
    { name: 'goal_hand', bearing: 0 },
    { name: 'heading_hand', bearing: 0 },
    { name: 'waypoint_hand', bearing: 0 },
    { name: 'wind_hand', bearing: 0 },
  ];

  export default Vue.component('app', {
    data() {
      return {
        D: D,
        compasses: testCompasses,
        test: testCompasses[0].bearing,
        topics: testTopics,
        isDisconnected: true,
        isConnecting: false
      }
    },
    methods: {
      /**
       * Debug method. Update the compasses with a random bearing at every click.
       */
      updateCompass() {
        if (!this.D) return;
        this.compasses.map((c: Compass) => {
          c.bearing = (c.bearing + 50 * Math.random()) % 360;
        });
      }
    },
    components: {
      ConnectionOverlays,
      MagicCompass,
      RosTopics,
      RosoutLog
    }
  });

</script>

<style lang="scss" scoped>
  #app {
    font-family: 'Avenir', sans-serif;
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
