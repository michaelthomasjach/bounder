<template>
  <div class="lw-chart" ref="chartContainer"></div>
  <div class="lw-chart-1" ref="chartContainer1"></div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { createChart } from 'lightweight-charts';
import {smaMultilinesIndicator} from "@/indicators/sma-multilines-indicators.ts";
import axios from "axios";

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



onMounted(async () => {
  const stock_data: any = await axios.get("http://localhost:3000/data");
  const values: any = stock_data.data;

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
    priceLineVisible: false
  });
  
  const candlestickSeries1 = chart1.addCandlestickSeries({
    upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
    wickUpColor: '#26a69a', wickDownColor: '#ef5350',
    priceLineVisible: false
  });


  // add histogram series
  // https://www.youtube.com/watch?v=2nxj4aLBhgo&ab_channel=DeKay
  //6:41
  chart.addHistogramSeries({

  })
  
  const sma_series = chart.addLineSeries({ color: "red", lineWidth: 2, priceLineVisible: false});
  const sma_data   = values
    .filter((d: any) => d.sma)
    .map((d: any) => ({time: d.time, value: d.sma}));
  sma_series.setData(sma_data);

  const ema_series = chart.addLineSeries({ color: "green", lineWidth: 2, priceLineVisible: false});
  const ema_data   = values
    .filter((d: any) => d.ema)
    .map((d: any) => ({time: d.time, value: d.ema}));
  ema_series.setData(ema_data);

  const priceLine = candlestickSeries.createPriceLine({ price: 6000.0 });



  // Afficher les valeurs sur le graphique
  candlestickSeries.setData(values);
  candlestickSeries1.setData(values);


  // S'abonner aux events du graphiques
  chart.subscribeCrosshairMove((range: any) => {
    const timeRange = chart.timeScale().getVisibleRange();
    const timeRangeLogical = chart.timeScale().getVisibleLogicalRange();
    
    chart1.timeScale().setVisibleRange({
        from: timeRange.from, // - (chart1.timeScale().width() / 2),
        to: timeRange.to, // + (chart1.timeScale().width() / 2),
    }); 
    chart1.timeScale().setVisibleLogicalRange({
        from: timeRangeLogical.from, // - (chart1.timeScale().width() / 2),
        to: timeRangeLogical.to, // + (chart1.timeScale().width() / 2),
    });
  });

  chart1.subscribeCrosshairMove((range: any) => {
    const timeRange = chart1.timeScale().getVisibleRange();
    const timeRangeLogical = chart1.timeScale().getVisibleLogicalRange();
    
    chart.timeScale().setVisibleRange({
        from: timeRange.from, // - (chart1.timeScale().width() / 2),
        to: timeRange.to, // + (chart1.timeScale().width() / 2),
    }); 
    chart.timeScale().setVisibleLogicalRange({
        from: timeRangeLogical.from, // - (chart1.timeScale().width() / 2),
        to: timeRangeLogical.to, // + (chart1.timeScale().width() / 2),
    });
  });
/*
  candlestickSeries.setMarkers([{
        time: values[values.length - 100].time,
        position: "aboveBar",
        color: "red",
        shape: "arrowDown",
        text: "Sell @"
    }]);
*/
const markers: any[] = values
  .filter((d: any) => d.long || d.short)
  .map((d: any, i: number) => {
    const marker = d.long
    ? {
      time: d.time,
      close: d.close,
      position: "belowBar",
      color: "green",
      shape: "arrowUp",
      text: "LONG @ " + i,// + Math.floor(d.low),
      id: i,
      type: "long"
    }
    : {
      time: d.time,
      close: d.close,
      position: "aboveBar",
      color: "red",
      shape: "arrowDown",
      text: "SHORT @ " + i,// + Math.floor(d.high),
      id: i,
      type: "short"
    }
    return marker;
  });
candlestickSeries.setMarkers(markers);
    

// Créez un tableau pour stocker les associations long/short
const associations: any[] = [];
let currentLong: any = null;
let currentShort: any = null;
markers.forEach((item: any) => {
  if (item.type === 'long') {
    if (currentShort) {
      // Si une position short est ouverte, associez-la au long actuel
      associations.push({ long: item, short: currentShort });
      currentShort = null; // Réinitialisez la position short
    } else {
      // Mettez à jour la position long actuelle
      currentLong = item;
    }
  } else if (item.type === 'short') {
    if (currentLong) {
      // Si une position long est ouverte, associez-la au short actuel
      associations.push({ long: currentLong, short: item });
      currentLong = null; // Réinitialisez la position long
    } else {
      // Mettez à jour la position short actuelle
      currentShort = item;
    }
  }
});

// Affichez les associations long/short
console.log("associations");
console.log(associations);



const lines: any[]   = associations
  .map((d: any) => {
    const line = [
      {
        time: d.long.time,
        value: d.long.close
      },
      {
        time: d.short.time,
        value: d.short.close
      },
    ];
    line.sort(compareByDate);
    return line;
  });

  associations.forEach((association: any, index: number) => {
    const lineSeries = chart.addLineSeries({ lastValueVisible: false, color: "yellow", lineWidth: 5, priceLineVisible: false});
    lineSeries.setData(lines[index]);
  })
  
  console.log(lines);
  //lineSeries.setData(lines[101]);

  // Dessiner une ligne oblique
  /*
  const lineSeries = chart.addLineSeries({
    lastValueVisible: false
  });
  const lineSeries1 = chart.addLineSeries({
    lastValueVisible: false
  });

  var tldata = [];
  tldata.push({
    time: values[values.length - 1000].time,
    value: values[values.length - 1000].close
  });
  tldata.push({
    time: values[values.length - 1].time,
    value: values[values.length - 1].close
  });
  lineSeries.setData(tldata);
  */

  chart.timeScale().setVisibleRange({
    from: values[0].time,
    to: values[values.length-1].time,
  });

  
  //smaMultilinesIndicator(values, chart);
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


const compareByDate = (a: any, b: any) => {
  // Convertissez les dates en objets Date pour comparer
  const dateA = new Date(a.time.year, a.time.month - 1, a.time.day);
  const dateB = new Date(b.time.year, b.time.month - 1, b.time.day);

  // Comparez les dates
  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
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
