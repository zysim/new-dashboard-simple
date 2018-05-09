<template>

  <div id="rosout-log">
    <h2>/rosout🤖</h2>
    <button v-if="D" @click="DEBUG_sendMessage()">DEBUG: Send a message</button>
    <button class="btn btn-info" @click="togglePause">{{pauseLoggingText}}</button>
    <button class="btn btn-default border border-dark" @click="clearMessages">Clear</button>
    <ul class="nav nav-tabs border-dark" id="nav-labels">
      <li class="nav-item" v-for="(l, index) of levels" :key="index" :id="`rosout-level-${l.toLowerCase()}`" @click.prevent.stop="activeLevel = (1 << index)">
        <a class="nav-link" :class="getClassForLabel(index)" href="/">{{ l }}</a>
      </li>
    </ul>
    <rosout-table :display-level="activeLevel" :messages="logMessages"></rosout-table>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import RosoutTable from './RosoutTable.vue';
import Constants from '../utilities/constants';
import { LogMessage } from '../utilities/interfaces';

const D = false;

/**
 * This component displays the log messages received from the Pi.
 */
export default Vue.component('rosout-log', {
  props: {
    logMessages: {
      type: Array as () => LogMessage[],
      required: true,
      default: () => ({
        level: 0,
        msg: 'Test Message'
      })
    }
  },
  data() {
    return {
      D: D,
      pauseLoggingFlag: true, // To signal if we should pause receiving messages
      pauseLoggingText: 'Pause output',
      activeLevel: 4,
      levels: Constants.LOG_LEVELS_ARRAY,
    };
  },
  methods: {
    /**
     * Applies the appropriate class name for the Rosout labels
     * @param {number} level The label's log level
     * @return {[className: string]: boolean} The class object for Vue to render
     */
    getClassForLabel(level: number): {[className: string]: boolean} {
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
    DEBUG_sendMessage() {
      if (!D) return;
      const number = 1 << ~~(5 * Math.random());
      this.logMessages.push({
        level: number,
        msg: `Test message with level: ${number}`
      });
    },
    /**
     * Emits a signal to clear all log messages to App.
     */
    clearMessages() {
      this.$emit('clear');
    },
    /**
     * Toggles receiving new messages from the Pi.
     */
    togglePause() {
      this.$emit('pause', this.pauseLoggingFlag);
      this.pauseLoggingFlag = !this.pauseLoggingFlag;
      this.pauseLoggingText = `${this.pauseLoggingFlag? 'Pause' : 'Resume'} Logging`;
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
          border: 1px solid black;
        }
      }
    }
  }
}
</style>

