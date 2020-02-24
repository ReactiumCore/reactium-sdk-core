import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    AsyncEffectUser,
} from './components';
import { mount } from './enzyme';

describe('When component with useAsyncEffect promise resolves', () => {
    it('should perform state update', async () => {
        const cb = jest.fn();
        const child = mount(<AsyncEffectUser action={cb} />);

        await ReactTestUtils.act(async () => {
            await new Promise(resolve => setTimeout(resolve, 50));
        });

        expect(cb).toHaveBeenCalled();
    });
});

describe('When component with useAsyncEffect unmounts', () => {
    it('should not perform state update', async () => {
        const cb = jest.fn();
        const child = mount(<AsyncEffectUser action={cb} />);
        child.unmount();

        await ReactTestUtils.act(async () => {
            await new Promise(resolve => setTimeout(resolve, 51));
        });

        expect(cb).not.toHaveBeenCalled();
    });
});
