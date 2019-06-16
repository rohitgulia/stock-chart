import { useState, useEffect } from 'react';
import apiCaller from './stockApiCaller.js';

// this hook handles input change and error msg updates
export default function InputChangeProcessor() {
  const [inputValue, setInputValue] = useState('AAPL,MSFT,GOOGL');
  const [textChangeTimeout, setTextChangeTimeout] = useState();
  const { rawApiData, errorMsg, callApi } = apiCaller();
  const handleChange = (e) => {
    setInputValue(e.currentTarget.value.toUpperCase());
  };

  useEffect(() => {
    clearTimeout(textChangeTimeout);

    setTextChangeTimeout(
      setTimeout(() => {
        callApi(inputValue);
      }, 2000)
    );
  }, [inputValue]);

  return {
    inputValue,
    handleChange,
    errorMsg,
    rawApiData,
    textChangeTimeout,
  };
}
