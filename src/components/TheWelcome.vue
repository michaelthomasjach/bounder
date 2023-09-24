<script setup lang="ts">
import WelcomeItem from './WelcomeItem.vue'
import BreadcrumbComponent, { type ItemDefinition } from './splash-components/breadcrumb/BreadcrumbComponent.vue';
import ColorDefinition from './splash-components/breadcrumb/BreadcrumbComponent.vue';
import DocumentationIcon from './icons/IconDocumentation.vue'
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

const items: ItemDefinition[] = [
  {
    name: "Home",
    url: "#",
  },
  {
    name: "Continental",
    url: "#",
  },
  {
    name: "PROJET_001",
    url: "#",
  },
  {
    name: "LOT1",
    url: "#",
    active: true,
  },
];
</script>

<template>
  <BreadcrumbComponent
    class="breadcrumb"
    :items=items>
    </BreadcrumbComponent>
  <WelcomeItem>
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Documentation</template>

    Méthode 1
    <div 
      v-for="counter in counterStore.counters"
      :key="counter"
      >
      {{ counter }}
    </div>

    <!--{{ counterStore.getterCounter }}-->
    <button @click="counterStore.add(getHighNum())"> add </button>

    Méthode 2
    <div 
      v-for="counter in counters"
      :key="counter"
      >
      {{ counter }}
    </div>
  </WelcomeItem>
</template>
