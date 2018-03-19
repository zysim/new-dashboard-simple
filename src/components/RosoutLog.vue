<template>

  <div>
    <h2>/rosout🤖</h2>
    <!-- <button class="btn btn-info" @click="togglePause">{{pauseLoggingText}}</button> -->
    <button v-if="D" @click="sendMessage()">DEBUG: Send a message</button>
    <button v-if="D" @click="clearMessages()">DEBUG: Clear all messages</button>
    <ul class="nav nav-tabs" id="rosout-log-level-labels">
      <li class="nav-item" v-for="(l, index) of levels" :key="index" :id="`rosout-level-${l.toLowerCase()}`" @click.prevent="activeLevel = (1 << index)">
        <a class="nav-link" :class="levelClass(1 << index)" href="/">{{ l }}</a>
      </li>
    </ul>
    <rosout-table id="rosout-display" :display-level="activeLevel" :new-message="newMessage"></rosout-table>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import RosoutTable from './RosoutTable.vue';

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
      levels: ['Debug', 'Info', 'Warn', 'Error', 'Fatal']
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
    },
    levelClass(level: Number) {
      return {
        'bg-primary'  : level === 1, // Debug
        'bg-success'  : level === 2, // Info
        'bg-warning'  : level === 4, // Warn
        'bg-danger'   : level === 8, // Error
        'bg-secondary': level === 16 // Fatal
      };
    }
  },
  components: {
    RosoutTable
  }
});
</script>

<style lang="scss">
#rosout-log-level-labels {
  a {
    color: white;
  }
}
</style>

