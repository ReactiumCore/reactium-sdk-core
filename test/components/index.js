import React, { useState } from 'react';
import CommonSDK, { useRegisterHandle, useHandle, useHookComponent } from '../../lib/cjs';

export const someHandleState = 'some state';
export const HandleRegisterer = () => {
    const [handleState] = useState(someHandleState);
    useRegisterHandle('HandleComponent', () => ({
        handleState
    }), []);

    return handleState;
};

export const HandleConsumer = () => {
    const { handleState } = useHandle('HandleComponent');
    return handleState;
}


export const DefaultComponent = () => 'DefaultComponent';
export const ComponentToRegister = () => 'RegisteredComponent';
export const RegisteredComponent = () => {
    const Component = useHookComponent('registered-component', DefaultComponent);
    return <Component />;
};

export const SDK = CommonSDK;
