import React, { useEffect } from 'react';
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
import Errorbar from '../errorPoper/errorBar.js';
import '../../styles.css';
import randomColor from 'randomcolor';
import stockDataProcessor from './stockDataProcessor.js';
import inputChangeProcessor from './inputChangeProcessor.js';

// this is main hook. Main purpose of this hook is to use all the hooks created and generate jsx.
export default function StockChart() {
  const {
    inputValue,
    handleChange,
    errorMsg,
    rawApiData,
  } = inputChangeProcessor();
  const {
    stocks,
    processStockData,
    dataProcessingError,
  } = stockDataProcessor();

  useEffect(() => {
    processStockData(rawApiData);
  }, [rawApiData]);

  function getValidationState() {
    const length = inputValue.length;
    if (length > 1) return 'success';
    else if (length === 0) return 'error';
    return null;
  }

  return (
    <Grid fluid>
      <div className="App">
        {errorMsg || dataProcessingError ? (
          <Errorbar msg={errorMsg || dataProcessingError} show={true} />
        ) : (
          ''
        )}
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
                      key={stockTickr}
                      dataKey={stockTickr}
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
}
