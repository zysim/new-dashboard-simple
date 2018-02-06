<template>

  <div>
    <p v-for="m of getMessages" :class="logLevel(m)">
      <span v-once>{{ msg }}</span>
    </p>
  </div>

</template>

<script lang="ts">
interface Message {
  level: number,
  msg: string,
};

class MessageConstructor {
  readonly level: number;
  readonly msg: string;
  constructor(level: number, msg: string) {
    this.level = level;
    this.msg   = msg;
  }
}

import Vue from 'vue';

const rosoutTable = Vue.component('rosout-table', {
  props: {
    displayLevel: {
      type: Number,
      default: 4
    },
    newMessage: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      recentMessages: [] as Message[],
      recentMessagesMax: 1000, // Maximum number of messages to store in memory
    }
  },
  computed: {
    getMessages(): Message[] {
      // Check if message contained in 'new-message' prop is a new message
      if (this.newMessage !== this.recentMessages[this.recentMessages.length - 1]) {
        this.appendMsg(this.newMessage);
      }
      return this.recentMessages
        .filter(m => m.level >= this.displayLevel);
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
    appendMsg(m: Message) {
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

export default rosoutTable;
</script>

<style>

</style>
