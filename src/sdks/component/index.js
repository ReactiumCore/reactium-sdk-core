import { ReactiumSyncState } from '../../named-exports/useSyncState';
import op from 'object-path';

/**
 * @api {Function} Component.register(hook,component) Component.register()
 * @apiGroup Reactium.Component
 * @apiName Component.register
 * @apiDescription Register a React component to be used with a specific useHookComponent React hook. This must be called before the useHookComponent that defines the hook.
 * @apiParam {String} hook The hook name
 * @apiParam {Mixed} component component(s) to be output by useHookComponent
 * @apiExample reactium-hooks.js
import React from 'react';
import { Component } from '@atomic-reactor/reactium-core/sdk';

// component to be used unless overriden by Component.register() somewhere else
const ReplacementComponent = () => <div>My Plugin's Component</div>

// Simple Version
Component.register('MyComponent', ReplacementComponentA);

 * @apiExample parent.js
import React from 'react';
import { useHookComponent } from '@atomic-reactor/reactium-core/sdk';

// component to be used unless overriden by Reactium.Component.register()
const DefaultComponent = () => <div>Default or Placeholder component</div>

export props => {
    const MyComponent = useHookComponent('MyComponent', DefaultComponent);
    return (
        <div>
            <MyComponent {...props} />
        </div>
    );
};
 */
export class RegisteredComponent extends ReactiumSyncState {
    constructor() {
        super({}, { noMerge: true });
    }

    register(...params) {
        return this.set(...params);
    }

    unregister(...params) {
        return this.del(...params);
    }

    get listById() {
        const list = {};
        this.listEntries.forEach(([key, value]) => {
            list[key] = value;
        });

        return list;
    }

    get list() {
        return Object.values(this.stateObj.state);
    }

    get listEntries() {
        return Object.entries(this.stateObj.state);
    }
}

export const Component = new RegisteredComponent();
export { Component as default };