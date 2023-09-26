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

  const timeScaleOptions = {
    rightOffset: 0, // Décalage à droite de l'échelle de temps
    barSpacing: 3,   // Espacement entre les barres de temps
    fixLeftEdge: false, // Fixe le bord gauche de l'échelle de temps (empêche l'échelle de temps d'aller au dela de la zone de temps des valeurs fournies)
    fixRightEdge: false, // Fixe le bord gauche de l'échelle de temps (empêche l'échelle de temps d'aller au dela de la zone de temps des valeurs fournies)
    lockVisibleTimeRangeOnResize: true, // Verrouille la plage de temps visible lors du redimensionnement
    rightBarStaysOnScroll: true, // Laisse la dernière barre à droite lors du défilement
  };

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
      timeScale: timeScaleOptions, // Utilisez les options de l'échelle de temps ici
      autoSize: true,

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
      timeScale: timeScaleOptions, // Utilisez les options de l'échelle de temps ici
      autoSize: true,

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


  chart.subscribeCrosshairMove((range: any) => {
    const timeRange = chart.timeScale().getVisibleRange();
    const timeRangeLogical = chart.timeScale().getVisibleLogicalRange();
    /*
    chart1.timeScale().setVisibleRange({
        from: timeRange.from, // - (chart1.timeScale().width() / 2),
        to: timeRange.to, // + (chart1.timeScale().width() / 2),
    });*/    
    chart1.timeScale().setVisibleLogicalRange({
        from: timeRangeLogical.from, // - (chart1.timeScale().width() / 2),
        to: timeRangeLogical.to, // + (chart1.timeScale().width() / 2),
    });
  });

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


  chart.timeScale().setVisibleRange({
    from: values[0].time,
    to: values[values.length-1].time,
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

const toTimestamp = (strDate: string) => {
   var datum = Date.parse(strDate);
   return datum/1000;
}

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
}
.lw-chart-1 {
  position: relative;
  width: 100%;
  height: 25%;
}
</style>
../../../indicators/sma-multilines-indicators.js