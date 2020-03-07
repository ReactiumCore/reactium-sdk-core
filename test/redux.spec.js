import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    store,
    StoreProvider,
    StateUser,
    StateChanger,
} from './components';
import { mount } from './enzyme';

test('store init', async () => {
    expect(store.getState()).toMatchObject({
        TestDomain: {
            value: 'initial',
        },
    });
});

test('useReduxState() no dispatch', async () => {
    const reduxUser = mount(<StoreProvider>
        <StateUser />
    </StoreProvider>);
    expect(reduxUser.text()).toEqual('initial');
});

test('useReduxState() and useHandle() dispatch update', async () => {
    let reduxUser, changer;
    reduxUser = document.createElement('div');
    changer = document.createElement('div');

    ReactDOM.render(
        <StateChanger />,
        changer,
    );

    await ReactTestUtils.act(async () => {
        // the subscribing component
        ReactDOM.render(
            <StoreProvider>
                <StateUser />
            </StoreProvider>,
            reduxUser,
        );

        await new Promise(resolve => setTimeout(resolve, 500));
    });

    expect(reduxUser.innerHTML).toEqual('updated');
    ReactDOM.unmountComponentAtNode(reduxUser);
});
