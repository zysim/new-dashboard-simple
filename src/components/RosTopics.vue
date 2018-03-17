<template>

  <div>
    <h2>ROS Topics⛵️</h2>

    <table id="topics-table" class="table table-striped table-bordered">
      <thead class="thead-inverse">
        <th v-for="h in headers" :key="h">{{h}}</th>
      </thead>
      <tbody>
        <tr v-for="t in sortedTopics" :key="t.id">
          <th scope="row">{{t.name}}</th>
          <td class="text-right">{{t.value}}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script lang="ts">
interface Topic {
  id: number,
  name: string,
  value: string | number
};

interface Message {
  latitude?: number,
  longitude?: number,
  topic: string,
  value: number | string
};

class TopicConstructor implements Topic {
  readonly id: number;
  readonly name: string;
  readonly value: string | number;

  constructor(id: number, name: string, value: string | number) {
    this.id = id;
    this.name = name;
    this.value = value;
  }
}

import Vue from 'vue';
import spaceIt from '../utilities/spaceIt';

const testTopics: Topic[] = [
  {
    id: 1,
    name: 'test_string_that\'s_hella_long_test_string_that\'s_hella_long_test_string_that\'s_hella_long_test_string_that\'s_hella_long_',
    value: 100
  },
  {
    id: 2,
    name: 'Another_topic_name_but_this_one_ain\'t_as_long',
    value: 'Henlo'
  }
];

let topicId = 0;

export default Vue.component('ros-topics', {
  props: {
    topics: {
      type: Array,
      validator: (ts: Topic[]) => ts.filter(t => !(t instanceof TopicConstructor)).length === 0,
      required: true,
      default(): Topic[] {
        return testTopics;
      }
    }
  },
  data(): {headers: string[], topics: Topic[]} {
    return {
      headers: ['Topic', 'Value'],
      topics: this.topics as Topic[],
    }
  },
  computed: {
    /**
     * Sorts the topics alphabetically, then adds a zero-width space U+200B
     * after every underscore. This is to ensure long topic names break nicely
     * and not run past the width of its column.
     */
    sortedTopics(): Topic[] {
      return this.topics.sort((a: Topic, b: Topic) => {
        return (a.name.localeCompare(b.name) > 0) ? 1 :
          (a.name.localeCompare(b.name) === 0) ? 0 :
          -1
      }).map((topic: Topic) => {
        // Adding zero-width space after every underscore to aid line-breaking
        topic.name = spaceIt(topic.name, '_'); // Could also add <wbr>
        return topic;
      });
    }
  },
  methods: {
    /**
     * Formats the value in `msg`. Only used by `update()`.
     * @param {[key: string]: any} msg The message object to format
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
      const topic = this.topics.find((t: Topic) => t.name === topicName);
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
  }
});
</script>

<style>
</style>
