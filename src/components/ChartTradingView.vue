<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { createChart } from 'lightweight-charts';
import * as stock_data from "@/data_test/stock.js";
import {smaMultilinesIndicator} from "@/indicators/sma-multilines-indicators.ts";

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
  // display the whole data
  // chart.timeScale().fitContent();

  const startTime = '2020-01-01'; // Heure de début
  const endTime = '2023-09-01';   // Heure de fin
  chart.timeScale().setVisibleRange({
    from: startTime,
    to: endTime,
  });


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


// Gérez le redimensionnement de la fenêtre en utilisant le gestionnaire d'événements "resize"
window.addEventListener('resize', () => {
  // Appelez la méthode "resize" de la charte pour ajuster la taille du graphique
  chart.resize(
    window.innerWidth, // Nouvelle largeur du graphique
    window.innerHeight // Nouvelle hauteur du graphique
  );
});

</script>



<style scoped lang="scss">
.lw-chart {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: red;
}
</style>
../../../indicators/sma-multilines-indicators.js