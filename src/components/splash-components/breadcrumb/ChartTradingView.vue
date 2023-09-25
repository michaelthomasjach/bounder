<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { createChart } from 'lightweight-charts';
import * as stock_data from "./stock.js";
import {smaMultilinesIndicator} from "./sma-multilines-indicators.ts";

let chart: any;
let series: any;
const chartContainer = ref();


const props = defineProps({
  type: {
    type: String,
    default: 'line',
  },
  data: {
    type: Array,
    required: true,
  },
  autosize: {
		default: true,
		type: Boolean,
	},
  chartOptions: {
    type: Object,
  },
  seriesOptions: {
    type: Object,
  },
  timeScaleOptions: {
		type: Object,
	},
	priceScaleOptions: {
		type: Object,
	},
});

onMounted(() => {
  const values: any = stock_data.stock;
  console.log(values)


  //chart = createChart(chartContainer.value, props.chartOptions);
  chart = createChart(chartContainer.value, 
  {
      layout: {
          background: { color: '#181C27' },
          textColor: '#DDD',
      },
      grid: {
          vertLines: { color: '#444' },
          horzLines: { color: '#444' },
      },
  });


  const candlestickSeries = chart.addCandlestickSeries({
    upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    wickUpColor: '#26a69a', wickDownColor: '#ef5350',
  });


  candlestickSeries.setData(values);
  chart.timeScale().fitContent();


  smaMultilinesIndicator(values, chart);
  

});

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
  if (series) {
    series = null;
  }
  window.removeEventListener('resize', resizeHandler);
});


// Auto resizes the chart when the browser window is resized.
const resizeHandler = (container: any) => {
	if (!chart || !container) return;
	const dimensions = container.getBoundingClientRect();
	chart.resize(dimensions.width, dimensions.height);
};




  



export interface ILineSerie {
  value: number;
  time: String;
}

</script>



<style scoped lang="scss">
.lw-chart {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: red;
}
</style>
