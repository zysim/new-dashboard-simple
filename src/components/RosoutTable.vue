<template>

  <div style="height: 300px; overflow: scroll;">
    <ul v-if="recentMessages.length">
      <li v-for="(m, index) of getMessages" class="new-message" :class="logLevel(m)" :key="index">
        <span>{{ m.level }}</span>
      </li>
    </ul>
    <p v-else class="no-messages">No messages to display just yet.</p>
  </div>

</template>

<script lang="ts">
import Vue, { PropOptions } from 'vue';

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
      recentMessages: initMessages.slice(0), // This workaround works I guess
      recentMessagesMax: 1000, // Maximum number of messages to store in memory
    }
  },
  computed: {
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
    logLevel(m: Message) {
      // Apply the appropriate colour to the log message
      return {
        debug: 1 & m.level,
        info: 2 & m.level,
        warn: 4 & m.level,
        error: 8 & m.level,
        fatal: 16 & m.level,
      }
    },
    appendMsg(m: Message): void {
      // Trim off the excess fats, plus an extra layer as we're about to add a
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

<style>
.no-messages {
  background: rgba(0, 0, 0, 0.7);
  list-style-type: none;
}
</style>
