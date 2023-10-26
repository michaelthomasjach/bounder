export default class ChartUtils {
    static drawPrice = (chart: any, values: any) => {
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
            priceLineVisible: false
        });
        candlestickSeries.setData(values);
        return candlestickSeries;
    }

    static drawSMA = (chart: any, values: any) =>  {
        const sma_series = chart.addLineSeries({ color: "red", lineWidth: 2, priceLineVisible: false});
        const sma_data   = values
          .filter((d: any) => d.sma)
          .map((d: any) => ({time: d.time, value: d.sma}));
        sma_series.setData(sma_data);
    }  

    static drawSupertrend = (chart: any, values: any) =>  {
        const supertrend_series = chart.addLineSeries({ color: "red", lineWidth: 2, priceLineVisible: false});
        const sma_data   = values
          .filter((d: any) => d.supertrend)
          .map((d: any) => ({time: d.time, value: d.supertrend.value}));
        supertrend_series.setData(sma_data);
    }  

    static drawSupertrendTrend = (chart: any, values: any) =>  {
        const supertrend_series = chart.addLineSeries({ color: "red", lineWidth: 2, priceLineVisible: false});
        let sma_data   = values
          .filter((d: any) => d.supertrend)
          .map((d: any) => ({time: d.time, value: d.supertrend.trend != "" ? d.supertrend.trend : 0}));

        const diff = values.length - sma_data.length;
        const emptyArray: any[] = [...new Array(diff)].map(d => {});

        for (let i = 0; i < emptyArray.length; i++) {
            emptyArray[i] = {
                time: values[i].time,
                supertrend: {
                    trend: 0,
                    value: 0
                }
            }
        }
        sma_data = [...emptyArray, ...sma_data];
        supertrend_series.setData(sma_data);
    } 

    static drawConditionShortOrLongOk = (chart: any, values: any) =>  {
        const condition_series = chart.addLineSeries({ color: "green", lineWidth: 2, priceLineVisible: false});
        const conditionOkLine   = values
          .filter((d: any) => d.supertrend)
          .map((d: any) => ({time: d.time, value: d.longConditionOk == true ? 1 : d.shortConditionOk == true ? -1 : 0}));

        condition_series.setData(conditionOkLine);
    } 

    static drawEMA = (chart: any, values: any) =>  {
        const ema_series = chart.addLineSeries({ color: "green", lineWidth: 2, priceLineVisible: false});
        const ema_data   = values
        .filter((d: any) => d.ema)
        .map((d: any) => ({time: d.time, value: d.ema}));
        ema_series.setData(ema_data);
    }  

    static drawDoubleEMA = (chart: any, values: any) =>  {
        const ema_series = chart.addLineSeries({ color: "purple", lineWidth: 2, priceLineVisible: false});
        const dema_data   = values
        .filter((d: any) => d.dema)
        .map((d: any) => ({time: d.time, value: d.dema}));
        ema_series.setData(dema_data);
    }  

    static drawMarkers = (series: any, values: any) =>  {
        const markers: any[] = values
        .filter((d: any) => d.longConditionOk || d.shortConditionOk)
        .map((d: any, i: number) => {
            const marker = d.longConditionOk
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
        series.setMarkers(markers);
    }  
    
    static drawThreeLineBreakCandle = (chart: any, values: any) => {
        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a', downColor: '#ef5350', borderVisible: false,
            wickUpColor: '#26a69a', wickDownColor: '#ef5350',
            priceLineVisible: false
        });
        const three_line_break_data   = values
            .filter((d: any) => d.three_line_break)
            .map((d: any) => ({time: d.three_line_break.time, open: d.three_line_break.open, close: d.three_line_break.close, low: d.three_line_break.open, high: d.three_line_break.close}));
        candlestickSeries.setData(three_line_break_data);
    }

    static drawThreeLineBreakLine = (chart: any, values: any) => {
        const three_line_break_data_forLine   = values
            .filter((d: any) => d.three_line_break)
            .map((d: any) => ({time: d.three_line_break.time, value: d.three_line_break.close}));
      const three_line_break_series = chart.addLineSeries({ color: "orange", lineWidth: 3, priceLineVisible: false});
      three_line_break_series.setData(three_line_break_data_forLine);
    
    }

    static drawConditionalBackground = (chart: any, values: any) => {
        const histogramSeries = chart.addHistogramSeries({
            priceScaleId: "cpcid1", // Échelle des prix à utiliser (par exemple, "right" pour l'axe de droite)
            base: 1, // Niveau de base pour les histogrammes
            priceLineVisible: false,
        });
        
        const conditionalBackgroundData = values.map((d: any, i: number) => {
            return i < 8000
            ? { time: d.time, value: 0, color: "rgba(255, 0, 0, 0.05)"}
            : i < 8500
                ? { time: d.time, value: 0, color: "rgba(0, 255, 0, 0.05)" }
                : { time: d.time, value: 0, color: "rgba(0, 255, 0, 0)" }
        });
          
        histogramSeries.setData(conditionalBackgroundData);
    
        chart
            .priceScale("cpcid1")
            .applyOptions({
            scaleMargin: {
                bottom: 0, 
                top: 0,
                priceLineVisible: false
            }
        });
}


    static synchronizeMovements = (chart: any, chart1: any) => {
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
    }
}




