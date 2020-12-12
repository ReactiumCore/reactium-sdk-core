import Registry from '../utils/registry';
import op from 'object-path';

/**
 * @api {Function} Component.register(hook,component,order) Component.register()
 * @apiGroup Reactium.Component
 * @apiName Component.register
 * @apiDescription Register a React component to be used with a specific useHookComponent React hook. This must be called before the useHookComponent that defines the hook.
 * @apiParam {String} hook The hook name
 * @apiParam {Mixed} component component(s) to be output by useHookComponent
 * @apiParam {Number} order precedent of this if Component.register is called multiple times (e.g. if you are trying to override core or another plugin)
 * @apiExample reactium-hooks.js
import React from 'react';
import Reactium from 'reactium-core/sdk';

// component to be used unless overriden by Reactium.Component.register()
const ReplacementComponentA = () => <div>My Plugin's Component</div>
const ReplacementComponentB = () => <div>My Alternative Component</div>

// Simple Version
Reactium.Component.register('my-component', ReplacementComponentA);

// Advanced Form using Reactium.Hook SDK
Reactium.Hook.register('my-component', async (...params) => {
    const context = params.pop(); // context is last argument
    const [param] = params;
    if (param === 'test') {
        context.component = ReplacementComponentA;
    } else {
        context.component = ReplacementComponentB;
    }
}
})
 * @apiExample parent.js
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

// component to be used unless overriden by Reactium.Component.register()
const DefaultComponent = () => <div>Default or Placeholder component</div>

export props => {
    const MyComponent = useHookComponent('my-component', DefaultComponent, 'test');
    return (
        <div>
            <MyComponent {...props} />
        </div>
    );
};
 */
class Component extends Registry {
    constructor(name, idField, mode) {
        super(name, idField, mode);
    }

    get(id, defaultComponent) {
        const obj = Registry.prototype.get.call(this, id);
        return op.get(obj, 'component', defaultComponent);
    }

    register(id, component) {
        return Registry.prototype.register.call(this, id, { component });
    }
}

export default new Component('Component', 'id', Registry.MODES.CLEAN);
