import { useState, useCallback } from 'react';
import axios from 'axios';

// this helper hook is central point to call api
export default function ApiCaller() {
  const [rawApiData, setRawApiData] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  const callApi = useCallback(async (inputValue) => {
    try {
      const threeMonths = await axios.get(
        `https://cloud.iexapis.com/stable/stock/market/batch?types=chart&symbols=${inputValue}&range=3m&token=sk_b5b59adba0a746b68d0b6b4e0418ccf0`
      );
      setRawApiData(threeMonths);
    } catch (err) {
      setErrorMsg(
        'Error occured!! ' +
          (Boolean(err.response) ? err.response.data : err.message)
      );
    }
  }, []);

  return { rawApiData, callApi, errorMsg };
}
