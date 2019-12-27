import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    DerivedParent,
} from './components';
import { mount } from './enzyme';

test('useDerivedState() internal updates only', async () => {
    let derivedParent;
    derivedParent = document.createElement('div');

    await ReactTestUtils.act(async () => {
        ReactDOM.render(
            <DerivedParent />,
            derivedParent,
        );

        await new Promise(resolve => setTimeout(resolve, 500))
    });

    expect(derivedParent.innerHTML).toEqual('READYbarHiAgain');
    ReactDOM.unmountComponentAtNode(derivedParent);
});

test('useDerivedState() prop and internal updates', async () => {
    let derivedParent;
    derivedParent = document.createElement('div');

    await ReactTestUtils.act(async () => {
        ReactDOM.render(
            <DerivedParent update={true} />,
            derivedParent,
        );

        await new Promise(resolve => setTimeout(resolve, 500))
    });

    expect(derivedParent.innerHTML).toEqual('READYbargoodbye');
    ReactDOM.unmountComponentAtNode(derivedParent);
});

test('useDerivedState() prop and internal updates, getting all props on prop updates', async () => {
    let derivedParent;
    derivedParent = document.createElement('div');

    await ReactTestUtils.act(async () => {
        ReactDOM.render(
            <DerivedParent update={true} allTheThings={true} />,
            derivedParent,
        );

        await new Promise(resolve => setTimeout(resolve, 500))
    });

    expect(derivedParent.innerHTML).toEqual('READYbargoodbyeunsubscribedValue');
    ReactDOM.unmountComponentAtNode(derivedParent);
});
