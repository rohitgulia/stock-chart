import { renderHook, act } from 'react-hooks-testing-library';
import apiCaller from '../components/stock-chart/stockApiCaller';
import axios from 'axios';
jest.mock('axios');

describe('stock api component', () => {
  it('should set rawData properly when api call is successfull because of', async () => {
    axios.get.mockResolvedValueOnce({ data: { test: '123' } });

    const { result, waitForNextUpdate } = renderHook(() => apiCaller());

    await act(async () => {
      result.current.callApi('fb/tsla');
      await waitForNextUpdate();
    });
    expect(result.current.rawApiData.data.test).toBe('123');
  });

  it('should set error properly when api call is unsuccessfull because of bad data', async () => {
    axios.get.mockRejectedValue(new Error('error'));

    const { result, waitForNextUpdate } = renderHook(() => apiCaller());

    await act(async () => {
      result.current.callApi('fb/tsla');
      await waitForNextUpdate();
    });
    expect(result.current.errorMsg).toBe('Error occured!! error');
  });
});
