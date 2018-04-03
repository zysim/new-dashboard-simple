<template>

  <div id="rosout-log">
    <h2>/rosout🤖</h2>
    <!-- <button class="btn btn-info" @click="togglePause">{{pauseLoggingText}}</button> -->
    <button v-if="D" @click="sendMessage()">DEBUG: Send a message</button>
    <button v-if="D" @click="clearMessages()">DEBUG: Clear all messages</button>
    <ul class="nav nav-tabs border-dark" id="nav-labels">
      <li class="nav-item" v-for="(l, index) of levels" :key="index" :id="`rosout-level-${l.toLowerCase()}`" @click.prevent.stop="activeLevel = (1 << index)">
        <a class="nav-link" :class="getClassForLabel(index)" href="/">{{ l }}</a>
      </li>
    </ul>
    <rosout-table :display-level="activeLevel" :new-message="newMessage"></rosout-table>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import RosoutTable from './RosoutTable.vue';
import Constants from '../utilities/constants';

const D = true;

interface Message {
  readonly level: Number;
  readonly msg: String;
}

export default Vue.component('rosout-log', {
  data() {
    return {
      D: D,
      pauseLoggingText: 'Pause output',
      activeLevel: 4,
      newMessage: {level: 1, msg: 'Test message level 1'},
      levels: Constants.LOG_LEVELS
    };
  },
  methods: {
    /**
     * Applies the appropriate class name for the Rosout labels
     * @param {number} level The label's log level
     * @return {[key: string]: boolean} The class object for Vue to render
     */
    getClassForLabel(level: number): {[key: string]: boolean} {
      return {
        debug: level === 0,
        info: level === 1,
        warn: level === 2,
        error: level === 3,
        fatal: level === 4,
        active: Math.log2(this.activeLevel) === level
      }
    },
    /**
     * Debug method. Send a dummy message to logs.
     */
    sendMessage() {
      if (!D) return;
      const number = 1 << ~~(5 * Math.random());
      this.newMessage = {
        level: number,
        msg: `Test message with level: ${number}`
      };
    },
    /**
     * Debug method. Clear all messages from logs.
     */
    clearMessages() {
      if (!D) return;
      this.newMessage = {
        level: -1,
        msg: 'clear'
      };
    }
  },
  components: {
    RosoutTable
  }
});
</script>

<style lang="scss" scoped>
@import "../scss/rosout.scss";

:root {
  #nav-labels {
    .nav-item {
      .nav-link {
        color: white;
        // Individual colours for each label
        &.debug {
          background: $debug;
        }
        &.info {
          background: $info;
        }
        &.warn {
          background: $warn;
        }
        &.error {
          background: $error;
        }
        &.fatal {
          background: $fatal;
        }
        &.active {
          font-weight: bold;
        }
      }
    }
  }
}
</style>

