import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    EventHandleComponent,
    EventHandleParent,
} from './components';
import { mount } from './enzyme';

test('useEventHandle() - initial render works', async () => {
    const child = mount(<EventHandleComponent />);
    const parent = mount(<EventHandleParent />);

    await ReactTestUtils.act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));

        // this does nothing, ordinarily it would, but jsdom mocks EventTarget,
        // and ignores addEventListener
        await child.find('button').simulate('click');
    });

    // would be 2 if jsdom implemented EventTarget
    expect(parent.text()).toEqual("1")
});
