import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counters', {
  state: () => {
    return {
      counters: [] as Array<number>
    }
  },
  actions: {
    add(num: number) {
      this.counters.push(num)
    }
  },
  getters: {
    getHigherNumber: (state) => {
      return Math.max(...state.counters);
    }
  }
  
})
