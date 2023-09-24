<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue';
import { createChart } from 'lightweight-charts';
import * as stock_data from "./stock.js";
import { SMA } from "technicalindicators";
import { createSMASeries, TREND } from './indicators.ts';

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



// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type: String) {
	return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

// Creates the chart series and sets the data.
const addSeriesAndData = (props: any) => {
	const seriesConstructor = getChartSeriesConstructorName(props.type);
	series = chart[seriesConstructor](props.seriesOptions);
	series.setData(props.data);
};

// Auto resizes the chart when the browser window is resized.
const resizeHandler = (container: any) => {
	if (!chart || !container) return;
	const dimensions = container.getBoundingClientRect();
	chart.resize(dimensions.width, dimensions.height);
};

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
  const lineSeries10 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries15 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries20 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries25 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries30 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries35 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries40 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries45 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });
  const lineSeries50 = chart.addLineSeries({ color: 'red', lineWidth: 1, priceLineVisible: false, });













  candlestickSeries.setData(values);
  chart.timeScale().fitContent();

  const getPrices = function () {
    let prices: any[] = [];
    values.forEach((value: any) => {
      prices.push(value.close);
    });
    return prices;
  };

  const sma10 = SMA.calculate({period : 10, values : getPrices()});
  const sma15 = SMA.calculate({period : 15, values : getPrices()});
  const sma20 = SMA.calculate({period : 20, values : getPrices()});
  const sma25 = SMA.calculate({period : 25, values : getPrices()});
  const sma30 = SMA.calculate({period : 30, values : getPrices()});
  const sma35 = SMA.calculate({period : 35, values : getPrices()});
  const sma40 = SMA.calculate({period : 40, values : getPrices()});
  const sma45 = SMA.calculate({period : 45, values : getPrices()});
  const sma50 = SMA.calculate({period : 50, values : getPrices()});

  const constructLineSeries = function (smaValues: any[], periods: number) {
    let lineValues: any[] = [];
    smaValues.forEach((price: any, index: number) => {
      lineValues.push({value: price, time: values[index + (periods - 1)].time});
    });
    return lineValues;
  };  



  for (let i = 0; i < 2; i++) {
    const sma10Series = constructLineSeries(sma10, 10);
    const sma15Series = constructLineSeries(sma15, 15);
    const sma20Series = constructLineSeries(sma20, 20);
    const sma25Series = constructLineSeries(sma25, 25);
    const sma30Series = constructLineSeries(sma30, 30);
    const sma35Series = constructLineSeries(sma35, 35);
    const sma40Series = constructLineSeries(sma40, 40);
    const sma45Series = constructLineSeries(sma45, 45);
    const sma50Series = constructLineSeries(sma50, 50);  

    const lineSMA10: ISerie[]= createSMASeries(sma10Series, sma15Series);
    const lineSMA15: ISerie[]= createSMASeries(sma15Series, sma20Series);
    const lineSMA20: ISerie[]= createSMASeries(sma20Series, sma25Series);
    const lineSMA25: ISerie[]= createSMASeries(sma25Series, sma30Series);
    const lineSMA30: ISerie[]= createSMASeries(sma30Series, sma35Series);
    const lineSMA35: ISerie[]= createSMASeries(sma35Series, sma40Series);
    const lineSMA40: ISerie[]= createSMASeries(sma40Series, sma45Series);
    const lineSMA45: ISerie[]= createSMASeries(sma45Series, sma50Series);


    displaySMAOnChart(lineSMA10);
    displaySMAOnChart(lineSMA15);
    displaySMAOnChart(lineSMA20);
    displaySMAOnChart(lineSMA25);
    displaySMAOnChart(lineSMA30);
    displaySMAOnChart(lineSMA35);
    displaySMAOnChart(lineSMA45);
  }
 

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





function displaySMAOnChart(series: ISerie[]) {
  series.forEach((serie: ISerie) => {
      let color = "";
      if (serie.trend == TREND.POSITIVE) color = "green";
      if (serie.trend == TREND.NEGATIVE) color = "red";
      if (serie.trend == TREND.NEUTRAL) color = "grey";
      const s = chart.addLineSeries({ color, lineWidth: 1, priceLineVisible: false});
      s.setData(serie.values);
    })
}



function returnIndexesWhenCrossing(dataSeries1: any, dataSeries2: any) {
  let arr: number[] = [];
  const length = Math.min(dataSeries1.length, dataSeries2.length);
  
  for (let i = 0; i < length; i++) {
    const value1 = dataSeries1[i].value;
    const value2 = dataSeries2[i].value;

    // croise à la hausse
    if (value1 > value2) {
      arr.push(i);
    }
  }
  return arr;
}

export interface ILineSerie {
  value: number;
  time: String;
}

export interface ISerie {
  trend: TREND;
  values: ILineSerie[];
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
