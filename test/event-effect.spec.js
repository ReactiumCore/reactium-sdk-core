import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { SDK, EventEffectResponseComponent } from './components';
import { mount } from './enzyme';
import Event from '../src/node-polyfill/event';

test('useEventEffect() - initial render works', async () => {
    // const registered = document.createElement('div');
    const responder = mount(<EventEffectResponseComponent />);

    await ReactTestUtils.act(async () => {
        SDK.Handle.get('EventEffectHandle.current').dispatchEvent(
            new Event('do-something'),
        );
        
        await new Promise((resolve) => setTimeout(resolve, 250));
    });
    
    // would be 2 if jsdom implemented EventTarget
    // expect(registered.innerHTML).toEqual('1');
    expect(responder.text()).toEqual("1")
});
