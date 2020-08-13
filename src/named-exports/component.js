import Component from '../component';
import { useAsyncEffect } from './async-effect';
import { useState, useRef, forwardRef } from 'react';
import op from 'object-path';
import uuid from 'uuid/v4';

/**
 * @api {ReactHook} useHookComponent(hookName,defaultComponent,...params) useHookComponent()
 * @apiDescription A React hook used to define React component(s) that can be
 overrided by Reactium plugins, using the `Reactium.Component.register()` function.
 * @apiParam {String} hookName the unique string used to register component(s).
 * @apiParam {Component} defaultComponent the default React component(s) to be returned by the hook.
 * @apiParam {Mixed} params variadic list of parameters to be passed to the Reactium hook specified by hookName.
 * @apiName useHookComponent
 * @apiGroup ReactHook
 * @apiExample parent.js
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

// component to be used unless overriden by Reactium.Component.register()
const DefaultComponent = () => <div>Default or Placeholder component</div>

export props => {
    const MyComponent = useHookComponent('my-component', DefaultComponent);
    return (
        <div>
            <MyComponent {...props} />
        </div>
    );
};
* @apiExample reactium-hooks.js
import React from 'react';
import Reactium from 'reactium-core/sdk';

// component to be used unless overriden by Reactium.Component.register()
const ReplacementComponent = () => <div>My Plugin's Component</div>

Reactium.Component.register('my-component', ReplacementComponent);
 */

// Use forwardRef on default component in case registered
// component requires forwarded ref;
const forwardRefNoop = forwardRef((props, ref) => null);

export const useHookComponent = (
    hook = 'component',
    defaultComponent = forwardRefNoop,
) => {
    const component = useRef({});
    op.set(
        component.current,
        'component',
        Component.get(hook, defaultComponent),
    );

    return op.get(component.current, 'component');
};
