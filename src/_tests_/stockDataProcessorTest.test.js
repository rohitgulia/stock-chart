import { renderHook, act } from 'react-hooks-testing-library';
import stockDataProcessor from '../components/stock-chart/stockDataProcessor';
import { apiDummyData } from '../_mock_/apiDummyData';

describe('stock data processor component', () => {
  test('should process raw api data properly', () => {
    const { result } = renderHook(() => stockDataProcessor());

    act(() => result.current.processStockData(apiDummyData));

    expect(result.current.stocks.length).toBe(2);
    expect(result.current.stocks[0]['AAPL']).toBe(186.12);
  });
  test('should throw error when raw api data is not in correct format', () => {
    const { result } = renderHook(() => stockDataProcessor());

    act(() => result.current.processStockData({ data: '123' }));

    expect(result.current.stocks.length).toBe(0);
    expect(result.current.dataProcessingError).toBe(
      'Error parsing data. Please contact admin'
    );
  });
});
