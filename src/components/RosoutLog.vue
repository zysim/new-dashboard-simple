<template>

  <div id="rosout-log">
    <h2>/rosout🤖</h2>
    <!-- <button class="btn btn-info" @click="togglePause">{{pauseLoggingText}}</button> -->
    <button v-if="D" @click="sendMessage()">DEBUG: Send a message</button>
    <button v-if="D" @click="clearMessages()">DEBUG: Clear all messages</button>
    <ul class="nav nav-tabs" id="nav-labels">
      <li class="nav-item" v-for="(l, index) of levels" :key="index" :id="`rosout-level-${l.toLowerCase()}`" @click.prevent="activeLevel = (1 << index)">
        <a class="nav-link" :class="`${l.toLowerCase()}`" href="/">{{ l }}</a>
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
      newMessage: {level: 1, msg: 'Test message'},
      levels: Constants.LOG_LEVELS
    };
  },
  methods: {
    // Debug methods: They're only in use when the D flag is set
    sendMessage() {
      const number = 1 << ~~(5 * Math.random());
      this.newMessage = {
        level: number,
        msg: `Test message with level: ${number}`
      };
    },
    clearMessages() {
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
      }
    }
  }
}
</style>

