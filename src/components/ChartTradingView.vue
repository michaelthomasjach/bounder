<template>
  <div class="lw-chart" ref="chartContainer"></div>
  <div class="lw-chart-1" ref="chartContainer1"></div>

</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { createChart } from 'lightweight-charts';
import axios from "axios";
import ChartUtils from "./chart/ChartUtils.ts";

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

 
  ChartUtils.drawPrice(chart, values);
  ChartUtils.drawSMA(chart, values);
  ChartUtils.drawEMA(chart, values);
  ChartUtils.drawThreeLineBreakCandle(chart1, values);
  ChartUtils.drawThreeLineBreakLine(chart, values);
  ChartUtils.drawConditionalBackground(chart, values);    
  ChartUtils.synchronizeMovements(chart, chart1);





  
/*
  candlestickSeries.setMarkers([{
        time: values[values.length - 100].time,
        position: "aboveBar",
        color: "red",
        shape: "arrowDown",
        text: "Sell @"
    }]);
*/

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
const markers: any[] = values
  .filter((d: any) => d.long || d.short)
  .map((d: any, i: number) => {
    const marker = d.long
    ? {
      time: d.time,
      close: d.close,
      stop: d.stop,
      take_profit: d.take_profit,
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
      stop: d.stop,
      take_profit: d.take_profit,
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


console.log("associations");
console.log(associations);


/** FAIRE APPARAITRE LE STOP SUIVEUR SUR LE GRAPHIQUE */
/*
const valueWithStop: any[] = values.filter((value: any) => value.stop_suiveur != null);
console.log("valueWithStop", valueWithStop)
const stopSuiveur = valueWithStop.map((d: any, i: any, arr: any[]) => {
  return {time: d.time, value: d.stop_suiveur}
})
console.log("stopSuiveur", stopSuiveur)
stopSuiveur.forEach((line: any, index: number) => {
  const lineSeriesSL = chart.addLineSeries({ lastValueVisible: false, color: "red", lineWidth: 1, priceLineVisible: false});
  lineSeriesSL.setData(line);
})
*/






const linesTKandSL: any[]   = associations
  .map((d: any) => {
    const longDate  = new Date(d.long.time.year, d.long.time.month - 1, d.long.time.day);
    const shortDate = new Date(d.short.time.year, d.short.time.month - 1, d.short.time.day);

    let SL: any[] = [];
    let TK: any[] = [];
    if (longDate < shortDate) {
      SL = [
        {
          time: d.long.time,
          value: d.long.stop
        },
        {
          time: d.short.time,
          value: d.long.stop
        },
      ];
      TK = [
        {
          time: d.long.time,
          value: d.long.take_profit
        },
        {
          time: d.short.time,
          value: d.long.take_profit
        },
      ];
    } else {
      SL = [
        {
          time: d.short.time,
          value: d.short.stop
        },
        {
          time: d.long.time,
          value: d.short.stop
        },
      ];
      TK = [
        {
          time: d.short.time,
          value: d.short.take_profit
        },
        {
          time: d.long.time,
          value: d.short.take_profit
        },
      ];
    }

    return {SL, TK};
  });



linesTKandSL.forEach((line: any, index: number) => {
  const lineSeriesSL = chart.addLineSeries({ lastValueVisible: false, color: "red", lineWidth: 1, priceLineVisible: false});
  lineSeriesSL.setData(line.SL);
  const lineSeriesTK = chart.addLineSeries({ lastValueVisible: false, color: "green", lineWidth: 1, priceLineVisible: false});
  lineSeriesTK.setData(line.TK);
})

/*
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

  lines.forEach((line: any, index: number) => {
    const lineSeries = chart.addLineSeries({ lastValueVisible: false, color: "yellow", lineWidth: 5, priceLineVisible: false});
    lineSeries.setData(line);
  })
  
  // Affichez les associations long/short
  
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////







  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  // add histogram series
  // https://www.youtube.com/watch?v=2nxj4aLBhgo&ab_channel=DeKay
  //6:41
  
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////



  

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



export interface ILineSerie {
  value: number;
  time: String;
}


// Auto resizes the chart when the browser window is resized.
const resizeHandler = (container: any) => {
	if (!chart || !container) return;
	const dimensions = container.getBoundingClientRect();
	chart.resize(dimensions.width, dimensions.height);
};


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
