import { Exception } from "sass";
import {type ILineSerie, type ISerie} from "./ChartTradingView.vue";

export const createSMASeries = (fastestSMA: ILineSerie[], slowestSMA: ILineSerie[]) => {
  const series: ISerie[] = [];
  const smaSize = fastestSMA.length;
  const smaToCompareSize = slowestSMA.length;
  const deltaSize = Math.abs(smaSize - smaToCompareSize);
  if (smaSize < smaToCompareSize) { // SMA10 < SMA20 ==> SMA à moins d'items dans la liste car à besoin de plus de data pour générer la SMA.
    throw new Error("Le premier paramètre doit être la SMA la plus rapide. Exemple: createSMA(SMA10, SMA20)");
  } 
  if (smaSize == smaToCompareSize) {
    throw new Error("Impossible de comparer les mêmes valeurs !");
  }

  
  let serieToAdd: ILineSerie[] = [];
  let state = STATE.NULL;
  //console.log("fastestSMA size =", fastestSMA.length)
  fastestSMA.forEach((data: ILineSerie, index: number) => {
    //console.log("index < deltaSize = ", index < deltaSize)
    //console.log("serieToAdd =", serieToAdd)
    if (index < deltaSize) {
      // ajouter la valeur telle quelle sans couleur
      
    //console.log("state != STATE.NULL = ", state != STATE.NULL)
      if (state != STATE.NULL) {
        series.push({
          trend: TREND.NEUTRAL,
          values: serieToAdd
        });
        serieToAdd = [];
        state = STATE.NULL;
      }
      serieToAdd.push({value: data.value, time: data.time})
    } else if (data.value > slowestSMA[index - deltaSize].value) {
      // SMA10 est au dessus de SMA20
      // vert
      if (state != STATE.GREETER) {
        series.push({
          trend: TREND.NEGATIVE,
          values: serieToAdd
        });
        serieToAdd = [];
        serieToAdd.push({value: fastestSMA[index-1].value, time: fastestSMA[index-1].time})
        state = STATE.GREETER;
      }
      serieToAdd.push({value: data.value, time: data.time})
    } else {
      if (state != STATE.LOWER) {
        
        series.push({
          trend: TREND.POSITIVE,
          values: serieToAdd
        });
        serieToAdd = [];
        serieToAdd.push({value: fastestSMA[index-1].value, time: fastestSMA[index-1].time})
        state = STATE.LOWER;
      }
      serieToAdd.push({value: data.value, time: data.time})
    }
  });


  return series;
}

enum STATE {
  LOWER,
  GREETER,
  NULL
}

export enum TREND {
  POSITIVE,
  NEGATIVE,
  NEUTRAL,
}