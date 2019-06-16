import { useState, useCallback } from 'react';

// this hook processes raw api data and gives out processed data
export default function StockDataProcessor() {
  const [stocks, setStocks] = useState([]);
  const [dataProcessingError, setDataProcessingError] = useState('');

  const processStockData = useCallback((threeMonths) => {
    if (Boolean(threeMonths.data)) {
      try {
        const stockMap = new Map();
        Object.keys(threeMonths.data).forEach((key) => {
          for (let chart of threeMonths.data[key].chart) {
            if (stockMap.get(chart.date)) {
              let compData = stockMap.get(chart.date);
              compData[key] = chart.close;
              stockMap.set(chart.date, compData);
            } else stockMap.set(chart.date, { [key]: chart.close });
          }
        });
        console.log(stockMap);
        const stockArr = [];
        for (let mapObj of stockMap) {
          let stockObj = {};
          stockObj.date = mapObj[0];
          Object.keys(mapObj[1]).forEach((key) => {
            stockObj[key] = mapObj[1][key];
          });
          stockArr.push(stockObj);
        }
        setStocks(stockArr);
        console.log(threeMonths);
      } catch (e) {
        setDataProcessingError('Error parsing data. Please contact admin');
      }
    }
  }, []);
  return { stocks, processStockData, dataProcessingError };
}
