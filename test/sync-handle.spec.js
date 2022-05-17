import { mount } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { SyncHandleRegisterer, SyncHandleConsumer, SyncHandleTester, someHandleState } from './components';

test('useSyncHandle', async () => {
    const tester = mount(<SyncHandleTester />);

    await ReactTestUtils.act(async () => {
        await new Promise(resolve => setTimeout(resolve, 250));
    });

    expect(tester.text()).toEqual(someHandleState + someHandleState)
})
