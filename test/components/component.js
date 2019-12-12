import React, { useState } from 'react';
import CommonSDK, { useHookComponent } from '../../lib/cjs';

// useHookComponent tests
export const DefaultComponent = () => 'DefaultComponent';
export const ComponentToRegister = () => 'RegisteredComponent';
export const RegisteredComponent = () => {
    const Component = useHookComponent('registered-component', DefaultComponent);
    return <Component />;
};
