<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import ChartTradingView from './splash-components/breadcrumb/ChartTradingView.vue';
import { ref } from 'vue';

import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';
const counterStore = useCounterStore();
const { counters } = storeToRefs(useCounterStore());


//const add = counterStore.add(1);
const getHighNum = () => {
  if (counterStore.counters.length == 0) return 1;
  const high: number = counterStore.getHigherNumber;
  if (high == null) return 1;
  return high + 1;
}


</script>

<template>
  <ChartTradingView></ChartTradingView>
</template>
