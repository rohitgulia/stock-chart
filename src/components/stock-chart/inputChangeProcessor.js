import { useState, useCallback, useEffect } from 'react';
import apiCaller from './stockApiCaller.js';

// this hook handles input change
export default function InputChangeProcessor() {
  const [inputValue, setInputValue] = useState('GOOGL,FB');
  const { rawApiData, errorMsg, callApi } = apiCaller();
  const [textChangeTimeout, setTextChangeTimeout] = useState();
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
    rawApiData,
    errorMsg,
    textChangeTimeout,
  };
}
