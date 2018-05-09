<template>
  <img :src="source" class="compass-hand" :style="spinEm">
</template>

<script lang="ts">
import Vue from 'vue';
import {Compass} from '../utilities/interfaces';

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
