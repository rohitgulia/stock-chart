import { renderHook, act } from 'react-hooks-testing-library';
import inputChangeProcessor from '../components/stock-chart/inputChangeProcessor';

describe('input change handler component', () => {
  it('should update input value in state properly', () => {
    const { result } = renderHook(() => inputChangeProcessor());

    const e = {
      currentTarget: {
        value: 'fb,tsla',
      },
    };

    act(() => result.current.handleChange(e));

    expect(result.current.inputValue).toBe('FB,TSLA');
  });

  it('should set api call with timeout properly when input data changes', () => {
    const { result } = renderHook(() => inputChangeProcessor());

    const e = {
      currentTarget: {
        value: 'fb,tsla',
      },
    };

    act(() => result.current.handleChange(e));

    expect(result.current.textChangeTimeout).toBeGreaterThanOrEqual(0);
  });
});
