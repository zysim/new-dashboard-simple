<template>

  <div>
    <div class="row">
      <div class="col-md-12">
        <h2>Compass🌊</h2>
        <compass-table :compasses="compasses"></compass-table>
      </div>
    </div>
    <div class="row">
      <compass-hands :compasses="compasses"></compass-hands>
      <!-- <div class="p-3 mx-auto" v-for="(c, index) of compasses" :key="index">
        <compass-hand :compass="c"></compass-hand>
      </div> -->
    </div>
  </div>

</template>

<script lang="ts">
interface Compass {
  readonly name: string,
  readonly bearing: number
};

import CompassHands from './CompassHands.vue';
import CompassTable from './CompassTable.vue';

const testCompasses: Compass[] = [
  {
    name: 'goal_hand',
    bearing: 0
  },
  {
    name: 'heading_hand',
    bearing: 0
  },
  {
    name: 'waypoint_hand',
    bearing: 0
  },
  {
    name: 'wind_hand',
    bearing: 0
  }
];

export default {
  prop: {
    compasses: {
      type: Array as () => Compass[],
      validator: (cs: Compass[]) => cs.filter(c => !(c instanceof (Object as () => Compass))).length === 0,
      required: true,
      default: testCompasses
    }
  },
  data() {
    return {
      compasses: testCompasses
    }
  },
  components: {
    CompassHands,
    CompassTable
  }
}
</script>

<style lang="scss">
@import "../../node_modules/bootstrap/scss/bootstrap.scss";

</style>
