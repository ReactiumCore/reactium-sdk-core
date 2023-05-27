import React, { useState } from 'react';
import CommonSDK, { useHookComponent } from '../../lib';

// useHookComponent tests
export const DefaultComponent = () => 'DefaultComponent';
export const ComponentToRegister = () => 'RegisteredComponent';
export const RegisteredComponent = () => {
    const Component = useHookComponent('ComponentToRegister', DefaultComponent);
    return <Component />;
};
export const RegisteredLibrary = () => {
    const Component = useHookComponent('Lib.Foo.ComponentToRegister', DefaultComponent);
    return <Component />;
};
