<template>

  <div id="rosout-table">
    <ul v-if="showMessagesForLevel.length">
      <li v-for="(m, index) of showMessagesForLevel" class="text-left" :class="getLogClass(m.level)" :key="index">
        {{ m.msg }}
      </li>
    </ul>
    <p v-else class="no-messages">🚫 No messages to display for this level yet. 🚫</p>
  </div>

</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import Constants from '../utilities/constants';
import { LogMessage } from '../utilities/interfaces';

const D = false; // Debug flag for testing

// Define a "prototype" array for `recentMessages` in `data()`
// So I can actually get recentMessages: Message[]
const initMessages: LogMessage[] = [
  { level: 1,  msg: "Test with level 1"  },
  { level: 2,  msg: "Test with level 2"  },
  { level: 4,  msg: "Test with level 4"  },
  { level: 8,  msg: "Test with level 8"  },
  { level: 16, msg: "Test with level 16" }
];

export default Vue.component('rosout-table', {
  props: {
    displayLevel: {
      type: Number,
      default: 1 // Debug aka 2^0 aka 1 << 0
    },
    // Gotta manually cast this one prop here because of a bug in TS v2.7.
    // Workaround taken from here: https://github.com/vuejs/vue/issues/7640
    messages: {
      type: Array as () => LogMessage[],
    } as PropOptions<any>
  },
  computed: {
    /**
     * Gets the messages, filtered by their level, to be displayed to the user
     * @returns {Message[]} The messages filtered by `displayLevel`
     */
    showMessagesForLevel(): LogMessage[] {
      return this.messages
        .filter((m: LogMessage) => m.level >= this.displayLevel);
    }
  },
  methods: {
    /**
     * Gets the class name for this log message.
     * @param {number} level The log level for this message. Will be specified by
     *                       the LogMessage object
     * @return {string} The class name corresponding to the level
     */
    getLogClass(level: number): string {
      return Constants.LOG_LEVELS_ARRAY[Math.log2(level)].toLowerCase();
    }
  }
});
</script>

<style lang="scss" scoped>
@import "../scss/rosout.scss";

#rosout-table {
  height: 500px;
  overflow-y: scroll;
  border-radius: 0px 5px 5px 5px;
  ul{
    padding: 0px;
    li {
      padding: 1em 0.5em;
      border-bottom: 1px solid grey;
      list-style-type: none;
      font-weight: bold;
      &.debug {
        color: $debug;
      }
      &.info {
        color: darken($info, 30%);
      }
      &.warn {
        color: $warn;
      }
      &.error {
        color: $error;
      }
      &.fatal {
        color: $fatal;
    }
    }
  }
  .no-messages {
    color: white;
    background-color: rgba(73, 57, 33, 0.6);
    padding: 2em 0em 2em 0em;
  }
}
</style>
