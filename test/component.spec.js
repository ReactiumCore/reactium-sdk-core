import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import utils from 'react-dom/cjs/react-dom-test-utils.development';
import { SDK, RegisteredComponent, ComponentToRegister } from '../test-components';

test('useHookComponent() - component not registered', async () => {
    const notRegistered = document.createElement("div");
    ReactDOM.render(<>
        <RegisteredComponent />
    </>, notRegistered);
    expect(notRegistered.innerHTML).toEqual('DefaultComponent');
    ReactDOM.unmountComponentAtNode(notRegistered);
})

test('useHookComponent() - component registered', async () => {
    const registered = document.createElement("div");
    const uuid = await SDK.Component.register('registered-component', ComponentToRegister)
    await utils.act(async () => {
        ReactDOM.render(<>
            <RegisteredComponent />
            </>, registered);
    });

    expect(registered.innerHTML).toEqual('RegisteredComponent');
    ReactDOM.unmountComponentAtNode(registered);
    await SDK.Hook.unregister(uuid);
})

test('useHookComponent() - capabilities denied', async () => {
    const registered = document.createElement("div");
    const uuid = await SDK.Hook.register('capability-check', async (caps, strict, context) => {
        context.permitted = false;
    });

    await utils.act(async () => {
        await SDK.Component.register('registered-component', ComponentToRegister, 0, ['some.cap'])
        ReactDOM.render(<>
            <RegisteredComponent />
            </>, registered);
    });

    expect(registered.innerHTML).toEqual('DefaultComponent');
    ReactDOM.unmountComponentAtNode(registered);
    await SDK.Hook.unregister(uuid);
})
