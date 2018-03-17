<template>
  <div class="row">
    <div class="p-3 mx-auto"><img src="../assets/goal_hand.svg" alt="Why ain't it loading" :style="spinEm"></div>
    <div class="p-3 mx-auto"><img src="../assets/heading_hand.svg" alt="Why ain't it loading" :style="spinEm"></div>
    <div class="p-3 mx-auto"><img src="../assets/waypoint_hand.svg" alt="Why ain't it loading" :style="spinEm"></div>
    <div class="p-3 mx-auto"><img src="../assets/wind_hand.svg" alt="Why ain't it loading" :style="spinEm"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
// import goalHand from '../assets/goal_hand.svg';
// import headingHand from '../assets/heading_hand.svg';
// import waypointHand from '../assets/waypoint_hand.svg';
// import windHand from '../assets/wind_hand.svg';

export default Vue.component('compass-hand', {
  props: {
    compass: {
      type: Object,
      default: {
        name: 'Test',
        bearing: 30
      }
    }
  },
  computed: {
    source(): string {
      return `../assets/${this.compass.name}.svg`;
    }
  }
});

</script>

<!-- <script lang="ts"> -->
// interface Compass {
//   name: string,
//   bearing: number
// };

// class CompassConstructor implements Compass {
//   readonly name: string;
//   readonly bearing: number;

//   constructor(name: string, bearing: number) {
//     this.name = name;
//     this.bearing = bearing;
//   }
// }

// import Vue from 'vue';

// export default Vue.component('compass-hand', {
//   props: {
//     compass: {
//       type: CompassConstructor,
//       default: new CompassConstructor('N/A', Number.NEGATIVE_INFINITY)
//     }
//   },
//   computed: {
//     source(): string {
//       return this.compass.name;
//       // return goalHand;
//       // return '';
//     },
//     altName(): string {
//       return `Why isn't ${this.compass.name} loaded`;
//     },
//     spinEm(): {transform: string} {
//       return Object.assign(Object.create(null), {
//         transform: `rotate(${this.compass.bearing}deg)`
//       });
//     }
//   }
// });
<!-- </script> -->

<style scoped>
.compass-hand {
  height: 160px;
  transform-origin: bottom center;
}
</style>
