<template>
  <img :src="source" class="compass-hand" :style="spinEm">
</template>

<script lang="ts">
import Vue from 'vue';

interface Compass {
  readonly name: string,
  readonly bearing: number
};

export default Vue.component('compass-hand', {
  props: {
    compass: {
      type: Object as () => Compass,
      default(): Compass {
        return {
          name: 'Test',
          bearing: 0
        };
      }
    }
  },
  computed: {
    source(): string {
      const name = this.compass.name.toLowerCase() + "_hand";
      return `../assets/${name}.svg`;
    },
    spinEm(): {transform: string} {
      return Object.assign(Object.create(null), {
        transform: `rotate(${this.compass.bearing}deg)`
      });
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
    // spinEm(): {transform: string} {
    //   return Object.assign(Object.create(null), {
    //     transform: `rotate(${this.compass.bearing}deg)`
    //   });
    // }
//   }
// });
<!-- </script> -->

<style lang="scss" scoped>
.compass-hand {
  height: 100%;
  transform-origin: bottom center;
  div.col-md-3 & {
    width: 25%;
    padding-top: 25%;
    padding-bottom: 25%;
  }
}
</style>
