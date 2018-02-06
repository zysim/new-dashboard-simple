<template>

  <table class="table table-striped table-bordered">
    <thead class="thead-inverse">
      <th>Hand</th>
      <th>Bearing</th>
    </thead>
    <tbody>
      <tr v-for="(c, index) of compasses" :key="index">
        <th scope="row">{{c.name.replace(/_.+/, '')}}</th>
        <td>{{c.bearing}}°</td>
      </tr>
    </tbody>
  </table>

</template>

<script lang="ts">
interface Compass {
  name: string,
  bearing: number
};

export default {
  props: {
    compasses: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss">

</style>
