import op from 'object-path';
import { useEffect, useRef } from 'react';
import { useEventHandle, ComponentEvent } from './event-handle';
import React from 'react';

const refsProxyHandler = (refs, key) => ({
    get(target, prop) {
        if (prop === 'current') return refs.get(key);
        if (prop in target) return target[prop];
    },

    set(target, prop, value) {
        if (prop === 'current') {
            refs.set(key, value);
            return true;
        }

        if (target in refs) target[prop] = value;
        return true;
    },
});

export const createRefsProxyFactory = refs => key =>
    new Proxy(React.createRef(), refsProxyHandler(refs, key));

export const useRefs = (initialRefs = {}) => {
    const ref = useRef(initialRefs);

    const get = (key, defaultValue) => {
        if (!key) {
            return ref.current;
        }
        return op.get(ref.current, key, defaultValue);
    };

    const set = (key, value) => {
        if (!ref.current) return;
        op.set(ref.current, key, value);
    };

    const del = key => {
        if (!ref.current) return;
        op.del(ref.current, key);
    };

    const clear = () => {
        if (!ref.current) return;
        ref.current = null;
    };

    const refs = { get, set, del, clear, ...ref.current };

    refs.createProxy = createRefsProxyFactory(refs);

    return refs;
};

export const useEventRefs = (initialRefs = {}, refProxy = false) => {
    const {
        get: refsGet,
        set: refsSet,
        del: refsDel,
        clear: refsClear,
        createProxy: refsCreateProxy,
        ...refs
    } = useRefs(initialRefs);
    const [handle, setHandle] = useEventHandle({});

    const get = (key, defaultValue) => {
        const val = refsGet.get(key, defaultValue);

        if (!key) {
            return ref.current;
        }
        return op.get(ref.current, key, defaultValue);
    };

    const set = (key, value) => {
        handle.dispatchEvent(new ComponentEvent('before-set', { key, value }));
        refsSet(key, value);
        handle.dispatchEvent(new ComponentEvent('set', { key, value }));
    };

    const del = key => {
        handle.dispatchEvent(new ComponentEvent('before-del', { key }));
        refsDel(key);
        handle.dispatchEvent(new ComponentEvent('del', { key }));
    };

    const clear = () => {
        handle.dispatchEvent(new ComponentEvent('before-clear', {}));
        refsClear(key);
        handle.dispatchEvent(new ComponentEvent('clear', {}));
    };

    const handleDecorated = {
        get: refsGet,
        set,
        del,
        clear,
        ...refs,
    };

    setHandle(handleDecorated);

    handle.createProxy = createRefsProxyFactory(handle);

    return handle;
};

/**
 * @api {ReactHook} useRefs() useRefs()
 * @apiGroup ReactHook
 * @apiName useRefs
 * @apiDescription Creates a single reference object that can be managed using the `get`/`set`/`del`/`clear` functions.
 * @apiExample Usage
import React, { useEffect, useState } from 'react';
import { useRefs } from '@atomic-reactor/reactium-sdk-core';

const MyComponent = () => {
    const refs = useRefs();
    const [state, setState] = useState({ input: null });

    const onClick = () => {
        const inputElm = refs.get('input');
        setState({ ...state, input: inputElm.value });
        inputElm.value = '';
    };

    return (
        <div ref={elm => refs.set('container', elm)}>
            {state.input && <div>{state.input}</div>}
            <input type='text' ref={elm => refs.set('input', elm)} />
            <button onClick={onClick}>Update</button>
        </div>
    );
};
* @apiExample Proxy Reference Usage
// sometimes you need a forwarded ref to be a ref object from useRef() or React.createRef()
// You can create proxy factory for the refs to achieve this.
import React, { useEffect, useState } from 'react';
import { EventForm } from '@atomic-reactor/reactium-ui';
import { useRefs } from '@atomic-reactor/reactium-sdk-core';

const MyComponent = () => {
   const refs = useRefs();
   // creates a factory for React.createRef() object to your refs
   const refProxy = refs.createProxy('form');

   const [state, setState] = useState({});

   const onSubmit = e => {
       const formRef = refs.get('form');
       setState({ ...formRef.getValue() });
   };

   // EventForm expects a reference object, not a callback function
   // When EventForm references ref.current, it will actually get refs.get('form').
   // When EventForm sets the ref.current value, it will actually perform refs.set('form', value);
   return (
       <EventForm ref={refProxy} onSubmit={onSubmit}>
           <input type='text' name="foo" />
           <button type="submit">Submit the Form</button>
       </EventForm>
   );
};
 */

/**
  * @api {ReactHook} useEventRefs() useEventRefs()
  * @apiVersion 1.0.7
  * @apiGroup ReactHook
  * @apiName useEventRefs
  * @apiDescription Like useRefs, creates a single reference object that can be managed using the `get`/`set`/`del`/`clear` functions, however also an EventTarget object.
  * `set`/`del`/`clear` methods dispatch `before-set`/`set`, `before-del`/`del`, and `before-clear`/`clear` events respectively.
  * @apiExample Usage
 import React, { useState } from 'react';
 import { useRefs } from '@atomic-reactor/reactium-sdk-core';

 const MyComponent = () => {
     const refs = useEventRefs();
     const [ready, setReady] = useState(false);

     const onChildRefReady = e => {
         if (e.key === 'my.component') {
             setReady(refs.get(e.key) !== undefined);
         }
     };

     useEffect(() => {
         refs.addEventListener('set', onChildRefReady);
         return () => refs.removeEventListener('set', onChildRefReady);
     }, []);

     return (
         <MyForwardRefComponent ref={cmp => refs.set('my.component', cmp)} />
         {ready && <Controller control={refs.get('my.component')} />}
     );
 };
  */
