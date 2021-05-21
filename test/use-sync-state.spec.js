import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    UseSyncStateComponent,
    UseSyncStateComponentConsumer,
} from './components';
import { mount } from './enzyme';

test('useSyncState() - initial render works', async () => {
    const child = mount(<UseSyncStateComponent />);

    await ReactTestUtils.act(async () => {
        // this does nothing, ordinarily it would, but jsdom mocks EventTarget,
        // and ignores addEventListener
        await ReactTestUtils.act(async () => {
            await child.find('button').simulate('click');
            const parent = mount(<UseSyncStateComponentConsumer />);
            expect(parent.text()).toEqual("2")
        });
    });
});
