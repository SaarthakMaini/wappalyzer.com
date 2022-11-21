<template>
  <v-sheet
    :class="`bar${dense ? ' bar--dense' : ''}`"
    color="primary lighten-1"
    rounded
  >
    <span class="bar__value bar__value--background"></span>
    <v-sheet
      :width="`${(100 / Math.max(1, max)) * value}%`"
      color="primary"
      class="bar__span white--text"
      :height="dense ? 4 : 14"
      rounded
    >
      <span class="bar__value bar__value--foreground"> </span>
      <span v-if="dense" class="bar__indicator"
        ><v-icon color="primary">{{ mdiChevronDown }}</v-icon></span
      >
    </v-sheet>

    <span v-if="!dense" class="bar__label">{{ percentage }}%</span>
  </v-sheet>
</template>

<script>
import { mdiChevronDown } from '@mdi/js'

export default {
  props: {
    total: {
      type: Number,
      default: 1,
    },
    max: {
      type: Number,
      default: 1,
    },
    value: {
      type: Number,
      default: 1,
    },
    dense: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    percentage() {
      const percentage = (100 / Math.max(1, this.total)) * this.value

      return percentage.toFixed(
        percentage <= 0.9 ? (percentage <= 0.09 ? 2 : 1) : 0
      )
    },
  },
  data() {
    return {
      mdiChevronDown,
    }
  },
}
</script>

<style>
.bar {
  position: relative;
}

.bar__value {
  white-space: nowrap;
  position: absolute;
  left: 0;
  top: 0;
}

.bar__span {
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
}

.bar__label {
  color: #fff;
  position: absolute;
  font-size: 0.6rem;
  line-height: 13px;
  left: 2px;
  top: 0;
  text-shadow: 0 1px 0 #4608ad;
}

.bar__indicator {
  position: absolute;
  right: -10px;
  top: -26px;
  height: 24px;
  width: 24px;
  z-index: 2;
}
</style>
