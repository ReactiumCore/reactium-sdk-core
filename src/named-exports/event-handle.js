import React, { useState } from 'react';

class ComponentTarget extends EventTarget {
    constructor(handle = {}) {
        delete handle.update;

        super();

        this.update = values =>
            Object.entries(values).forEach(
                ([key, value]) => (this[key] = value),
            );
        this.update(handle);
    }
}

/**
 * @api {ReactHook} useEventHandle(handle) useEventHandle()
 * @apiDescription React hook to create an imperative handle that is also an implementation of EventTarget. Can be used in
conjunction with useImperativeHandle (React built-in) or useRegisterHandle/useHandle (Reactium SDK hooks).
 * @apiParam {Object} handle Interface for interacting with your component.
 * @apiName useEventHandle
 * @apiGroup ReactHook
 * @apiExample EventHandleComponent.js
import React, { useEffect } from 'react';
import { useRegisterHandle, useEventHandle } from 'reactium-core/sdk';

const EventHandleComponent = () => {
     const [ value, setValue ] = useState(1);
     const createHandle = () => ({
         value, setValue,
     });

     const [ handle, setHandle ] = useEventHandle(createHandle());

     useEffect(() => {
         setHandle(createHandle());
     }, [value]);

     useRegisterHandle('EventHandleComponent', () => handle);

     const onClick = () => {
         if (handle) {
            setValue(value + 1);
            handle.dispatchEvent(new CustomEvent('do-something'));
         }
     }

     return (<button onClick={onClick}>Click Me ({value})</button>);
 };

 export default EventHandleComponent;
 * @apiExample EventHandleConsumer.js
import React, { useEffect, useState } from 'react';
import { useHandle } from 'reactium-core/sdk';

const EventHandleConsumer = props => {
    const [state, setState] = useState();
    const handleEventTarget = useHandle('EventHandleComponent');

    // when 'do-something' event occurs on
    // EventHandleComponent, this component can react
    const onDoSomething = e => {
        setState(e.target.value);
    };

    useEffect(() => {
        if (handleEventTarget) {
            handleEventTarget.addEventListener('do-something', onDoSomething);
        }
        return () => handleEventTarget.removeEventListener('do-something', onDoSomething);
    }, [handleEventTarget]);

    return (
        <div>
            value: {state}
        </div>
    );
};

export default EventHandleConsumer;
 */
export const useEventHandle = value => {
    const [handle] = useState(new ComponentTarget(value));
    const setHandle = value => {
        handle.update(value);
    };
    return [handle, setHandle];
};
