<template>

  <div>
    <div class="row">
      <div class="col-md-12">
        <h2>Compass🌊</h2>
        <compass-table :compasses="compasses"></compass-table>
      </div>
    </div>
      <div class="row" id="compass-hands">
        <div class="col-md-6 col-sm-12 container"><img src="../assets/goal_hand.svg" :style="spinEm('Goal')"></div>
        <div class="col-md-6 col-sm-12 container"><img src="../assets/heading_hand.svg" :style="spinEm('Heading')"></div>
        <div class="col-md-6 col-sm-12 container"><img src="../assets/waypoint_hand.svg" :style="spinEm('Waypoint')"></div>
        <div class="col-md-6 col-sm-12 container"><img src="../assets/wind_hand.svg" :style="spinEm('Wind')"></div>
      </div>
  </div>

</template>

<script lang="ts">
interface Compass {
  readonly name: string,
  readonly bearing: number
};

import CompassTable from './CompassTable.vue';
import Vue from 'vue';

export default Vue.component('magic-compass', {
  props: {
    compasses: {
      type: Array as () => Compass[],
      validator: (cs: Compass[]) => cs.filter(c => !(c instanceof (Object as () => Compass))).length === 0,
      required: true
    }
  },
  components: {
    CompassTable
  },
  methods: {
    spinEm(name: string): {transform: string} {
      const compass = this.compasses.find(c => c.name === name);
      // If `compass` exists in `this.compasses`, rotate the appropriate SVG
      if (<Compass>compass) {
        return Object.assign(Object.create(null), {
          transform: `rotate(${(<Compass>compass).bearing}deg`
        });
      }
      // Else, dim the compass
      return Object.assign(Object.create(null), {
        opacity: '0.5'
      });
    }
  }
}) ;

</script>

<style lang="scss">
@import "../../node_modules/bootstrap/scss/bootstrap.scss";
#compass-hands {
  .container {
    border: 1px solid grey;
    border-radius: 50%;
    img {
      height: 50%;
      transform-origin: bottom center;
    }
  }
}
</style>
