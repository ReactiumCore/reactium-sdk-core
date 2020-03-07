import React, { useState, useEffect } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import CommonSDK, {
    useReduxState,
    useRegisterHandle,
    useHandle,
} from '../../lib';
import op from 'object-path';

const domainReducer = (state = {}, action) => {
    switch (action.type) {
        case 'DOMAIN_UPDATE': {
            const newState = {
                ...state,
                [action.domain]: {
                    ...state[action.domain],
                    ...action.update,
                },
            };

            return newState;
        }

        default:
            return state;
    }
};

export const store = createStore(domainReducer, {
    TestDomain: {
        value: 'initial',
    },
});

export const StoreProvider = ({ children }) => (
    <Provider store={store}>{children}</Provider>
);
export const StateChanger = () => {
    const { updateDomain } = useHandle('TestDomain');

    useEffect(() => {
        updateDomain({ value: 'updated' });
    });

    return null;
};
export const StateUser = () => {
    const [domain, updateDomain] = useReduxState('TestDomain');

    useRegisterHandle(
        'TestDomain',
        () => {
            return {
                updateDomain,
            };
        },
        [],
    );

    return op.get(domain, 'value');
};
