import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    RegisteredComponent,
    RegisteredLibrary,
    ComponentToRegister,
} from './components';

test('useHookComponent() - component not registered', async () => {
    const notRegistered = document.createElement('div');
    ReactDOM.render(
        <>
            <RegisteredComponent />
        </>,
        notRegistered,
    );
    expect(notRegistered.innerHTML).toEqual('DefaultComponent');
    ReactDOM.unmountComponentAtNode(notRegistered);
});

test('useHookComponent() - component registered', async () => {
    const registered = document.createElement('div');
   await SDK.Component.register(
        'ComponentToRegister',
        ComponentToRegister,
    );
    await ReactTestUtils.act(async () => {
        ReactDOM.render(
            <>
                <RegisteredComponent />
            </>,
            registered,
        );
    });

    expect(registered.innerHTML).toEqual('RegisteredComponent');
    ReactDOM.unmountComponentAtNode(registered);
    await SDK.Component.unregister('ComponentToRegister');
});

test('useHookComponent() - library registered', async () => {
    const registered = document.createElement('div');
    const Lib = { Foo: { ComponentToRegister } };
    await SDK.Component.register(
        'Lib',
        Lib,
    );
    await ReactTestUtils.act(async () => {
        ReactDOM.render(
            <>
                <RegisteredLibrary />
            </>,
            registered,
        );
    });

    expect(registered.innerHTML).toEqual('RegisteredComponent');
    ReactDOM.unmountComponentAtNode(registered);
    await SDK.Component.unregister('Lib');
});
