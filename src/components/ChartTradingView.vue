<template>
  <div class="lw-chart" ref="chartContainer"></div>
  <div class="lw-chart-1" ref="chartContainer1"></div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { createChart } from 'lightweight-charts';
import * as stock_data from "@/data_test/stock.js";
import {smaMultilinesIndicator} from "@/indicators/sma-multilines-indicators.ts";

let chart: any;
let chart1: any;
let series: any;
const chartContainer = ref();
const chartContainer1 = ref();


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

  chart1 = createChart(chartContainer1.value, 
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
  const candlestickSeries1 = chart1.addCandlestickSeries({
    upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    wickUpColor: '#26a69a', wickDownColor: '#ef5350',
  });


  candlestickSeries.setData(values);
  candlestickSeries1.setData(values);

  // display the whole data
  // chart.timeScale().fitContent();

  const markers = [ ];
  // determining the dates for the 'buy' and 'sell' markers added below.
  const datesForMarkers = [
    values[values.length - 150], 
    values[values.length - 100],
    values[values.length - 39], 
    values[values.length - 19]
  ];
  let indexOfMinPrice = 0;
  for (let i = 1; i < datesForMarkers.length; i++) {
    if (datesForMarkers[i].high < datesForMarkers[indexOfMinPrice].high) {
      indexOfMinPrice = i;
    }
  }

  for (let i = 0; i < datesForMarkers.length; i++) {
    if (i !== indexOfMinPrice) {
      markers.push({
        time: datesForMarkers[i].time,
        position: 'aboveBar',
        color: '#e91e63',
        shape: 'arrowDown',
        text: 'Sell @ ' + Math.floor(datesForMarkers[i].high),
      });
    } else {
      markers.push({
        time: datesForMarkers[i].time,
        position: 'belowBar',
        color: '#2196F3',
        shape: 'arrowUp',
        text: 'Buy @ ' + Math.floor(datesForMarkers[i].low),
      });
    }
  }
  candlestickSeries.setMarkers(markers);

  /*
  const orderAnnotation = chart.createShapeAnnotation({
    time: '2023-04-24T11:00:00', // Heure de l'ordre d'achat
    price: 6800, // Prix de l'ordre d'achat
    color: 'green', // Couleur de l'annotation
    shape: 'arrowUp', // Forme de l'annotation (flèche vers le haut)
    text: 'Achat', // Texte de l'annotation
    textFontSize: 20, // Taille de police du texte
  });

  chart.addAnnotation(orderAnnotation);
  */


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
  height: 75%;
  background-color: red;
}
.lw-chart-1 {
  position: relative;
  width: 100%;
  height: 25%;
  background-color: red;
}
</style>
../../../indicators/sma-multilines-indicators.js