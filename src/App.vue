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
        <button class="btn btn-primary" v-if="D" @click="updateCompassDebug()">Update</button>
        <magic-compass :compasses="compasses"></magic-compass>
      </div>
    </div>

    <div class="row">
      <div class="col-md-12">
        <rosout-log :messages="logMessages"></rosout-log>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
'use strict';

import ConnectionOverlays from './components/ConnectionOverlays.vue';
import MagicCompass from './components/MagicCompass.vue';
import RosTopics from './components/RosTopics.vue';
import RosoutLog from './components/RosoutLog.vue';
import Vue from 'vue';
import * as ROSLIB from 'roslib';
import {Compass, Topic} from './utilities/interfaces';

/**
 * A ROS log message interface. This is for the messages received under the
 * '/rosout' topic name.
 * @prop {number} level The log level; one of {debug|info|warn|error|fatal}
 * @prop {string} msg   The log message
 */
interface LogMessage {
  readonly level: number;
  readonly msg: string;
};

/**
 * A ROS message interface
 * @prop {number?}       latitude  (Optional) The boat's current latitude
 * @prop {number?}       longitude (Optional) The boat's current longitude
 * @prop {string}        topic     The topic's title
 * @prop {number|string} value     The topic's value, or message
 */
interface RosTopicMessage {
  latitude?: number,
  longitude?: number,
  topic: string,
  value: number | string
};

// Debug flag, for testing glory
const D = false;

// Initialiser for the ROS Topics table at the top left corner of the page
const topics: Topic[] = [];

// Initialiser for the ROS log messages at the bottom of the page
const logMessages: LogMessage[] = [];

// Initialiser for the compasses at the top right corner of the page
let compasses: Compass[] = [
  { name: 'goal_hand', bearing: 0 },
  { name: 'heading_hand', bearing: 0 },
  { name: 'waypoint_hand', bearing: 0 },
  { name: 'wind_hand', bearing: 0 },
];

// Dictionary that maps the received compass names to the app's compass names
// The keys are the compass names as received from the Pi, while the values are the
// corresponding names for the same compasses in our app
const compassNameMap: {[receivedName: string]: string} = {
  '/heading': 'heading_hand',
  '/goal_heading': 'goal_hand',
  '/dbg_heading_to_waypoint': 'waypoint_hand',
  '/wind_direction_average': 'wind_hand'
};

export default Vue.component('app', {
  data() {
    return {
      D: D, // flag for debug mode
      compasses: compasses, // Compasses for the boat
      // Dictionary that maps the received compass names to the app's compass names
      compassNameMap: compassNameMap,
      isDisconnected: false,  // Flag that checks if we've disconnected from the Pi
      isConnecting: true, // Flag that checks if we're connecting to the Pi
      logMessages: logMessages, // ROS log messages from the Pi
      topics: topics, // ROS topics from the Pi
      topicId: 0, // Counter for Vue list indexing for the ROS topics table
    }
  },
  methods: {
    /**
     * Debug method. Update the compasses with a random bearing at every click.
     */
    updateCompassDebug() {
      if (!this.D) return;
      this.compasses.map((c: Compass) => {
        c.bearing = (c.bearing + 50 * Math.random()) % 360;
      });
    },
    /**
     * Updates the bearing of our compasses in both the table and the SVGs.
     * The existence of `compass` in our app is checked in `created`.
     * @param {Compass} compass The compass that was received from the Pi
     */
    updateCompassBearing(compass: Compass) {
      // Find our compass that matches what was received
      const compassToUpdate = this.compasses.find(c => c.name === compass.name);
      if (compassToUpdate) {
        // Update the bearing of our compass
        compassToUpdate.bearing = compass.bearing % 360;
      }
    },
    /**
     * Formats the value in `msg`. Only used by `updateRosTopics()`.
     * @param {RosTopicMessage} msg The message object to format
     */
    formatValueForRosTopics(msg: RosTopicMessage): string {
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
     * Updates the RosTopics table with `msg`, the new message.
     * @param {RosTopicMessage} msg The new message to update the table with
     */
    updateRosTopics(msg: RosTopicMessage) {
      const topicName: string = msg.topic;
      const topics = this.topics;
      // Check if the topic already exists in our table
      const topic = topics.find((t: Topic) => t.name === topicName);
      if (topic) {
        // The topic does exist. Update the topic with the message, `msg`
        topic.value = this.formatValueForRosTopics(msg);
      } else {
        // The topic doesn't exist. Add a new row to table
        this.topics.push({
          id: this.topicId++,
          name: topicName,
          value: this.formatValueForRosTopics(msg)
        });
      }
    }
  },
  created() {
    // Our initialisation point of our dashboard.
    // Start the websocket connection
    const app = this;
    const ws = new WebSocket(`ws://192.168.12.1:8448/updates`);
    ws.onopen = function (this: WebSocket, event: Event) {
      app.isDisconnected = false;
      app.isConnecting = false;
    };
    ws.onmessage = (event) => {
      // New data received. It'll be in JSON form. Parse the data and process
      const newData = JSON.parse(event.data);
      if (newData.topic === '/rosout') {
        // This data is a ROS log message destined for RosoutLog
        // Update `logMessages` with the new data
        this.logMessages.push(<LogMessage>newData);
      } else {
        // Check if the new data is a bearing update for a compass
        const potentialCompassBearingUpdate = this.compassNameMap[newData.topic];
        if (potentialCompassBearingUpdate) {
          // The new data is a bearing update for a compass. Update our
          // corresponding compass
          this.updateCompassBearing({
            name: newData.topic,
            bearing: <number>newData.value
          });
        } else {
          // This data is a ROS topic destined for RosTopics
          // Update `topics` the new data
          this.updateRosTopics(<RosTopicMessage>newData);
        }
      }
    };
    ws.onerror = function (error) {
      // The websocket connection has errored. Raise the flags
      app.isConnecting = false;
      app.isDisconnected = true;
      console.log('Error connecting', error);
    };
    ws.onclose = function (event) {
      // The websocket connection has closed. Also raise the flags, but differently
      app.isConnecting = false;
      app.isDisconnected = true;
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
