<template>
  <img :src="source" :style="spinEm" :alt="altName" class="compass-hand">
</template>

<script lang="ts">
interface Compass {
  name: string,
  bearing: number
};

class CompassConstructor implements Compass {
  readonly name: string;
  readonly bearing: number;

  constructor(name: string, bearing: number) {
    this.name = name;
    this.bearing = bearing;
  }
}

import Vue from 'vue';

const compassHand = Vue.component('compass-hand', {
  props: {
    compass: {
      type: CompassConstructor,
      default: new CompassConstructor('N/A', Number.NEGATIVE_INFINITY)
    }
  },
  computed: {
    source(): string {
      return `../assets/${this.compass.name}.svg`;
    },
    altName(): string {
      return `Why isn't ${this.compass.name} loaded`;
    },
    spinEm(): {transform: string} {
      return Object.assign(Object.create(null), {
        transform: `rotate(${this.compass.bearing}deg)`
      });
    }
  }
});

export default compassHand;
</script>

<style scoped>
.compass-hand {
  height: 160px;
  transform-origin: bottom center;
}
</style>
