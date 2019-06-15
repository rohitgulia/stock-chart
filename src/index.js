import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  Row,
  Col,
} from 'react-bootstrap';
import Errorbar from './components/errorPoper/errorBar.js';
import './styles.css';
import randomColor from 'randomcolor';
import stockApi from './components/api/stockApi';

// this hook processes raw api data and gives out processed data
const stockDataProcessor = () => {
  const [stocks, setStocks] = useState([]);
  const processStockData = (threeMonths) => {
    if (Boolean(threeMonths.data)) {
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
    }
  };
  return [stocks, processStockData];
};

// this hook handles input change
const inputChangeProcessor = () => {
  const [inputValue, setInputValue] = useState('AAPL,MSFT,GOOGL');
  const [errorMsg, setErrorMsg] = useState('');
  const [textChangeTimeout, setTextChangeTimeout] = useState();
  const [rawApiData, setRawApiData] = useState({});
  const handleChange = (e) => {
    setInputValue(e.currentTarget.value);
  };

  useEffect(() => {
    try {
      clearTimeout(textChangeTimeout);

      setTextChangeTimeout(
        setTimeout(() => {
          apiCaller(setRawApiData, setErrorMsg, inputValue);
        }, 2000)
      );
    } catch (err) {
      setErrorMsg(err.message);
      console.log(err);
    }
  }, [inputValue]);

  return [
    inputValue,
    handleChange,
    errorMsg,
    rawApiData,
    setErrorMsg,
    setRawApiData,
  ];
};

// this helper function is central point to call api
async function apiCaller(setRawApiData, setErrorMsg, inputValue) {
  try {
    const threeMonths = await stockApi.get(
      `?types=chart&symbols=${inputValue}&range=3m&token=sk_1b7bf8fa1e97419ca7fc3299b703314e`
    );
    setRawApiData(threeMonths);
  } catch (err) {
    setErrorMsg(err.message);
    console.log(err);
  }
}

// this is main hook. Main purpose of this hook is to use all the hooks created and generate jsx.
const App = () => {
  const [
    inputValue,
    handleChange,
    errorMsg,
    rawApiData,
    setErrorMsg,
    setRawApiData,
  ] = inputChangeProcessor();
  const [stocks, processStockData] = stockDataProcessor();

  useEffect(() => {
    processStockData(rawApiData);
  }, [rawApiData]);

  useEffect(() => {
    apiCaller(setRawApiData, setErrorMsg, inputValue);
  }, []);

  function getValidationState() {
    const length = inputValue.length;
    if (length > 4) return 'success';
    else if (length === 0) return 'error';
    return null;
  }

  return (
    <Grid fluid>
      <div className="App">
        {errorMsg ? <Errorbar msg={errorMsg} show={true} /> : ''}
        <Row>
          <Col md={12}>
            <h1>Stocks</h1>

            <FormGroup
              controlId="formBasicText"
              validationState={getValidationState()}
            >
              <ControlLabel>
                Enter stock symbols separated by commas
              </ControlLabel>

              <FormControl
                type="text"
                value={inputValue}
                placeholder="AMZN,FB,AAPL,NVDA"
                onChange={handleChange}
              />
              <FormControl.Feedback />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <h2>Last 3 Months</h2>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stocks}>
                <XAxis dataKey="date" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                {inputValue.split(',').map((stockTickr) => {
                  return (
                    <Line
                      type="monotone"
                      key={stockTickr.toUpperCase()}
                      dataKey={stockTickr.toUpperCase()}
                      stroke={randomColor()}
                    />
                  );
                })}
              </LineChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </div>
    </Grid>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
