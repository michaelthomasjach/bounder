import { SMA } from "technicalindicators";

export const smaMultilinesIndicator = (values: any, chart: any) => {
    const sma10Line = chart.addLineSeries({ color: "rgb(243, 33, 33)", lineWidth: 1, priceLineVisible: false});
    const sma15Line = chart.addLineSeries({ color: "rgb(243, 33, 86)", lineWidth: 1, priceLineVisible: false});
    const sma20Line = chart.addLineSeries({ color: "rgb(243, 33, 149)", lineWidth: 1, priceLineVisible: false});
    const sma25Line = chart.addLineSeries({ color: "rgb(243, 33, 163)", lineWidth: 1, priceLineVisible: false});
    const sma30Line = chart.addLineSeries({ color: "rgb(243, 33, 198)", lineWidth: 1, priceLineVisible: false});
    const sma35Line = chart.addLineSeries({ color: "rgb(243, 33, 226)", lineWidth: 1, priceLineVisible: false});
    const sma40Line = chart.addLineSeries({ color: "rgb(201, 33, 243)", lineWidth: 1, priceLineVisible: false});
  
    const sma10 = SMA.calculate({period : 10, values : getPrices(values)});
    const sma15 = SMA.calculate({period : 15, values : getPrices(values)});
    const sma20 = SMA.calculate({period : 20, values : getPrices(values)});
    const sma25 = SMA.calculate({period : 25, values : getPrices(values)});
    const sma30 = SMA.calculate({period : 30, values : getPrices(values)});
    const sma35 = SMA.calculate({period : 35, values : getPrices(values)});
    const sma40 = SMA.calculate({period : 40, values : getPrices(values)});
  
  
    const sma10Series = constructLineSeries(sma10, 10, values);
    const sma15Series = constructLineSeries(sma15, 15, values);
    const sma20Series = constructLineSeries(sma20, 20, values);
    const sma25Series = constructLineSeries(sma25, 25, values);
    const sma30Series = constructLineSeries(sma30, 30, values);
    const sma35Series = constructLineSeries(sma35, 35, values);
    const sma40Series = constructLineSeries(sma40, 40, values);
  
  
    sma10Line.setData(sma10Series);
    sma15Line.setData(sma15Series);
    sma20Line.setData(sma20Series);
    sma25Line.setData(sma25Series);
    sma30Line.setData(sma30Series);
    sma35Line.setData(sma35Series);
    sma40Line.setData(sma40Series);
}

const constructLineSeries = function (smaValues: any[], periods: number, values: any) {
    let lineValues: any[] = [];
    smaValues.forEach((price: any, index: number) => {
        lineValues.push({value: price, time: values[index + (periods - 1)].time});
    });
    return lineValues;
}; 

const getPrices = function (values: any) {
    let prices: any[] = [];
    values.forEach((value: any) => {
        prices.push(value.close);
    });
    return prices;
};