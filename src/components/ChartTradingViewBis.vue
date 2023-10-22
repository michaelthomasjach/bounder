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
    timeScale: {
      borderVisible: false,
    }
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
      timeScale: {
        visible: false,
        borderVisible: false,
        borderColor: "#181C27"
      },
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
  //chart.setXAxisVisible(false);

 
  ChartUtils.drawPrice(chart, values);
  ChartUtils.drawSupertrend(chart, values);


  chart.timeScale().setVisibleRange({
    from: values[0].time,
    to: values[values.length-1].time,
  });
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
