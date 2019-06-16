import React, { useEffect } from 'react';
import { renderHook, act } from 'react-hooks-testing-library';
import stockChart from '../components/stock-chart/stockChart';
import { mount, render, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

function HookWrapper(props) {
  const hook = props.hook ? props.hook() : undefined;
  return <div hook={hook} />;
}

describe('stock chart component', () => {
  it('should render', () => {
    let wrapper = shallow(<HookWrapper />);

    expect(wrapper.exists()).toBeTruthy();
  });

  it('renders stock chart properly', () => {
    let wrapper = shallow(<HookWrapper hook={() => stockChart()} />);
    expect(wrapper.exists()).toBeTruthy();
  });
});
