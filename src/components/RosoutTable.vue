<template>

  <div id="rosout-table">
    <ul v-if="recentMessages.length">
      <li v-for="(m, index) of getMessages" :class="getLogClass(m.level)" :key="index">
        {{ m.msg }}
      </li>
    </ul>
    <p v-else class="no-messages">No messages to display just yet.</p>
  </div>

</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';
import Constants from '../utilities/constants';

interface Message {
  readonly level: number,
  readonly msg: string,
};

const D = true; // Debug flag for testing

// Define a "prototype" array for `recentMessages` in `data()`
// So I can actually get recentMessages: Message[]
const initMessages: Message[] = D? [
  { level: 1,  msg: "Test with level 1"  },
  { level: 2,  msg: "Test with level 2"  },
  { level: 4,  msg: "Test with level 4"  },
  { level: 8,  msg: "Test with level 8"  },
  { level: 16, msg: "Test with level 16" }
]
: [];

export default Vue.component('rosout-table', {
  props: {
    displayLevel: {
      type: Number,
      default: 1
    },
    // Gotta manually cast this one prop here because of a bug in TS v2.7.
    // Workaround taken from here: https://github.com/vuejs/vue/issues/7640
    newMessage: {
      type: Object as () => Message,
      default: {level: 1, msg: '<default_message>'}
    } as PropOptions<any>
  },
  data() {
    return {
      recentMessages: initMessages,
      recentMessagesMax: 1000, // Maximum number of messages to store in memory
    }
  },
  computed: {
    /**
     * Gets the messages, filtered by their level, to be displayed to the user
     * @returns The messages filtered by `displayLevel`
     */
    getMessages(): Message[] {
      // Debugging only; clear all messages if the incoming message says "clear"
      if (D && this.newMessage.level === -1) {
        this.recentMessages = initMessages.slice(0);
      }
      // Check if message contained in 'new-message' prop is a new message
      if (!this.recentMessages.length || this.newMessage.msg !== this.recentMessages[this.recentMessages.length - 1].msg) {
        this.appendMsg(this.newMessage);
      }
      return this.recentMessages
        .filter((m: Message) => m.level >= this.displayLevel);
    }
  },
  methods: {
    /** Gets the class name for this log message.
     * @param {number} level The log level for this message. Will be specified by
     *                       the Message object
     * @return {string} The class name corresponding to the level
     */
    getLogClass(level: number): string {
      return Constants.LOG_LEVELS[Math.log2(level)].toLowerCase();
    },
    /**
     * Appends the new message `m` to the message reservoir.
     * @param {Message} m The Message object to add to the warehouse
     */
    appendMsg(m: Message): void {
      // Trim off the excess fats + an extra layer as we're about to add a
      // fresh new piece
      if (this.recentMessages.length > this.recentMessagesMax) {
        const discard = this.recentMessages.length - this.recentMessagesMax;
        this.recentMessages = this.recentMessages.slice(discard + 1);
      }
      // Apply the new layer on top
      this.recentMessages.push(m);
      // Allow the flavours to rise to the top
      if (this.$el) {
        this.$el.scrollTop = this.$el.scrollHeight;
      }
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
      color: white;
      // text-align: left;
      padding: 1em 0.5em;
      list-style-type: none;
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
  .no-messages {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>
