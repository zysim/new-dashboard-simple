<template>

  <table class="table table-striped table-bordered">
    <thead class="thead-inverse">
      <th>Hand</th>
      <th>Bearing</th>
    </thead>
    <tbody>
      <tr v-for="(c, index) of sanitisedCompasses" :key="index">
        <th>{{ c.name }}</th>
        <td>{{ c.bearing }}°</td>
      </tr>
    </tbody>
  </table>

</template>

<script lang="ts">
interface Compass {
  name: string,
  bearing: number
};

import Vue from 'vue';

export default Vue.component('compass-table', {
  props: {
    compasses: {
      type: Array as () => Compass[],
      default: () => []
    }
  },
  computed: {
    sanitisedCompasses(): Compass[] {
      return this.compasses.map(c => {
        c.name = c.name.replace(/^(\w)(\w+?)_.+$/, function(_: string, first: string, rest: string) {
          return first.toUpperCase() + rest;
        });
        c.bearing = Math.round(c.bearing * 1000) / 1000;
        return c;
      });
    }
  }
});
</script>

<style lang="scss" scoped>
table {
  // Force the left column of the table to have 40% width
  th:nth-child(1) {
    width: 40%;
  }
}
</style>
