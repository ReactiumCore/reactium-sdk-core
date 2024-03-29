import { mount } from './enzyme';
import React from 'react';
import { HandleTester, someHandleState } from './components';
import ReactTestUtils from 'react-dom/test-utils';

test('useHandle', async () => {
    const tester = mount(<HandleTester />);

    await ReactTestUtils.act(async () => {
        await new Promise(resolve => setTimeout(resolve, 250));
    });

    expect(tester.text()).toEqual(someHandleState + someHandleState)
})
