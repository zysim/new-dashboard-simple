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

/**
 * A ROS topic interface.
 * @prop id    Topic ID
 * @prop name  Topic title
 * @prop value Topic message
 */
interface Topic {
  id: number,
  name: string,
  value: string | number
};

/**
 * A ROS message interface
*/
interface Message {
  latitude?: number,
  longitude?: number,
  topic: string,
  value: number | string
};

import ConnectionOverlays from './components/ConnectionOverlays.vue';
import MagicCompass from './components/MagicCompass.vue';
import RosTopics from './components/RosTopics.vue';
import RosoutLog from './components/RosoutLog.vue';
import Vue from 'vue';
import * as ROSLIB from 'roslib';

// Debug flag, for testing glory
const D = false;

// Dummy topic names to test out word wrapping within table cell
const testTopics = [{
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
      isDisconnected: false,
      isConnecting: true
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
    },
    /**
     * Formats the value in `msg`. Only used by `update()`.
     * @param {Message} msg The message object to format
     */
    formatValue(msg: Message): number|string {
      if (msg.latitude !== undefined && msg.longitude !== undefined) {
        const latHemi = msg.latitude > 0 ? 'N' : 'S';
        const lonHemi = msg.longitude > 0 ? 'E' : 'W';
        return `${Math.abs(msg.latitude)}° ${latHemi} / ${Math.abs(msg.longitude)}°
       ${lonHemi}}`;
      } else {
        return (typeof msg.value === 'number') ?
          msg.value.toFixed(2) : `${msg.value}`;
      }
    },
    /**
     * Updates the topics table with `msg`, the new message.
     * @param {[key: string]: any} msg The new message to update the table with
     */
    update(msg: Message) {
      const topicName: string = msg.topic;
      const topics = this.topics;
      const topic = topics.find((t: Topic) => t.name === topicName);
      if (topic) {
        topic.value = this.formatValue(msg);
      } else {
        // Add new row to table
        this.topics.push({
          id: topicId++,
          name: topicName,
          value: this.formatValue(msg)
        });
      }
    }
  },
  created() {
    // const ros = new ROSLIB.Ros({
    //   url: 'ws://192.168.12.1:8448/updates'
    // });
    // ros.on('connection', () => {
    //   this.isDisconnected = false;
    //   this.isConnecting = false;
    // });
    // ros.on('error', (error) => {
    //   this.isDisconnected = true;
    //   this.isConnecting = false;
    //   console.log('Error connecting to websocket server:', error);
    // });
    // ros.on('close', () => {
    //   this.isDisconnected = true;
    //   this.isConnecting = false;
    //   console.log('Connection to Pi closed');
    // });

    // // Subscribing to a Topic
    // const heading = new ROSLIB.Topic({
    //   ros: ros,
    //   name: '/heading',
    //   messageType: 'std_msgs/Float32'
    // });

    // heading.subscribe(function (message) {
    //   console.log('Received message on', heading.name + ':', message);
    //   heading.unsubscribe();
    // });

    const app = this;
    const ws = new WebSocket(`ws://192.168.12.1:8448/updates`);
    ws.onopen = function (this: WebSocket, event: Event) {
      app.isDisconnected = false;
      app.isConnecting = false;
      console.log('Connection made');
    };
    ws.onmessage = function (event) {
      const jsonMsg = JSON.parse(event.data);
      if (jsonMsg.topic === '/rosout') {
        // Don't touch /rosout for now
        // app.topics.push(jsonMsg);
      } else {
        topicsTable.update(jsonMsg);
        // const updateCompassHand = topicHandlers[jsonMsg.topic];
        // if (updateCompassHand) {
        //   updateCompassHand(jsonMsg.value);
        // }
      }
    };
    ws.onerror = function (error) {
      // connectionOverlays.isConnecting = false;
      // connectionOverlays.isDisconnected = true;
      console.log('Error connecting', error);
    };
    ws.onclose = function (event) {
      // connectionOverlays.isConnecting = false;
      // connectionOverlays.isDisconnected = true;
      console.log('Connection closed');
    };

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
