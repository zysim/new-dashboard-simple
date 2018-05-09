<template>

  <div>
    <h2>ROS Topics⛵️</h2>

    <table id="topics-table" class="table table-striped table-bordered">
      <thead class="thead-inverse">
        <th>Topic</th>
        <th>Value</th>
      </thead>
      <tbody>
        <tr v-for="t in sortedTopics" :key="t.id">
          <th scope="row">{{t.name}}</th>
          <td>{{t.value}}</td>
        </tr>
      </tbody>
    </table>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import lineBreakIt from '../utilities/lineBreakIt';
import {Topic} from '../utilities/interfaces';

// Test ROS topics. These are mainly used to check line breaking in the table
const testTopics: Topic[] = [
  {
    id: 1,
    name: `test_string_that\'s_hella_long_test_string_that\'s_hella_long_test_string
          _that\'s_hella_long_test_string_that\'s_hella_long_`,
    value: 100
  },
  {
    id: 2,
    name: 'Another_topic_name_but_this_one_ain\'t_as_long',
    value: 'Henlo'
  }
];

export default Vue.component('ros-topics', {
  props: {
    topics: {
      type: Array as () => Topic[],
      required: true,
      default(): Topic[] {
        return testTopics;
      }
    }
  },
  computed: {
    /**
     * Sorts the topics alphabetically, then adds a zero-width space U+200B
     * after every underscore. This is to ensure long topic names break nicely
     * and not run past the width of its column.
     *
     * @return {Topic[]} The ROS topics received from the Pi sorted
     * alphabetically.
     */
    sortedTopics(): Topic[] {
      return this.topics.slice().sort((a: Topic, b: Topic) => {
        return (a.name.localeCompare(b.name) > 0) ? 1 :
          (a.name.localeCompare(b.name) === 0) ? 0 :
          -1
      }).map((topic: Topic) => {
        // Adding zero-width space after every underscore to aid line-breaking
        topic.name = lineBreakIt(topic.name, '_'); // Could also add <wbr>
        return topic;
      });
    }
  }
});
</script>

<style lang="scss" scoped>
table#topics-table {
  th {
    width: 50%;
  }
}
</style>
