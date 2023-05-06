define({ "api": [
  {
    "type": "ReactHook",
    "url": "useAsyncEffect(cb,dependencies)",
    "title": "useAsyncEffect()",
    "description": "<p>Just like React's built-in <code>useEffect</code>, but can use async/await. If the return is a promise for a function, the function will be used as the unmount callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Just like callback provided as first argument of <code>useEffect</code>, but takes as its own first argument a method to see if the component is mounted. This is useful for deciding if your async response (i.e. one that would attempt to change state) should happen.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "deps",
            "description": "<p>Deps list passed to <code>useEffect</code></p>"
          }
        ]
      }
    },
    "name": "useAsyncEffect",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Reactium Usage",
        "content": "import React, { useState } from 'react';\nimport { useAsyncEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const [show, setShow] = useState(false);\n\n    // change state allowing value to show\n    // asynchrounously, but only if component is still mounted\n    useAsyncEffect(async isMounted => {\n        setShow(false);\n        await new Promise(resolve => setTimeout(resolve, 3000));\n        if (isMounted()) setShow(true);\n\n        // unmount callback\n        return () => {};\n    }, [ props.value ]);\n\n    return (\n        {show && <div>{props.value}</div>}\n    );\n};",
        "type": "json"
      },
      {
        "title": "StandAlone Import",
        "content": "import { useAsyncEffect } from '@atomic-reactor/reactium-sdk-core';",
        "type": "json"
      },
      {
        "title": "Wrong Usage",
        "content": "import React, { useState } from 'react';\nimport { useAsyncEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const [show, setShow] = useState(false);\n\n    // change state allowing value to show\n    // asynchrounously, but only if component is still mounted\n    useAsyncEffect(async isMounted => {\n        // Warning: don't do this, wait until promise resolves to check isMounted()!!\n        if (isMounted()) { // this may be true *before* promise resolves and false *after*\n            setShow(false);\n            await new Promise(resolve => setTimeout(resolve, 3000));\n            setShow(true);\n        }\n\n        // unmount callback\n        return () => {};\n    }, [ props.value ]);\n\n    return (\n        {show && <div>{props.value}</div>}\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/async-effect.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useDerivedState(props,subscriptions,updateAll)",
    "title": "useDerivedState()",
    "description": "<p>Sometimes you would like to derive state from your component props, and also allow either a prop change, or an internal state change either to take effect. This hook will allow you to create a state object from your component props, and subscribe (by array of object-paths) only to those prop changes you would like to see reflected in a rendering updates to your component state. This hook returns an array similar in nature to the return of React's built-in <code>useState()</code> hook (<code>[state,setState]</code>), with some differences.</p> <ol> <li>The initial value coming from props (on first render) will contain all that was present in the props object passed to it. Note that any values that are not present in your component props on first render, or that which are explicitly subscribed to, will not exist in the returned state element.</li> <li>The setState callback can receive whole or partial state objects, and will be merged with the existing state.</li> <li>There is a third element function <code>forceRefresh</code></li> </ol>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "props",
            "description": "<p>the component props</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "subscriptions",
            "description": "<p>Array of string object-paths in your component props you would like to update your component state for. By default, this is empty, and if left empty you will get only the initial props, and no updates. Each selected property is shallow compared with the previous version of that prop (not the current state). Only a change of prop will trigger a prop-based update and rerender.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "updateAll",
            "defaultValue": "false",
            "description": "<p>When true, an update to any subscribed object-path on your props will cause <em>all</em> the props to imprint on your component state.</p>"
          }
        ]
      }
    },
    "version": "0.0.14",
    "name": "useDerivedState",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Returns",
        "content": "// The hook returns an array containing [state, setState, forceRefresh]\nconst [state, setState, forceRefresh] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);",
        "type": "json"
      },
      {
        "title": "Usage",
        "content": "import React from 'react';\nimport { useDerivedState } from 'reactium-core/sdk';\nimport op from 'object-path';\n\nconst MyComponent = props => {\n    const [state, setState] = useDerivedState(props, ['path.to.value1', 'path.to.value2']);\n    const value1 = op.get(state, 'path.to.value1', 'Default value 1');\n    const value2 = op.get(state, 'path.to.value2', 'Default value 2');\n\n    // setState merges this object with previous state\n    const updateValue1 = () => setState({\n        path: {\n            to: {\n                value1: 'foo',\n            }\n        }\n    });\n\n    return (<div>\n        <div>Value 1: {value1}</div>\n        <div>Value 2: {value2}</div>\n        <button onClick={updateValue1}>Update Value 1</button>\n    </div>);\n}\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "filename": "src/named-exports/derived-state.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useEventEffect(eventTarget,eventCallbacks,deps)",
    "title": "useEventEffect()",
    "version": "1.0.7",
    "description": "<p>React hook to short hand for addEventListener and removeEventLister for one or more callbacks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "eventTarget",
            "description": "<p>Some event target object (implementing addEventListener and removeEventLister)</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "eventCallbacks",
            "description": "<p>Object keys are event names, and Object values are callbacks to be subscribed/unsubscribed.</p>"
          },
          {
            "group": "Parameter",
            "type": "useEffectDeps",
            "optional": false,
            "field": "deps",
            "description": "<p>consistent with React useEffect deps list.</p>"
          }
        ]
      }
    },
    "name": "useEventEffect",
    "group": "ReactHook",
    "examples": [
      {
        "title": "EventEffectComponent.js",
        "content": "import React, { useState } from 'react';\nimport { useEventEffect } from 'reactium-core/sdk';\n\nconst EventEffectComponent = () => {\n    const [size, setSize] = useState({\n        width: window.innerWidth,\n        height: window.innerHeight,\n    });\n\n    const [online, setOnline] = useState(window.onLine);\n\n    const onResize = e => {\n        setSize({\n            width: window.innerWidth,\n            height: window.innerHeight,\n        });\n    };\n\n    const onNetworkChange = e => {\n        setOnline(window.onLine);\n    };\n\n    useEventEffect(\n        window,\n        {\n            resize: onResize,\n            online: onNetworkChange,\n            offline: onNetworkChange,\n        },\n        [],\n    );\n\n    return (\n        <div className='status'>\n            <span className='status-width'>width: {size.width}</span>\n            <span className='status-height'>height: {size.height}</span>\n            <span className={`status-${online ? 'online' : 'offline'}`}></span>\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "filename": "src/named-exports/event-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useEventHandle(handle)",
    "title": "useEventHandle()",
    "description": "<p>React hook to create an imperative handle that is also an implementation of EventTarget. Can be used in conjunction with useImperativeHandle (React built-in) or useRegisterHandle/useHandle (Reactium SDK hooks).</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "handle",
            "description": "<p>Interface for interacting with your component.</p>"
          }
        ]
      }
    },
    "name": "useEventHandle",
    "group": "ReactHook",
    "examples": [
      {
        "title": "EventHandleComponent.js",
        "content": "import React, { useEffect } from 'react';\nimport { useRegisterHandle, useEventHandle } from 'reactium-core/sdk';\n\nconst EventHandleComponent = () => {\n     const [ value, setValue ] = useState(1);\n     const createHandle = () => ({\n         value, setValue,\n     });\n\n     const [ handle, setHandle ] = useEventHandle(createHandle());\n\n     useEffect(() => {\n         setHandle(createHandle());\n     }, [value]);\n\n     useRegisterHandle('EventHandleComponent', () => handle);\n\n     const onClick = () => {\n         if (handle) {\n            setValue(value + 1);\n            handle.dispatchEvent(new CustomEvent('do-something'));\n         }\n     }\n\n     return (<button onClick={onClick}>Click Me ({value})</button>);\n };\n\n export default EventHandleComponent;",
        "type": "json"
      },
      {
        "title": "EventHandleConsumer.js",
        "content": "import React, { useEffect, useState } from 'react';\nimport { useHandle } from 'reactium-core/sdk';\n\nconst EventHandleConsumer = props => {\n    const [state, setState] = useState();\n    const handleEventTarget = useHandle('EventHandleComponent');\n\n    // when 'do-something' event occurs on\n    // EventHandleComponent, this component can react\n    const onDoSomething = e => {\n        setState(e.target.value);\n    };\n\n    useEffect(() => {\n        if (handleEventTarget) {\n            handleEventTarget.addEventListener('do-something', onDoSomething);\n        }\n        return () => handleEventTarget.removeEventListener('do-something', onDoSomething);\n    }, [handleEventTarget]);\n\n    return (\n        <div>\n            value: {state}\n        </div>\n    );\n};\n\nexport default EventHandleConsumer;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/event-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useEventRefs()",
    "title": "useEventRefs()",
    "version": "1.0.7",
    "group": "ReactHook",
    "name": "useEventRefs",
    "description": "<p>Like useRefs, creates a single reference object that can be managed using the <code>get</code>/<code>set</code>/<code>del</code>/<code>clear</code> functions, however also an EventTarget object. <code>set</code>/<code>del</code>/<code>clear</code> methods dispatch <code>before-set</code>/<code>set</code>, <code>before-del</code>/<code>del</code>, and <code>before-clear</code>/<code>clear</code> events respectively.</p>",
    "examples": [
      {
        "title": "Usage",
        "content": "import React, { useState } from 'react';\nimport { useRefs } from '@atomic-reactor/reactium-sdk-core';\n\nconst MyComponent = () => {\n    const refs = useEventRefs();\n    const [ready, setReady] = useState(false);\n\n    const onChildRefReady = e => {\n        if (e.key === 'my.component') {\n            setReady(refs.get(e.key) !== undefined);\n        }\n    };\n\n    useEffect(() => {\n        refs.addEventListener('set', onChildRefReady);\n        return () => refs.removeEventListener('set', onChildRefReady);\n    }, []);\n\n    return (\n        <MyForwardRefComponent ref={cmp => refs.set('my.component', cmp)} />\n        {ready && <Controller control={refs.get('my.component')} />}\n    );\n};",
        "type": "json"
      }
    ],
    "filename": "src/named-exports/useRefs.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useFocusEffect(container,dependencies)",
    "title": "useFocusEffect()",
    "group": "ReactHook",
    "name": "useFocusEffect",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Element",
            "optional": false,
            "field": "container",
            "description": "<p>The DOM element to search for the 'data-focus' element.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "dependencies",
            "description": "<p>Dependencies list passed to <code>useEffect</code>.</p>"
          }
        ],
        "Returns": [
          {
            "group": "Returns",
            "type": "Boolean",
            "optional": false,
            "field": "focused",
            "description": "<p>If the 'data-focus' element was found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Reactium Usage",
        "content": "import cn from 'classnames';\nimport React, { useRef } from 'react';\nimport { useFocusEffect } from 'reactium-core/sdk';\n\nconst MyComponent = props => {\n    const containerRef = useRef();\n\n    const [focused] = useFocusEffect(containerRef.current);\n\n    return (\n        <form ref={containerRef}>\n            <input className={cn({ focused })} type='text' data-focus />\n            <button type='submit'>Submit</button>\n        </form>\n    );\n};",
        "type": "json"
      },
      {
        "title": "Returns",
        "content": "{Array} [focused:Element, setFocused:Function]",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/focus-effect.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useFulfilledObject(object,keys)",
    "title": "useFulfilledObject()",
    "name": "useFulfilledObject",
    "group": "ReactHook",
    "description": "<p>Asyncronous React hook that determines if the supplied object has values for the supplied keys. Useful when you have many <code>useEffect</code> calls and need to know if multiple pieces of the state are set and ready for rendering.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "object",
            "description": "<p>The object to check.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "keys",
            "description": "<p>List of object paths to validate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "\nimport React, { useEffect, useState } from 'react';\nimport { useFulfilledObject } from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n\n    const [state, setNewState] = useState({});\n    const [updatedState, ready, attempts] = useFulfilledObject(state, ['msg', 'timestamp']);\n\n    const setState = newState => {\n        newState = { ...state, ...newState };\n        setNewState(newState);\n    };\n\n    useEffect(() => {\n        if (!state.msg) {\n            setState({ msg: 'ok'});\n        }\n    }, [state]);\n\n    useEffect(() => {\n        if (!state.timestamp) {\n            setState({ timestamp: Date.now() });\n        }\n    }, [state]);\n\n    const render = () => {\n        return ready !== true ? null : <div>I'm READY!!</div>;\n    };\n\n    return render();\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/fulfilled-object.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useHandle(id,defaultValue)",
    "title": "useHandle()",
    "description": "<p>React hook to subscribe to a specific imperative handle reference. Useful for having one functional component control another.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "defaultValue",
            "description": "<p>the value to use for the handle if it does not exist.</p>"
          }
        ]
      }
    },
    "name": "useHandle",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Counter.js",
        "content": "import React, { useState } from 'react';\nimport { useRegisterHandle } from 'reactium-core/sdk';\n\nconst Counter = ({id = 1}) => {\n    const [count, setCount] = useState(Number(id));\n\n    // id 'counter.1' by default\n    useRegisterHandle(['counter', id], () => ({\n        increment: () => setCount(count + 1),\n    }), [count]);\n\n    return (\n        <div>\n            <h1>Counter {id}</h1>\n            Count: {count}\n        </div>\n    );\n};\n\nexport default Counter;",
        "type": "json"
      },
      {
        "title": "CounterControl.js",
        "content": "import React from 'react';\nimport { useHandle } from 'reactium-core/sdk';\n\nconst noop = () => {};\nconst CounterControl = () => {\n    // Get increment control on handle identified at path 'counter.1'\n    const { increment } = useHandle('counter.1', { increment: noop }});\n\n    return (\n        <div>\n            <h1>CounterControl</h1>\n            <button onClick={increment}>Increment Counter</button>\n        </div>\n    );\n};\n\nexport default CounterControl;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useHookComponent(hookName,defaultComponent,...params)",
    "title": "useHookComponent()",
    "description": "<p>A React hook used to define React component(s) that can be overrided by Reactium plugins, using the <code>Reactium.Component.register()</code> function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hookName",
            "description": "<p>the unique string used to register component(s).</p>"
          },
          {
            "group": "Parameter",
            "type": "Component",
            "optional": false,
            "field": "defaultComponent",
            "description": "<p>the default React component(s) to be returned by the hook.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "params",
            "description": "<p>variadic list of parameters to be passed to the Reactium hook specified by hookName.</p>"
          }
        ]
      }
    },
    "name": "useHookComponent",
    "group": "ReactHook",
    "examples": [
      {
        "title": "parent.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst DefaultComponent = () => <div>Default or Placeholder component</div>\n\nexport props => {\n    const MyComponent = useHookComponent('my-component', DefaultComponent);\n    return (\n        <div>\n            <MyComponent {...props} />\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "reactium-hooks.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst ReplacementComponent = () => <div>My Plugin's Component</div>\n\nReactium.Component.register('my-component', ReplacementComponent);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/component.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useIsContainer(element,container)",
    "title": "useIsContainer()",
    "name": "useIsContainer",
    "group": "ReactHook",
    "description": "<p>React hook that determines if the element is a child of the container. Useful for traversing the DOM to find out if an event or action happened within the specified container.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Node",
            "optional": false,
            "field": "element",
            "description": "<p>The inner most element. Consider this the starting point.</p>"
          },
          {
            "group": "Parameter",
            "type": "Node",
            "optional": false,
            "field": "container",
            "description": "<p>The outer most element. Consider this the destination.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example",
        "content": "import { useIsContainer } from 'reactium-core/sdk';\nimport React, { useEffect, useRef, useState } from 'react';\n\nexport const Dropdown = props => {\n    const container = useRef();\n\n    const [expanded, setExpanded] = useState(props.expanded || false);\n\n    const isContainer = useIsContainer();\n\n    const dismiss = e => {\n        // already dismissed? -> do nothing!\n        if (!expanded) return;\n\n        // e.target is inside container.current? -> do nothing!\n        if (isContainer(e.target, container.current)) return;\n\n        // e.target is outside container.current? -> collapse the menu\n        setExpanded(false);\n    };\n\n    const toggle = () => setExpanded(!expanded);\n\n    useEffect(() => {\n        if (!container.current || typeof window === 'undefined') return;\n\n        window.addEventListener('mousedown', dismiss);\n        window.addEventListener('touchstart', dismiss);\n\n        return () => {\n            window.removeEventListener('mousedown', dismiss);\n            window.removeEventListener('touchstart', dismiss);\n        }\n\n    }, [container.current]);\n\n    return (\n        <div ref={container}>\n            <button onClick={toggle}>Toggle Dropdown</button>\n            {expanded && (\n                <ul>\n                    <li><a href='#item-1' onClick={toggle}>Item 1</a></li>\n                    <li><a href='#item-2' onClick={toggle}>Item 2</a></li>\n                    <li><a href='#item-3' onClick={toggle}>Item 3</a></li>\n                </ul>\n            )}\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/is-container.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useRefs()",
    "title": "useRefs()",
    "group": "ReactHook",
    "name": "useRefs",
    "description": "<p>Creates a single reference object that can be managed using the <code>get</code>/<code>set</code>/<code>del</code>/<code>clear</code> functions.</p>",
    "examples": [
      {
        "title": "Usage",
        "content": "import React, { useEffect, useState } from 'react';\nimport { useRefs } from '@atomic-reactor/reactium-sdk-core';\n\nconst MyComponent = () => {\n    const refs = useRefs();\n    const [state, setState] = useState({ input: null });\n\n    const onClick = () => {\n        const inputElm = refs.get('input');\n        setState({ ...state, input: inputElm.value });\n        inputElm.value = '';\n    };\n\n    return (\n        <div ref={elm => refs.set('container', elm)}>\n            {state.input && <div>{state.input}</div>}\n            <input type='text' ref={elm => refs.set('input', elm)} />\n            <button onClick={onClick}>Update</button>\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "Proxy Reference Usage",
        "content": "// sometimes you need a forwarded ref to be a ref object from useRef() or React.createRef()\n// You can create proxy factory for the refs to achieve this.\nimport React, { useEffect, useState } from 'react';\nimport { EventForm } from '@atomic-reactor/reactium-ui';\nimport { useRefs } from '@atomic-reactor/reactium-sdk-core';\n\nconst MyComponent = () => {\n   const refs = useRefs();\n   // creates a factory for React.createRef() object to your refs\n   const refProxy = refs.createProxy('form');\n\n   const [state, setState] = useState({});\n\n   const onSubmit = e => {\n       const formRef = refs.get('form');\n       setState({ ...formRef.getValue() });\n   };\n\n   // EventForm expects a reference object, not a callback function\n   // When EventForm references ref.current, it will actually get refs.get('form').\n   // When EventForm sets the ref.current value, it will actually perform refs.set('form', value);\n   return (\n       <EventForm ref={refProxy} onSubmit={onSubmit}>\n           <input type='text' name=\"foo\" />\n           <button type=\"submit\">Submit the Form</button>\n       </EventForm>\n   );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/useRefs.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useRegisterHandle(id,cb,deps)",
    "title": "useRegisterHandle()",
    "description": "<p>React hook to create a new imperative handle reference, similar to <code>useImperativeHandle()</code> except that instead of using <code>React.forwardRef()</code> to attach the handle to a parent compenent ref. A ref is generated for you and is assigned the current value of the callback <code>cb</code>, is registered with <code>Reactium.Handle</code>, and made available to all other components at the object path <code>id</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Function that returns value to be assigned to the imperative handle reference.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": false,
            "field": "deps",
            "description": "<p>Array of values to watch for changes. When changed, your reference will be updated by calling <code>cb</code> again. All <code>Reactium.Handle.subscribe()</code> subscribers will be called on updates, and relevant <code>useHandle()</code> hooks will trigger rerenders.</p>"
          }
        ]
      }
    },
    "name": "useRegisterHandle",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": "src/named-exports/handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useRegisterSyncHandle(id,cb,deps)",
    "title": "useRegisterSyncHandle()",
    "description": "<p>React hook to create a new imperative handle reference, similar to <code>useRegisterHandle()</code> except that it returns a sync state object (see useSyncState) and will cause rerenders in the controlled component.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "initial",
            "description": "<p>value of the state handle.</p>"
          }
        ]
      }
    },
    "name": "useRegisterSyncHandle",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Counter.js",
        "content": "import React, { useState } from 'react';\nimport { useRegisterSyncHandle } from 'reactium-core/sdk';\n\nconst Counter = ({id = 1}) => {\n    const state = useRegisterSyncHandle('counter', {\n        foo: {\n            count: Number(id)\n        },\n    });\n\n    state.extend('incrementCount', () => {\n        state.set('foo.count', state.get('foo.count', id) + 1);\n    });\n\n    return (\n        <div>\n            <h1>Counter {id}</h1>\n            Count: {state.get('foo.count', id)}\n        </div>\n    );\n};\n\nexport default Counter;",
        "type": "json"
      },
      {
        "title": "CounterControl.js",
        "content": "import React from 'react';\nimport { useSelectHandle } from 'reactium-core/sdk';\n\nconst noop = () => {};\nconst CounterControl = () => {\n    const { handle, count } = useSelectHandle('counter', 'foo.count', 1);\n\n    // set state for Counter, as well as cause this component to rerender\n\n    return (\n        <div>\n            <h1>CounterControl</h1>\n            <button onClick={handle.incrementCount}>\n              Increment Counter ({count})\n            </button>\n        </div>\n    );\n};\n\nexport default CounterControl;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/sync-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useScrollToggle()",
    "title": "useScrollToggle()",
    "description": "<p>React hook to that returns a control allowing you to <code>enable</code>, <code>disable</code>, or <code>toggle</code> scroll locking on the body element. Also registers the returned handle as <code>BodyScroll</code>. To use the BodyScroll handle, you need only apply useSelectHandle() in one global component. See useSelectHandle() for information on using registered handles.</p>",
    "name": "useScrollToggle",
    "group": "ReactHook",
    "version": "1.2.7",
    "examples": [
      {
        "title": "NPM Usage",
        "content": "import { useScrollToggle } from '@atomic-reactor/reactium-sdk-core';",
        "type": "json"
      },
      {
        "title": "Reactium Usage",
        "content": "import { useScrollToggle } from 'reactium-core/sdk';",
        "type": "json"
      },
      {
        "title": "Modal.js",
        "content": "import React, { useRef } from 'react';\nimport ReactDOM from 'react-dom';\nimport {\n    cxFactory,\n    useScrollToggle,\n    useIsContainer,\n    useEventEffect,\n    useRegister\n    HookComponent,\n} from '@atomic-reactor/reactium-sdk-core';\n\n const Modal = () => {\n    const bodyScroll = useScrollToggle();\n    const handle = useRegisterSyncHandle('Modal', {\n        open: false,\n        Contents: {\n            Component: () => null,\n        },\n    });\n\n    // Close modal and disable scroll lock on body\n    handle.extend('close', () => {\n        handle.set('open', false);\n        bodyScroll.enable();\n    });\n\n    // Open modal, showing component, and stop scroll on body\n    handle.extend('open', Component => {\n        handle.set('Contents', { Component });\n        handle.set('open', true);\n        bodyScroll.disable();\n    });\n\n    const isContainer = useIsContainer();\n    const container = useRef();\n    const content = useRef();\n    const dismiss = e => {\n        if (\n            isContainer(e.target, container.current) &&\n            !isContainer(e.target, content.current)\n        ) {\n            handle.close();\n        }\n    };\n\n    useEventEffect(\n        window,\n        {\n            mousedown: dismiss,\n            touchstart: dismiss,\n        },\n        [container.current],\n    );\n\n    const cn = cxFactory('modal');\n    const Component = handle.get('Contents.Component', () => null);\n\n    return ReactDOM.createPortal(\n        <div\n            ref={container}\n            className={`${cn()} ${cn({ open: handle.get('open', false) })}`}>\n            <div ref={content} className={cn('contents')}>\n                <Component modal={handle} />\n            </div>\n        </div>,\n        document.querySelector('body'),\n    );\n};",
        "type": "json"
      },
      {
        "title": "LockToggle.js",
        "content": "import React from 'react';\nimport {\n    useSelectHandle,\n} from '@atomic-reactor/reactium-sdk-core';\n\n// Somewhere else in the app, useScrollToggle() has been invoked.\nconst LockToggle = () => {\n    const { handle: BodyScroll } = useSelectHandle('BodyScroll');\n    return (\n        <button onClick={BodyScroll.toggle}>\n        {\n            BodyScroll.get('enabled') ? 'Lock Scrolling' : 'Unlock Scrolling'\n        }\n        </button>\n    );\n};",
        "type": "json"
      }
    ],
    "filename": "src/named-exports/useScrollToggle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useSelectHandle(id,cb,deps)",
    "title": "useSelectHandle()",
    "description": "<p>React hook to subscribe to updates to state on an imperative handle created by useRegisterSyncHandle. See useRegisterSyncHandle for full example.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "String|Array|Function",
            "optional": false,
            "field": "selector",
            "description": "<p>object path string or array, or selector function passed the sync state object (see useSyncState); returns seleted state</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "default",
            "description": "<p>default selected value (if selector is String or Array)</p>"
          }
        ]
      }
    },
    "name": "useSelectHandle",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": "src/named-exports/sync-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useStatus(initialStatus)",
    "title": "useStatus()",
    "group": "ReactHook",
    "name": "useStatus",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "initialStatus",
            "defaultValue": "pending",
            "description": "<p>The initial status of the hook.</p>"
          }
        ]
      }
    },
    "description": "<p>Synchronously set a status value that can be checked within a function scope without updating the state of the component. Useful when doing asynchronous activities and the next activity depends on a status of some sort from the previous activity.</p> <p>Returns [status:String, setStatus:Function, isStatus:Function, getStatus:Function]</p> <h3>status</h3> <p>The current asynchronous status value. (is accurate once per render)</p> <h3>setStatus(status:String, forceRender:Boolean = false)</h3> <p>Set the status value. If forceRender is true, a rerender will be triggered. <em><strong>Beware:</strong></em> forceRender may have unintended consequence and should be used in last status before re-rendering situations only.</p> <h3>isStatus(statuses:Array)</h3> <p>Check if the current status matches the statuses passed.</p> <h3>getStatus()</h3> <p>Get the synchrounous value of the status. This can matter if you need to set and check the value in the same render cycle.</p>",
    "version": "0.0.0",
    "filename": "src/named-exports/useStatus.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useSyncHandle(id,updateEvent)",
    "title": "useSyncHandle()",
    "description": "<p>React hook to subscribe to updates for a registered sync handle.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'. Identifies the full path to an imperative handle.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "updateEvent",
            "defaultValue": "set",
            "description": "<p>Trigger update of the consuming component when EventTarget event of this type is dispatched. Defaults tot 'set'.</p>"
          }
        ]
      }
    },
    "name": "useSyncHandle",
    "group": "ReactHook",
    "version": "0.0.0",
    "filename": "src/named-exports/sync-handle.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useSyncState(initialState,updateEvent)",
    "title": "useSyncState()",
    "name": "useSyncState",
    "group": "ReactHook",
    "description": "<p>Intended to provide an object to get and set state synchrounously, while providing a <code>EventTarget</code> object that can dispatch a <code>set</code> event whenever the state is changed. The hook will also dispatch a <code>change</code> event whenever the synced state changes. The hook can also listen for a specified event on the <code>EventTarget</code> object, and update the synced state with the <code>event.detail</code> property when the event is dispatched.</p> <p>The hook uses the <code>ReactiumSyncState</code> class to implement the synced state and <code>EventTarget</code> behavior. The class uses the <a href=\"https://github.com/mariocasciaro/object-path\"><code>object-path</code></a> module to manipulate the state object, and provides the following methods:</p> <ul> <li><code>get(path, defaultValue)</code>: Gets the value at the specified path in the synced state, or the entire synced state if no path is provided. If the value at the specified path is <code>undefined</code>, returns the provided default value instead.</li> <li><code>set(path, value)</code>: Sets the value at the specified path in the synced state, or replaces the entire synced state if no path is provided. The <code>path</code> parameter can be a string or array, representing a path in the object, or <code>undefined</code> to replace the entire object. Dispatches a <code>set</code> event. If the new value is different from the previous value, also dispatches a <code>change</code> event.</li> <li><code>set(path, value, update)</code>: Sets the value at the specified path in the synced state, or replaces the entire synced state if no path is provided. If <code>update</code> is <code>true</code>, dispatches a <code>set</code> event. If the new value is different from the previous value and <code>update</code> is <code>true</code>, also dispatches a <code>change</code> event. The <code>path</code> parameter can be a string or array, representing a path in the object, or <code>undefined</code> to replace the entire object.</li> <li><code>extend(prop, method)</code>: Extends the <code>ReactiumSyncState</code> instance with the provided method, bound to the instance.</li> </ul>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "initialState",
            "description": "<p>The initial state of the synced state.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "updateEvent",
            "defaultValue": "set",
            "description": "<p>The event name to listen for on the <code>EventTarget</code> object. When the event is dispatched, the hook will update the synced state with the <code>event.detail</code> property, and trigger a rerender of the React component.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Simple",
        "content": "import React from 'react';\nimport { useSyncState } from '@atomic-reactor/reactium-sdk-core';\n\nconst ExampleComponent = () => {\n    const [syncState, setSyncState] = useSyncState({ count: 0 });\n\n    return (\n        <>\n            <div>Count: {syncState.get('count')}</div>\n            <button onClick={() => setSyncState({ count: syncState.get('count') + 1 })}>\n                Increment\n            </button>\n        </>\n    );\n};",
        "type": "json"
      },
      {
        "title": "get and set",
        "content": "import { useSyncState } from '@atomic-reactor/reactium-sdk-core';\n\nfunction MyComponent() {\n  const syncState = useSyncState({ foo: 'bar' });\n\n  const handleClick = () => {\n    // Get the entire synced state\n    console.log(syncState.get()); // { foo: 'bar' }\n\n    // Get a property of the synced state\n    console.log(syncState.get('foo')); // 'bar'\n\n    // Update a property of the synced state\n    syncState.set('foo', 'baz');\n    console.log(syncState.get('foo')); // 'baz'\n\n    // Replace the entire synced state\n    syncState.set({ foo: 'bar', baz: 'qux' });\n    console.log(syncState.get()); // { foo: 'bar', baz: 'qux' }\n  };\n\n  return <button onClick={handleClick}>Update State</button>;\n}",
        "type": "json"
      },
      {
        "title": "Form Usage",
        "content": "import { useSyncState } from '@atomic-reactor/reactium-sdk-core';\n\nfunction MyForm() {\n  const syncState = useSyncState({\n    user: {\n      name: 'John Doe',\n      age: 30,\n      address: {\n        street: '123 Main St',\n        city: 'New York',\n        state: 'NY',\n      },\n    },\n  });\n\n  const handleChange = (event) => {\n    const { name, value } = event.target;\n    syncState.set(name, value);\n  };\n\n  return (\n    <form>\n      <label htmlFor=\"name\">Name:</label>\n      <input\n        type=\"text\"\n        id=\"name\"\n        name=\"user.name\"\n        value={syncState.get('user.name')}\n        onChange={handleChange}\n      />\n      <br />\n      <label htmlFor=\"age\">Age:</label>\n      <input\n        type=\"number\"\n        id=\"age\"\n        name=\"user.age\"\n        value={syncState.get('user.age')}\n        onChange={handleChange}\n      />\n      <br />\n      <label htmlFor=\"street\">Street:</label>\n      <input\n        type=\"text\"\n        id=\"street\"\n        name=\"user.address.street\"\n        value={syncState.get('user.address.street')}\n        onChange={handleChange}\n      />\n      <br />\n      <label htmlFor=\"city\">City:</label>\n      <input\n        type=\"text\"\n        id=\"city\"\n        name=\"user.address.city\"\n        value={syncState.get('user.address.city')}\n        onChange={handleChange}\n      />\n      <br />\n      <label htmlFor=\"state\">State:</label>\n      <input\n        type=\"text\"\n        id=\"state\"\n        name=\"user.address.state\"\n        value={syncState.get('user.address.state')}\n        onChange={handleChange}\n      />\n      <br />\n    </form>\n  );\n}",
        "type": "json"
      }
    ],
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "ReactiumSyncState",
            "optional": false,
            "field": "syncState",
            "description": "<p>The <code>ReactiumSyncState</code> instance returned by the hook.</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/named-exports/useSyncState.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "ReactHook",
    "url": "useZoneComponents(zone)",
    "title": "useZoneComponents()",
    "description": "<p>A React hook used in the <code>Zone</code> component to determine what components should currently be rendered. Useful to observe a zone in another component. If you want to observe to the zone components without necessarily causing a rerender in your component, use <code>Reactium.Zone.getZoneComponents()</code> (to get a list of components in the zone), alone or in combination with <code>Reactium.Zone.subscribe()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": false,
            "field": "dereference",
            "defaultValue": "true",
            "description": "<p>If true, returns the current value of the components in the zone, separate from the reference. Otherwise, returns the ReactiumSyncState object. This can be useful if you wish to use the components value with a non-memoized value.</p>"
          }
        ]
      }
    },
    "name": "useZoneComponents",
    "group": "ReactHook",
    "examples": [
      {
        "title": "Example",
        "content": "import React from 'react';\nimport { useZoneComponents } from 'reactium-core/sdk';\n\nexport props => {\n    const zoneComponents = useZoneComponents('my-zone');\n\n    return (\n        <div>\n            Components in Zone: {zoneComponents.length}\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "NoDereference",
        "content": "import React from 'react';\nimport { useZoneComponents } from 'reactium-core/sdk';\n\n// Use this method when the zone components are not refreshing smoothly on\n// rendering.\nexport props => {\n    const zoneComponents = useZoneComponents('my-zone', false);\n\n    return (\n        <div>\n            Components in Zone: {zoneComponents.get().length}\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/Zone.js",
    "groupTitle": "ReactHook"
  },
  {
    "type": "Object",
    "url": "Cache",
    "title": "Cache",
    "version": "3.0.3",
    "name": "Cache",
    "group": "Reactium.Cache",
    "description": "<p>Cache allows you to easily store application data in memory.</p>",
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.clear()",
    "title": "Cache.clear()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.clear",
    "description": "<p>Delete all cached values.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Cache.clear();",
        "type": "json"
      }
    ],
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.del(key)",
    "title": "Cache.del()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.del",
    "description": "<p>Delete the value for a given key. Returns <code>{Boolean}</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to delete. If the value is an <code>{Object}</code> you can use an object path to delete a specific part of the value. The updated value is then returned.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123, blah: 'hahaha' } }\nReactium.Cache.del('foo.bar'); // returns: { blah: 'hahaha' }\nReactium.Cache.del('foo');     // returns: true",
        "type": "json"
      }
    ],
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.get(key)",
    "title": "Cache.get()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.get",
    "description": "<p>Retrieves the value for a given key. If the value is not cached <code>null</code> is returned.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>The key to retrieve. If the value is an <code>{Object}</code> you can use an object path for the key. If no key is specified the entire cache is returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": true,
            "field": "default",
            "description": "<p>The default value to return if key is not found.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Given the cached value: { foo: { bar: 123 } }\nReactium.Cache.get('foo.bar'); // returns: 123;\nReactium.Cache.get('foo');     // returns: { bar: 123 }",
        "type": "json"
      }
    ],
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.keys()",
    "title": "Cache.keys()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.keys",
    "description": "<p>Returns an array of the cached keys.</p>",
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.memsize()",
    "title": "Cache.memsize()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.memsize",
    "description": "<p>Returns the number of entries taking up space in the cache.</p>",
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.merge(values)",
    "title": "Cache.merge()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.merge",
    "description": "<p>Merges the supplied values object with the current cache. Any existing entries will remain in cache. Duplicates will be overwritten unless <code>option.skipDuplicates</code> is <code>true</code>. Entries that would have exipired since being merged will expire upon merge but their timeoutCallback will not be invoked. Returns the new size of the cache.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "values",
            "description": "<p>Key value pairs to merge into the cache.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// Give the existing cache: { foo: 'bar' }\n\nReactium.Cache.merge({\n    test: {\n        value: 123,\n        expire: 5000,\n    },\n});\n\nReactium.Cache.get()\n// returns: { foo: 'bar', test: 123 }",
        "type": "json"
      }
    ],
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.set(key,value,timeout,timeoutCallback)",
    "title": "Cache.set()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.set",
    "description": "<p>Sets the value for a given key. If the value is an <code>{Object}</code> and is already cached, you can use an object path to update a specific part of the value. Returns the cached value.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The key to set. If the key is an object path and the key does not exist, it will be created.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "value",
            "description": "<p>The value to cache.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "timeout",
            "description": "<p>Remove the value in the specified time in milliseconds. If no timeout value specified, the value will remain indefinitely.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": true,
            "field": "timeoutCallback",
            "description": "<p>Function called when the timeout has expired. The timeoutCallback will be passed the key and value as arguments.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "// The following are equivalent\nReactium.Cache.set('foo', { bar: 123 });\nReactium.Cache.set('foo.bar', 123);\n\n// Set to expire in 5 seconds\nReactium.Cache.set('error', 'Ivnalid username or password', 5000);\n\n// Set to expire in 5 seconds and use a timeoutCallback\nReactium.Cache.set('foo', { bar: 456 }, 5000, (key, value) => console.log(key, value));",
        "type": "json"
      }
    ],
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.size()",
    "title": "Cache.size()",
    "version": "3.0.3",
    "group": "Reactium.Cache",
    "name": "Cache.size",
    "description": "<p>Returns the current number of entries in the cache.</p>",
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Cache.subscribe(key,cb)",
    "title": "Cache.subscribe()",
    "group": "Reactium.Cache",
    "name": "Cache.subscribe",
    "description": "<p>Subscribe to cache changes that impact a particular key. Returns an unsubscribe function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "key",
            "description": "<p>object path of the cache value (array or string)</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>The callback function to call when impacting changes have been made to the subscribed cache. Changes include any set/put, delete, clear, merge, or expiration that <em>may</em> impact the value you care about.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "const foo = Reactium.Cache.get('values.foo');\nReactium.Cache.subscribe('values.foo', ({op, ...params}) => {\n    switch(op) {\n        case 'set': {\n            const { key, value } = params;\n            // do something with new value if applicable\n            // you can see the key that impacted the cache value\n            break;\n        }\n\n        case 'del': {\n            // the key that was deleted\n            const { key } = params;\n            // do something about the deletion\n            break;\n        }\n\n        case 'expire': {\n            // do something about expiration (which will have impacted your value for sure)\n            // this will never be called if your value doesn't expire\n            break;\n        }\n\n        case 'merge': {\n            // complete cache object after merge\n            // may impact you, you'll have to check\n            const { obj } = params;\n            if (op.get(obj, 'values.foo') !== foo) {\n                // do something\n            }\n            break;\n        }\n\n        default:\n        break;\n    }\n});",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/cache/index.js",
    "groupTitle": "Reactium.Cache"
  },
  {
    "type": "Function",
    "url": "Component.register(hook,component,order)",
    "title": "Component.register()",
    "group": "Reactium.Component",
    "name": "Component.register",
    "description": "<p>Register a React component to be used with a specific useHookComponent React hook. This must be called before the useHookComponent that defines the hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "hook",
            "description": "<p>The hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "component",
            "description": "<p>component(s) to be output by useHookComponent</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "order",
            "description": "<p>precedent of this if Component.register is called multiple times (e.g. if you are trying to override core or another plugin)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "reactium-hooks.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst ReplacementComponentA = () => <div>My Plugin's Component</div>\nconst ReplacementComponentB = () => <div>My Alternative Component</div>\n\n// Simple Version\nReactium.Component.register('my-component', ReplacementComponentA);\n\n// Advanced Form using Reactium.Hook SDK\nReactium.Hook.register('my-component', async (...params) => {\n    const context = params.pop(); // context is last argument\n    const [param] = params;\n    if (param === 'test') {\n        context.component = ReplacementComponentA;\n    } else {\n        context.component = ReplacementComponentB;\n    }\n}\n})",
        "type": "json"
      },
      {
        "title": "parent.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// component to be used unless overriden by Reactium.Component.register()\nconst DefaultComponent = () => <div>Default or Placeholder component</div>\n\nexport props => {\n    const MyComponent = useHookComponent('my-component', DefaultComponent, 'test');\n    return (\n        <div>\n            <MyComponent {...props} />\n        </div>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/component/index.js",
    "groupTitle": "Reactium.Component"
  },
  {
    "type": "Function",
    "url": "Handle.get(id)",
    "title": "Handle.get()",
    "description": "<p>Get a specific imperative handle reference, by object path (id). If id is full object path to the handle, returns a React reference if it exists, otherwise <code>undefined</code>. If id is partial object path, returns object containing one or more references if the path exists, otherwise 'undefined'.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          }
        ]
      }
    },
    "name": "Handle.get",
    "group": "Reactium.Handle",
    "examples": [
      {
        "title": "CountList.js",
        "content": "import React from 'react';\nimport Counter from './Counter';\nimport CounterControl from './CounterControl';\n\nconst CountList = props => {\n    return (\n        <>\n            <Counter id='1'/>\n            <Counter id='2'/>\n            <CounterControl />\n        </>\n    );\n};\n\nexport default CountList;",
        "type": "json"
      },
      {
        "title": "Counter.js",
        "content": "import React, { useState } from 'react';\nimport { useRegisterHandle } from 'reactium-core/sdk';\n\nconst Counter = ({id = 1}) => {\n    const [count, setCount] = useState(Number(id));\n\n    // hook form of Handle.register and Handle.unregister\n    // handles ref creation for you\n    useRegisterHandle(['counter', id], () => ({\n        increment: () => setCount(count + 1),\n    }), [count]);\n\n    return (\n        <div>\n            <h1>Counter {id}</h1>\n            Count: {count}\n        </div>\n    );\n};\n\nexport default Counter;",
        "type": "json"
      },
      {
        "title": "CounterControl.js",
        "content": "import React from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst CounterControl = () => {\n   // get object with all handles in the \"counter\" partial path\n    const handles = Reactium.Handle.get('counter');\n\n    const click = () => {\n       // equivalent to getting handle 'counter.1' and `counter.2` separately\n       // loop through all counters and call increment on click\n        Object.values(handles).forEach(({current}) => current.increment())\n    };\n\n    return (\n        <div>\n            <h1>CounterControl</h1>\n            <button onClick={click}>Increment All Counters</button>\n        </div>\n    );\n};\n\nexport default CounterControl;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.list()",
    "title": "Handle.list()",
    "description": "<p>Get full object containing all current reference handles.</p>",
    "name": "Handle.list",
    "group": "Reactium.Handle",
    "version": "0.0.0",
    "filename": "src/sdks/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.register(id,ref)",
    "title": "Handle.register()",
    "description": "<p>Register an imperative handle reference. See <code>useRegisterHandle()</code> React hook for easier pattern for functional components.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          },
          {
            "group": "Parameter",
            "type": "Ref",
            "optional": false,
            "field": "ref",
            "description": "<p>React reference created with <code>React.createRef()`` or </code>React.useRef()`.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "update",
            "defaultValue": "true",
            "description": "<p>Update <code>useHandle</code> subscribers of this handle id.</p>"
          }
        ]
      }
    },
    "name": "Handle.register",
    "group": "Reactium.Handle",
    "examples": [
      {
        "title": "MyControllableComponent.js",
        "content": "import React, {useEffect, useState, useRef} from 'react';\nimport Reactium from 'reactium-core/sdk';\n\n// This component is externally controllable on registered handle\n// with id: 'controlled.handle' or ['controlled', 'handle']\nexport default () => {\n    const [count, setCount] = useState(1);\n    const increment = () => setCount(count + 1);\n    const ref = useRef({\n        increment,\n    });\n\n    useEffect(() => {\n        Reactium.register('controlled.handle', ref);\n        return () => Reactium.unregister('controlled.handle');\n    }, [count]);\n\n    return (<div>Count is {count}</div>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.subscribe(cb)",
    "title": "Handle.subscribe()",
    "description": "<p>Subscribe to changes in imperative handle references (registrations and unregistrations). Returns unsubscribe function.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>callback to be called when a handle is registered or unregistered</p>"
          }
        ]
      }
    },
    "name": "Handle.subscribe",
    "group": "Reactium.Handle",
    "examples": [
      {
        "title": "MyComponent.js",
        "content": "import React, {useState, useEffect} from 'react';\nimport Reactium from 'reactium-core/sdk';\nimport op from 'object-path'\n\nexport default () => {\n    const [handle, updateHandle] = useState(Reactium.Handle.get('path.to.handle'));\n    useEffect(() => Reactium.Handle.subscribe(() => {\n        const h = Reactium.Handle.get('path.to.handle');\n        if (handle.current !== h.current) updateHandle(h);\n    }), []);\n\n    const doSomething = () => {\n        if (op.has(handle, 'current.action')) handle.current.action;\n    };\n\n    return (<button onClick={doSomething}>Some Action</button>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Handle.unregister(id)",
    "title": "Handle.unregister()",
    "description": "<p>Unregister an imperative handle reference. See <code>Handle.register()</code> for example usage.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "id",
            "description": "<p>Array of properties, or <code>.</code> separated object path. e.g. ['path','to','handle'] or 'path.to.handle'</p>"
          }
        ]
      }
    },
    "name": "Handle.unregister",
    "group": "Reactium.Handle",
    "version": "0.0.0",
    "filename": "src/sdks/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Objectt",
    "url": "Reactium.Handle",
    "title": "Handle",
    "name": "Reactium.Handle",
    "description": "<p>Similar concept to an imperative handle created when using <code>React.forwardRef()</code> and the <code>useImperativeHandle()</code> React hook. Reactium provides the <code>Reactium.Handle</code> object to manage references created in your components to allow imperative control of your component from outside the component. This is used when you wish to change the internal state of your component from outside using a technique other than changing the component <code>props</code> (i.e. declarative control).</p> <p>This technique makes use of references created with <code>React.createRef()</code> or the <code>useRef()</code> hook for functional components. The developer can then assign the <code>current</code> property of this reference to be an object containing methods or callbacks (i.e. methods that can invoke <code>this.setState()</code> or the update callback returned by <code>useState()</code> hook) that will cause the state of the component to change (and rerender).</p> <p>By registering this &quot;handle reference&quot; on the <code>Reactium.Handle</code> singleton, other distant components can exercise imperative control over your component.</p> <p>For developers that prefer the use of React hooks, Reactium provides two hooks for your use: <code>useRegisterHandle()</code> and <code>useHandle()</code> to register and use these handles respectively.</p>",
    "group": "Reactium.Handle",
    "version": "0.0.0",
    "filename": "src/sdks/handle/index.js",
    "groupTitle": "Reactium.Handle"
  },
  {
    "type": "Function",
    "url": "Hook.flush(name)",
    "title": "Hook.flush()",
    "name": "Hook.flush",
    "description": "<p>Clear all registered callbacks for a hook.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "type",
            "defaultValue": "async",
            "description": "<p>'async' or 'sync' hooks</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.list()",
    "title": "Hook.list()",
    "name": "Hook.list",
    "description": "<p>Register a hook callback.</p>",
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.register(name,callback,order,id,domain)",
    "title": "Hook.register()",
    "name": "Hook.register",
    "description": "<p>Register a hook callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>async function (or returning promise) that will be called when the hook is run. The hook callback will receive any parameters provided to Hook.run, followed by a context object (passed by reference to each callback).</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>order of which the callback will be called when this hook is run.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the unique id. If not provided, a uuid will be generated</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "domain",
            "description": "<p>domain the hook belongs to. Useful for deregistering a whole set of hook callbacks from one domain.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Hook.register('plugin-init', async context => {\n// mutate context object asynchrounously here\n    console.log('Plugins initialized!');\n}, Enums.priority.highest);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.registerSync(name,callback,order,id,domain)",
    "title": "Hook.registerSync()",
    "name": "Hook.registerSync",
    "description": "<p>Register a sync hook callback.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>function returning promise that will be called when the hook is run. The hook callback will receive any parameters provided to Hook.run, followed by a context object (passed by reference to each callback).</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>order of which the callback will be called when this hook is run.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>the unique id. If not provided, a uuid will be generated</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "domain",
            "description": "<p>domain the hook belongs to. Useful for deregistering a whole set of hook callbacks from one domain.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Hook.registerSync('my-sync-hook', context => {\n    // mutate context object synchrounously here\n    console.log('my-sync-hook run!');\n}, Enums.priority.highest);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.run(name,...params)",
    "title": "Hook.run()",
    "name": "Hook.run",
    "description": "<p>Run hook callbacks.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context object passed to each callback (after other variadic parameters)</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.runSync(name,...params)",
    "title": "Hook.runSync()",
    "name": "Hook.runSync",
    "description": "<p>Run hook callbacks sychronously.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic)</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Object",
            "optional": false,
            "field": "context",
            "description": "<p>context object passed to each callback (after other variadic parameters)</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.unregister(id)",
    "title": "Hook.unregister()",
    "name": "Hook.unregister",
    "description": "<p>Unregister a registered hook callback by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the unique id provided by Hook.register() or Hook.list()</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Hook.unregisterDomain(name,domain)",
    "title": "Hook.unregisterDomain()",
    "name": "Hook.unregisterDomain",
    "description": "<p>Unregister all of a specific hook's callbacks from one domain.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>the hook name</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "domain",
            "description": "<p>the domain used when the callback was registered</p>"
          }
        ]
      }
    },
    "group": "Reactium.Hook",
    "version": "0.0.0",
    "filename": "src/sdks/hook/index.js",
    "groupTitle": "Reactium.Hook"
  },
  {
    "type": "Function",
    "url": "Plugin.isActive(ID)",
    "title": "Plugin.isActive()",
    "group": "Reactium.Plugin",
    "name": "Plugin.isActive",
    "description": "<p>Determine if a plugin ID is active.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Plugin.isActive('Media');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Plugin.list()",
    "title": "Plugin.list()",
    "group": "Reactium.Plugin",
    "name": "Plugin.list",
    "description": "<p>Return the list of registered plugins.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Plugin.register(ID,order)",
    "title": "Plugin.register()",
    "name": "Plugin.register",
    "description": "<p>Register a Reactium plugin.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>Priority of the plugin initialization respective to other existing plugins.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Plugin",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst newReducer = (state = { active: false }, action) => {\n    if (action.type === 'ACTIVATE') {\n        return {\n            ...state,\n            active: true,\n        };\n    }\n    return state;\n};\n\nconst register = async () => {\n    await Reactium.Plugin.register('myPlugin');\n    Reactium.Reducer.register('myPlugin', newReducer);\n};\n\nregister();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Plugin.unregister(ID)",
    "title": "Plugin.unregister()",
    "name": "Plugin.unregister",
    "description": "<p>Unregister a Reactium plugin by unique id. This can only be called prior to the <code>plugin-dependencies</code> hook, or <code>Reactium.Plugin.ready === true</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the plugin id</p>"
          }
        ]
      }
    },
    "group": "Reactium.Plugin",
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// Before Reactium.Plugin.ready\nReactium.Hook.register('plugin-dependencies', () => {\n    // Prevent myPlugin registration callback from occurring\n    Reactium.Plugin.unregister('myPlugin');\n    return Promise.resolve();\n}, Enums.priority.highest)",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/plugin/index.js",
    "groupTitle": "Reactium.Plugin"
  },
  {
    "type": "Function",
    "url": "Prefs.clear(key)",
    "title": "Prefs.clear()",
    "version": "0.0.17",
    "description": "<p>Clear one or more preferences.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>If specified as an object-path, will unset a specific preference path. Otherwise, all preferences will be cleared.</p>"
          }
        ]
      }
    },
    "name": "Prefs.clear",
    "group": "Reactium.Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nReactium.Prefs.clear();",
        "type": "json"
      }
    ],
    "filename": "src/sdks/prefs/index.js",
    "groupTitle": "Reactium.Prefs"
  },
  {
    "type": "Function",
    "url": "Prefs.get(key,defaultValue)",
    "title": "Prefs.get()",
    "version": "0.0.17",
    "description": "<p>Get one or more preferences by object path.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "key",
            "description": "<p>If specified as an object-path, will get a specific preference by this path. Otherwise, all preferences will be returned.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "defaultValue",
            "description": "<p>The value to return if the preference has not been set.</p>"
          }
        ]
      }
    },
    "name": "Prefs.get",
    "group": "Reactium.Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst myPref = Reactium.Prefs.get('my.object.path', { someDefault: 'foo' });",
        "type": "json"
      }
    ],
    "filename": "src/sdks/prefs/index.js",
    "groupTitle": "Reactium.Prefs"
  },
  {
    "type": "Function",
    "url": "Prefs.set(key,value)",
    "title": "Prefs.set()",
    "version": "0.0.17",
    "description": "<p>Get one or more preferences by object path.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "key",
            "description": "<p>The object-path to use to set the value.</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "value",
            "description": "<p>The value to set to the key.</p>"
          }
        ]
      }
    },
    "name": "Prefs.set",
    "group": "Reactium.Prefs",
    "examples": [
      {
        "title": "Example",
        "content": "import Reactium from 'reactium-core/sdk';\n\nReactium.Prefs.set('my.object.path', { value: 'foo' });",
        "type": "json"
      }
    ],
    "filename": "src/sdks/prefs/index.js",
    "groupTitle": "Reactium.Prefs"
  },
  {
    "type": "Object",
    "url": "Reactium.Pulse.Task",
    "title": "Pulse.Task",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task",
    "description": "<p>Pulse Task object that performs the heavy lifting for the Pulse API.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.ID",
    "title": "Pulse.Task.ID",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.ID",
    "description": "<p>[read-only] The unique ID of the task. Returns: <code>String</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.attempt",
    "title": "Pulse.Task.attempt",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.attempt",
    "description": "<p>[read-only] The current attempt for the active task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.delay",
    "title": "Pulse.Task.delay",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.attempt",
    "description": "<p>The current attempt for the active task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.attempts",
    "title": "Pulse.Task.attempts",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.attempts",
    "description": "<p>The number of times a task will retry before it fails. Default: <code>-1</code>. You can set this value after the task has started.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.autostart",
    "title": "Pulse.Task.autostart",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.autostart",
    "description": "<p>[read-only] If the task autastarted upon creation. Default: <code>true</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.complete",
    "title": "Pulse.Task.complete",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.complete",
    "description": "<p>[read-only] Relevant only when the <code>repeat</code> property is higher than 1. Returns: <code>Boolean</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.count",
    "title": "Pulse.Task.count",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.count",
    "description": "<p>[read-only] The current number of times the task has succeeded. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.error",
    "title": "Pulse.Task.error",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.error",
    "description": "<p>[read-only] The current error message if applicable. Returns: <code>string</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.failed",
    "title": "Pulse.Task.failed",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.failed",
    "description": "<p>[read-only] Expresses if the current task has reached the maximum attempts. Returns: <code>Boolean</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.now()",
    "title": "Pulse.Task.now()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.now",
    "description": "<p>Force run the task without waiting for it's delay. If the task is running this is a <code>noop</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.progress",
    "title": "Pulse.Task.progress",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.progress",
    "description": "<p>[read-only] The current amount of the repeat that has been completed. Relevant only when <code>repeat</code> is higher than 1. Returns: <code>0-1</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.repeat",
    "title": "Pulse.Task.repeat",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.repeat",
    "description": "<p>The current number of times to run the task. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.retry()",
    "title": "Pulse.Task.retry()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.retry",
    "description": "<p>Force a retry of the task. Useful for when you want to manually handle retries within your callback function.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.start()",
    "title": "Pulse.Task.start()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.start",
    "description": "<p>Start the task. Useful for when you want manually start a task in your callback function.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.status",
    "title": "Pulse.Task.status",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.status",
    "description": "<p>[read-only] The current status of the task. For comparing the status use the Pulse.ENUMS.STATUS values</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "const task = Pulse.get('MyTask');\nif (task.status === Pulse.ENUMS.STATUS.STOPPED) {\n    task.start();\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.stop()",
    "title": "Pulse.Task.stop()",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.stop",
    "description": "<p>Stop the task</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.timer",
    "title": "Pulse.Task.timer",
    "group": "Reactium.Pulse.Task",
    "name": "Reactium.Pulse.Task.timer",
    "description": "<p>[read-only] The reference to the current setTimeout. This value will change for each task run. Returns: <code>Number</code>.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse.Task"
  },
  {
    "type": "Function",
    "url": "Pulse.get(ID)",
    "title": "Pulse.get()",
    "group": "Reactium.Pulse",
    "name": "Pulse.get",
    "description": "<p>Retrieve a registered task. Returns a <code>Pulse.Task</code> object.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The ID of the task.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "const task = Reactium.Pulse.get('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.register(ID,callback,options,params)",
    "title": "Pulse.register()",
    "group": "Reactium.Pulse",
    "name": "Pulse.register",
    "description": "<p>Register a new task. The callback function can be any function and supports returning a <code>Promise</code> from the function. If a <code>Promise</code> is rejected, or the callback function returns an <code>Error</code> object or <code>false</code>, a retry will be triggered if possible. In cases where no more retries can be executed, the task will fail.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The unique ID of the task.</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>The function to execute when the task is run. The first parameter passed to the callback function will be a reference to the current task object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": true,
            "field": "options",
            "description": "<p>The <code>Pulse.Task</code> configuration object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..attempts",
            "defaultValue": "-1",
            "description": "<p>Number of times to retry a task. By default the task will retry indefinitely.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "..autostart",
            "defaultValue": "true",
            "description": "<p>Start the task when it is registered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..delay",
            "defaultValue": "1000",
            "description": "<p>Time in milliseconds before the task is run again. The task will not run again until after it's callback has been executed.</p>"
          },
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "..repeat",
            "defaultValue": "-1",
            "description": "<p>Number of times to repeat the task. Used in determining if the task is complete. A task with -1 as the value will never complete.</p>"
          },
          {
            "group": "Parameter",
            "type": "Arguments",
            "optional": true,
            "field": "params",
            "description": "<p>Additional parameters to pass to the callback function.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "import React, { useEffect } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n  const myFunction = (task, ...params) => {\n      // Do something here\n      const result = 1 === 2;\n\n      if (task.failed) { // Attempted the task 5 times\n          console.log('myFunction FAILED after', task.attempts, 'attempts with the following parameters:', ...params);\n      }\n\n      if (task.complete) { // Succeeded 5 times\n          console.log('myFunction COMPLETED after', task.attempts, 'attempts with the following parameters:', ...params);\n      }\n\n      // Trigger a retry because we're returning `false`\n      return result;\n  };\n\n  useEffect(() => {\n      // Register myFunction as a task\n      Reactium.Pulse.register('MyComponent', myFunction, {\n          attempts: 5,\n          delay: 1000,\n          repeat: 5\n      }, 'param 1', 'param 2', 'param 3');\n\n      // Unregister task when the component unmounts\n      return () => Reactium.Pulse.unregister('MyComponent');\n  }, [Reactium.Pulse]);\n\n  return <div>MyComponent</div>;\n};\n\nexport default MyComponent;",
        "type": "json"
      },
      {
        "title": "Persist",
        "content": "// For cases where you want the task to persist even after the component has\n// been unmounted or the route has changed causing a rerender:\n\n\nimport React, { useEffect } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n\n  useEffect(() => {\n      Reactium.Pulse.register('MyComponent', MyComponent.staticTask);\n  }, [Reactium.Pulse]);\n\n  return <div>MyComponent</div>\n};\n\nMyComponent.staticTask = (task, ...params) => new Promise((resolve, reject) => {\n  // Perform an async task\n  setTimeout(() => resolve('this is awkward...'), 10000);\n});\n\nexport default MyComponent;",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.start(ID)",
    "title": "Pulse.start()",
    "group": "Reactium.Pulse",
    "name": "Pulse.start",
    "description": "<p>Start a registered task if it is stopped.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.start('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.startAll()",
    "title": "Pulse.startAll()",
    "group": "Reactium.Pulse",
    "name": "Pulse.startAll",
    "description": "<p>Start all stopped tasks.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.startAll();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.stop(ID)",
    "title": "Pulse.stop()",
    "group": "Reactium.Pulse",
    "name": "Pulse.stop",
    "description": "<p>Stop a registered task if it is running.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.stop('MyTask');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.stopAll()",
    "title": "Pulse.stopAll()",
    "group": "Reactium.Pulse",
    "name": "Pulse.stopAll",
    "description": "<p>Stop all running registered tasks.</p>",
    "examples": [
      {
        "title": "Example usage:",
        "content": "Reactium.Pulse.stopAll();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Function",
    "url": "Pulse.unregister(ID)",
    "title": "Pulse.unregister()",
    "group": "Reactium.Pulse",
    "name": "Pulse.unregister",
    "description": "<p>Stop and unregister a task. If the task is running, it's current attempt will resolve before the task is removed.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>The task unique ID.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example usage:",
        "content": "useEffect(() => {\n   // Register myFunction as a task\n   Reactium.Pulse.register('MyComponent', myFunction, {\n       attempts: 5,\n       delay: 1000,\n       repeat: 5\n   }, 'param 1', 'param 2', 'param 3');\n\n   // Unregister task when the component unmounts\n   return () => Reactium.Pulse.unregister('MyComponent');\n}, [Reactium.Pulse]);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Object",
    "url": "Reactium.Pulse",
    "title": "Pulse",
    "group": "Reactium.Pulse",
    "name": "Reactium.Pulse",
    "description": "<p>Simple interface for creating long or short polls.</p> <h3>Motivation</h3> <p>Often is the case where you find yourself sprinkling <code>setTimeout</code> or <code>setInterval</code> all over your code and before you know it, you have so many or rewrite the same structures over and over with a slight twist here and there. The Pulse API is designed to lighten the load on those situations and give a clean interface to easily create and manage polls.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Property",
    "url": "Reactium.Pulse.Task.reset()",
    "title": "Pulse.Task.reset()",
    "group": "Reactium.Pulse",
    "name": "Reactium.Pulse.Task.reset",
    "description": "<p>Resets the task's attempt count and run count. Useful for catastrophic failures in your callback function.</p>",
    "version": "0.0.0",
    "filename": "src/sdks/pulse/index.js",
    "groupTitle": "Reactium.Pulse"
  },
  {
    "type": "Class",
    "url": "Fullscreen",
    "title": "Fullscreen",
    "group": "Reactium.Utilities",
    "name": "Fullscreen",
    "description": "<p>Cross browser utility for toggling fullscreen mode.</p>",
    "parameter": {
      "fields": {
        "Event": [
          {
            "group": "Event",
            "type": "Event",
            "optional": false,
            "field": "fullscreenchange",
            "description": "<p>Triggered when the browser's fullscreen state changes.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Usage:",
        "content": " // isExpanded()\n Reactium.Utils.Fullscreen.isExpanded();\n\n // isCollapsed()\n Reactium.Utils.Fullscreen.isCollapsed();\n\n // collapse()\n Reactium.Utils.Fullscreen.collapse();\n\n // expand()\n Reactium.Utils.Fullscreen.expand();\n\n // toggle()\n Reactium.Utils.Fullscreen.toggle();\n\n // Event: fullscreenchange\nimport React, { useEffect, useState } from 'react';\nimport Reactium from 'reactium-core/sdk';\n\nconst MyComponent = () => {\n    const [state, setState] = useState(Reactium.Utils.Fullscreen.isExpanded());\n\n    const update = () => {\n        setState(Reactium.Utils.Fullscreen.isExpanded());\n    }\n\n    useEffect(() => {\n        // ssr safety\n        if (typeof document === 'undefined') return;\n\n        // listen for fullscreenchange\n        document.addEventListener('fullscreenchange', update);\n\n        // prevent memory leak\n        return () => {\n            document.removeEventListener('fullscreenchange', update);\n        };\n    });\n\n    return (<div>{state}</div>);\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/named-exports/fullscreen.js",
    "groupTitle": "Reactium.Utilities"
  },
  {
    "type": "Function",
    "url": "Fullscreen.collapse()",
    "title": "Fullscreen.collapse()",
    "group": "Reactium.Utilities",
    "name": "Fullscreen.collapse",
    "description": "<p>Exits fullscreen mode.</p>",
    "version": "0.0.0",
    "filename": "src/named-exports/fullscreen.js",
    "groupTitle": "Reactium.Utilities"
  },
  {
    "type": "Function",
    "url": "Fullscreen.expand()",
    "title": "Fullscreen.expand()",
    "group": "Reactium.Utilities",
    "name": "Fullscreen.expand",
    "description": "<p>Enters fullscreen mode.</p>",
    "version": "0.0.0",
    "filename": "src/named-exports/fullscreen.js",
    "groupTitle": "Reactium.Utilities"
  },
  {
    "type": "Function",
    "url": "Fullscreen.isCollapsed()",
    "title": "Fullscreen.isCollapsed()",
    "group": "Reactium.Utilities",
    "name": "Fullscreen.isCollapsed",
    "description": "<p>Determines if the browser window is not fullscreen. Returns <code>true|false</code>.</p>",
    "version": "0.0.0",
    "filename": "src/named-exports/fullscreen.js",
    "groupTitle": "Reactium.Utilities"
  },
  {
    "type": "Function",
    "url": "Fullscreen.isExpanded()",
    "title": "Fullscreen.isExpanded()",
    "group": "Reactium.Utilities",
    "name": "Fullscreen.isExpanded",
    "description": "<p>Determines if the browser window is fullscreen. Returns <code>true|false</code>.</p>",
    "version": "0.0.0",
    "filename": "src/named-exports/fullscreen.js",
    "groupTitle": "Reactium.Utilities"
  },
  {
    "type": "Function",
    "url": "Fullscreen.toggle()",
    "title": "Fullscreen.toggle()",
    "group": "Reactium.Utilities",
    "name": "Fullscreen.toggle",
    "description": "<p>Enters or Exits fullscreen mode depending on the current fullscreen state.</p>",
    "version": "0.0.0",
    "filename": "src/named-exports/fullscreen.js",
    "groupTitle": "Reactium.Utilities"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.abbreviatedNumber(number)",
    "title": "Utils.abbreviatedNumber()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.abbreviatedNumber",
    "description": "<p>Abbreviate a long number to a string.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": false,
            "field": "number",
            "description": "<p>The number to abbreviate.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Utils.abbreviatedNumber(5000);\n// Returns: 5k\n\nReactium.Utils.abbreviatedNumber(500000);\n// Returns .5m",
        "type": "json"
      }
    ],
    "filename": "src/sdks/utils/number.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.breakpoint(width)",
    "title": "Utils.breakpoint()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.breakpoint",
    "description": "<p>Get the breakpoint of a window width.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Number",
            "optional": true,
            "field": "width",
            "defaultValue": "window.innerWidth",
            "description": "<p>Custom width to check. Useful if you have a resize event and want to skip the function from looking up the value again. Reactium.Utils.breakpoint(); // Returns: the current window.innerWidth breakpoint.</p> <p>Reactium.Utils.breakpoint(1024); // Returns: sm</p>"
          }
        ]
      }
    },
    "filename": "src/sdks/utils/window.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.breakpoints()",
    "title": "Utils.breakpoints",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.breakpoints",
    "description": "<p>Get breakpoints from browser body:after psuedo element or <code>Utils.BREAKPOINTS_DEFAULT</code> if unset or node.</p> <table> <thead> <tr> <th>Breakpoint</th> <th>Range</th> </tr> </thead> <tbody> <tr> <td>xs</td> <td>0 - 640</td> </tr> <tr> <td>sm</td> <td>641 - 990</td> </tr> <tr> <td>md</td> <td>991 - 1280</td> </tr> <tr> <td>lg</td> <td>1281 - 1440</td> </tr> <tr> <td>xl</td> <td>1600+</td> </tr> </tbody> </table>",
    "filename": "src/sdks/utils/window.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Utils.cxFactory",
    "url": "Utils.cxFactory",
    "title": "Utils.cxFactory",
    "description": "<p>Create a CSS classname namespace (prefix) to use on one or more sub-class. Uses the same syntax as the <code>classnames</code> library.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "namespace",
            "description": "<p>the CSS class prefix</p>"
          }
        ]
      }
    },
    "name": "Utils.cxFactory",
    "group": "Reactium.Utils",
    "examples": [
      {
        "title": "Usage:",
        "content": "import Reactium from 'reactium-core/sdk';\nimport React from 'react';\n\nconst MyComponent = props => {\n    const cx = Reactium.Utils.cxFactory('my-component');\n    const { foo } = props;\n\n    return (\n        <div className={cx()}>\n            <div className={cx('sub-1')}>\n                Classes:\n                .my-component-sub-1\n            </div>\n            <div className={cx('sub-2', { bar: foo === 'bar' })}>\n                Classes:\n                .my-component-sub-2\n                .my-component-foo\n            </div>\n        </div>\n    );\n};\n\nMyComponent.defaultProps = {\n    foo: 'bar',\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/utils/classnames.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isWindow(iframeWindow)",
    "title": "Utils.isWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "Utils.isWindow",
    "description": "<p>Determine if the window object has been set. Useful when developing for server side rendering.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "Reactium.Utils.isWindow();\n// Returns: true if executed in a browser.\n// Returns: false if executed in node (server side rendering).",
        "type": "json"
      }
    ],
    "filename": "src/sdks/utils/window.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Utils.registryFactory(name,idField)",
    "title": "Utils.registryFactory()",
    "description": "<p>Creates a new instance of a simple registry object. Useful for creating an SDK registry for allowing plugins to register &quot;things&quot;. e.g. components that will render inside a component, callbacks that will run.</p> <p>More documentation needed:</p> <ul> <li>register method: used to register an object on registry</li> <li>unregister method: used to unregister an object on registry</li> <li>list property: getter for list of registered objects</li> <li>protect method: called to prevent overwriting an id on registry</li> <li>unprotect method: called to again allow overwriting on id</li> </ul>",
    "name": "Utils.registryFactory",
    "group": "Reactium.Utils",
    "examples": [
      {
        "title": "Basic Reactium Usage",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// trivial example of creation of new registry\nconst myRegistryPlugin = async () => {\n    await Reactium.Plugin.register('MyRegistryPlugin', Reactium.Enums.priority.highest);\n\n    // Using Plugin API to extend the SDK\n    // Adds a new registry to the SDK called `MyRegistry`\n    Reactium.MyRegistry = Reactium.Utils.registryFactory('MyRegistry');\n};\nmyRegistryPlugin();\n\n// trivial example of registry usage\nconst anotherPlugin = async () => {\n    await Reactium.Plugin.register('AnotherPlugin');\n\n    // register object with id 'anotherId' on registry\n    Reactium.MyRegistry.register('anotherId', {\n        foo: 'bar',\n    });\n\n    // iterate through registered items\n    Reactium.MyRegistry.list.forEach(item => console.log(item));\n\n    // unregister object with id 'anotherId'\n    Reactium.MyRegistry.unregister('anotherId');\n};\nanotherPlugin();",
        "type": "json"
      },
      {
        "title": "Basic Core Usage",
        "content": "import SDK from '@atomic-reactor/reactium-sdk-core';\nexport default SDK.Utils.registryFactory('MyRegistry');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/utils/registry.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "function",
    "url": "Utils.splitParts",
    "title": "splitParts",
    "name": "Utils.splitParts",
    "group": "Reactium.Utils",
    "description": "<p>splitParts is a utility function that allows you to easily interpolate React components into a string. It works by tokenizing the string, allowing you to identify specific parts that you want to replace with a React component. You can then use the replace method to specify the values for these tokens, and the value method to get an array of the parts, which you can map over and return the appropriate React components for each part. This can be useful for situations where you want to dynamically render a string that includes both plain text and React components.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "strVal",
            "description": "<p>The input string to tokenize</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "import React from 'react';",
        "content": "\nimport React from 'react';\nimport Reactium, { __ } from 'reactium-core/sdk';\nimport moment from 'moment';\nimport md5 from 'md5';\n\nconst Gravatar = props => {\n    const { email } = props;\n    return (\n        <img\n            className='gravatar'\n            src={`https://www.gravatar.com/avatar/${md5(\n                email.toLowerCase(),\n            )}?size=50`}\n            alt={email}\n        />\n    );\n};\n\nexport default props => {\n    const description = __('%email% updated post %slug% at %time%');\n    const parts = Reactium.Utils.splitParts(description);\n    Object.entries(props).forEach(([key, value]) => {\n        parts.replace(key, value);\n    });\n\n    return (\n        <span className='by-line'>\n            {parts.value().map(part => {\n                // arbitrary React component possible\n                const { key, value } = part;\n\n                switch (key) {\n                    case 'email': {\n                        return <Gravatar key={key} email={value} />;\n                    }\n                    case 'time': {\n                        return (\n                            <span key={key} className='time'>\n                                {moment(value).fromNow()}\n                            </span>\n                        );\n                    }\n                    default: {\n                        // plain string part\n                        return <span key={key}>{value}</span>;\n                    }\n                }\n            })}\n        </span>\n    );\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/utils/splitter.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Utils.annotationsFactory",
    "url": "annotationsFactory(namespace,type)",
    "title": "annotationsFactory()",
    "name": "annotationsFactory",
    "group": "Reactium.Utils",
    "description": "<p>Tool for creating documentation objects from @<namespace> annotations.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "namespace",
            "defaultValue": "reactium",
            "description": "<p>Default the annotation namepace.</p>"
          },
          {
            "group": "Parameter",
            "type": "string",
            "optional": true,
            "field": "type",
            "defaultValue": "async",
            "description": "<p>The annotation processors will be processed async or sync. Returns annotations function.</p>"
          }
        ],
        "annotations": [
          {
            "group": "annotations",
            "type": "string",
            "optional": true,
            "field": "string",
            "description": "<p>the string to parse</p>"
          },
          {
            "group": "annotations",
            "type": "object",
            "optional": true,
            "field": "options",
            "description": "<p>the options used by processors</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "example.md",
        "content": "# Hello",
        "type": "json"
      },
      {
        "title": "Simple",
        "content": "import { annotationsFactory } from '@atomic-reactor/reactium-sdk-core';\nimport { dirname } from '@atomic-reactor/dirname';\nimport path from 'node:path';\n\nconst rootPath = dirname(import.meta.url);\n\nconst processAnnotations = async () => {\n const annotations = annotationsFactory();\n \n // replaces file tag with markdown\n const output = annotations('@reactium apidoc.example some content [file:example.md]', { rootPath })\n \n // output:\n // {\n //   \"apidoc\": {\n //      \"example\": \"some content # Hello\"\n //   }\n // }\n}",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/utils/annotation.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isBrowserWindow(iframeWindow)",
    "title": "Utils.isBrowserWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "isBrowserWindow",
    "description": "<p>If global window object exists, and does not have boolean isJSDOM flag, this context may be browser or electron. Use isElectronWindow() to know the latter.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import { isBrowserWindow } from 'reactium-core/sdk';\nisBrowserWindow();\n// Returns: true if executed in browser or electron.\n// Returns: false if executed on server.",
        "type": "json"
      }
    ],
    "filename": "src/sdks/utils/window.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isElectronWindow(iframeWindow)",
    "title": "Utils.isElectronWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "isElectronWindow",
    "description": "<p>Determine if window is an electron window. Useful for detecting electron usage.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import { isElectronWindow } from 'reactium-core/sdk';\nisElectronWindow();\n// Returns: true if executed in electron.\n// Returns: false if executed in node or browser.",
        "type": "json"
      }
    ],
    "filename": "src/sdks/utils/window.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Reactium.Utils.isServerWindow(iframeWindow)",
    "title": "Utils.isServerWindow()",
    "version": "3.1.14",
    "group": "Reactium.Utils",
    "name": "isServerWindow",
    "description": "<p>If global window object exists, and has boolean isJSDOM flag, this context is a JSON window object (not in the browser or electron)</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Window",
            "optional": true,
            "field": "iframeWindow",
            "description": "<p>iframe window reference.</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Example Usage:",
        "content": "import { isServerWindow } from 'reactium-core/sdk';\nisServerWindow();\n// Returns: true if executed in server SSR context.\n// Returns: false if executed in browser or electron.",
        "type": "json"
      }
    ],
    "filename": "src/sdks/utils/window.js",
    "groupTitle": "Reactium.Utils"
  },
  {
    "type": "Function",
    "url": "Zone.addComponent(component,capabilities,strict)",
    "title": "Zone.addComponent()",
    "name": "Zone.addComponent",
    "description": "<p>Register a component to a component zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "zone",
            "description": "<p>component object, determines what component renders in a zone, what order and additional properties to pass to the component.</p>"
          },
          {
            "group": "Parameter",
            "type": "Array",
            "optional": true,
            "field": "capabilities",
            "description": "<p>list of capabilities to check before adding component to zone. Can also be added as property of zone component object.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "strict",
            "defaultValue": "true",
            "description": "<p>true to only add component if all capabilities are allowed, otherwise only one capability is necessary</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "plugin-example.js",
        "content": "import SomeComponent from './path/to/SomeComponent';\nimport Reactium from 'reactium-core/sdk';\n\nReactium.Plugin.register('myPlugin').then(() => {\n    // When the component is initialized, `<SomeComponent>` will render in\n    // `\"zone-1\"`\n    Reactium.Zone.addComponent({\n        // Required - Component to render. May also be a string, if the component\n        // has been registered with Reactium.Component.register().\n        // @type {Component|String}\n        component: SomeComponent,\n\n        // Required - One or more zones this component should render.\n        // @type {String|Array}\n        zone: ['zone-1'],\n\n        // By default components in zone are rendering in ascending order.\n        // @type {Number}\n        order: {{order}},\n\n        // [Optional] - additional search subpaths to use to find the component,\n        // if String provided for component property.\n        // @type {[type]}\n        //\n        // e.g. If component is a string 'TextInput', uncommenting the line below would\n        // look in components/common-ui/form/inputs and components/general to find\n        // the component 'TextInput'\n        // paths: ['common-ui/form/inputs', 'general']\n\n        // [Optional] - Additional params:\n        //\n        // Any arbitrary free-form additional properties you provide below, will be provided as params\n        // to the component when rendered.\n        //\n        // e.g. Below will be provided to the MyComponent, <MyComponent pageType={'home'} />\n        // These can also be used to help sort or filter components, or however you have your\n        // component use params.\n        // @type {Mixed}\n        // pageType: 'home',\n    })\n})",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addFilter(zone,filter,order)",
    "title": "Zone.addFilter()",
    "name": "Zone.addFilter",
    "description": "<p>Add a component zone filter function, used to filter which components will appear in <code>&lt;Zone /&gt;</code> Returns unique id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this filter will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "filter",
            "description": "<p>the filter function that will be passed each zone component object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your filter will take in list of filters in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "reactium-hooks.js",
        "content": "import Reactium from 'reactium-core/sdk';\n\nconst registerPlugin = async () => {\n    await Reactium.Plugin.register('MyVIPView');\n    const permitted = await Reactium.User.can(['vip.view']);\n\n    // Hide this component if current user shouldn't see vip components\n    const filter = component => {\n      return component.type !== 'vip' || !permitted\n    };\n\n    const id = Reactium.Zone.addFilter('zone-1', filter)\n}\nregisterPlugin();",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addMapper(zone,mapper,order)",
    "title": "Zone.addMapper()",
    "name": "Zone.addMapper",
    "description": "<p>Add a component zone mapping function, used to augment the zone component object before passed to <code>&lt;Zone /&gt;</code>. Returns unique id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this mapper will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "mapper",
            "description": "<p>the mapper function that will be passed each component object</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your mapper will take in list of mappers in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nimport React from 'react';\nimport VIPBadge from './some/path/Vip';\n// for this zone, if component is of type \"vip\", add a VIPBage component to the component\n// components children property\nconst mapper = (component) => {\n    if (component.type === 'vip')\n    component.children = [\n        <VIPBadge />\n    ];\n    return component;\n};\nconst id = Reactium.Zone.addMapper('zone-1', mapper)",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.addSort(zone,sortBy,reverse,order)",
    "title": "Zone.addSort()",
    "name": "Zone.addSort",
    "description": "<p>Add a component zone sort critera, used to augment the zone component object before passed to <code>&lt;Zone /&gt;</code></p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone this sort will apply to</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "sortBy",
            "defaultValue": "order",
            "description": "<p>zone component object property to sort the list of components by</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "reverse",
            "defaultValue": "false",
            "description": "<p>reverse sort order</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": true,
            "field": "order",
            "defaultValue": "Enums.priority.neutral",
            "description": "<p>the priority your sort will take in list of sorts in this zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\n\n// sort by zone component.type property\nReactium.Zone.addSort('zone-1', 'type')",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.getZoneComponent(zone,id)",
    "title": "Zone.getZoneComponent()",
    "name": "Zone.getZoneComponent",
    "description": "<p>Get the component from a zone by its id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone name to get components from</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the registered component, specified in the object passed to Zone.addComponent() or returned by it.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.getZoneComponents(zone,raw)",
    "title": "Zone.getZoneComponents()",
    "name": "Zone.getZoneComponents",
    "description": "<p>Get existing registrations for a zone, by default goes through mapping, sorting, filtering. Add raw=true to get unadulterated list, even if they may not be renderable in the Zone. Returns the object used in Zone.addComponent()</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone name to get components from</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "raw",
            "defaultValue": "false",
            "description": "<p>Set to true to get all components, whether or not they are currently filtered, and without mapping or extra sorting.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.hasZoneComponent(zone,id)",
    "title": "Zone.hasZoneComponent()",
    "name": "Zone.hasZoneComponent",
    "description": "<p>Returns true if component with id is present in the zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone name to get components from</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the registered component, specified in the object passed to Zone.addComponent() or returned by it.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeComponent(ID)",
    "title": "Zone.removeComponent()",
    "name": "Zone.removeComponent",
    "description": "<p>Removes a component added by <code>Zone.addComponent()</code> from a component zone by id.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the unique component object id.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeFilter(id)",
    "title": "Zone.removeFilter()",
    "name": "Zone.removeFilter",
    "description": "<p>Remove filter functions for a component zone for this component.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the filter to remove</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeFilter(filterId);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeMapper(id)",
    "title": "Zone.removeMapper()",
    "name": "Zone.removeMapper",
    "description": "<p>Remove mapping functions for a zone..</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the mapper to remove from the zone</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeMapper(mapperId);",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.removeSort(componentName,zone)",
    "title": "Zone.removeSort()",
    "name": "Zone.removeSort",
    "description": "<p>Remove sort critera for a component zone for this component. This should be called only: //   * @apiParam {String} zone the zone to remove this sort from</p>",
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "Example Usage",
        "content": "import Reactium from 'reactium-core/sdk';\nReactium.Zone.removeSort('myPlugin', 'zone-1');",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.subscribe(zone,cb)",
    "title": "Zone.subscribe()",
    "name": "Zone.subscribe",
    "description": "<p>Subscribe to components added, removed, or updated in a particular rendering zone. Returns an unsubscribe function. Call this function to unsubscribe from changes.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>the zone to subscribe to</p>"
          },
          {
            "group": "Parameter",
            "type": "Function",
            "optional": false,
            "field": "callback",
            "description": "<p>a function that will be called when a change occurs to zone.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "examples": [
      {
        "title": "useZoneComponents.js",
        "content": "import Reactium from 'reactium-core/sdk';\nimport { useState, useEffect } from 'react';\n\nexport const useZoneComponents = zone => {\n    const [components, updateComponents] = useState(Reactium.Zone.getZoneComponents(zone));\n\n    useEffect(() => Reactium.Zone.subscribe(zone, zoneComponents => {\n        updateComponents(zoneComponents)\n    }), [zone]);\n\n    return components;\n};",
        "type": "json"
      }
    ],
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Function",
    "url": "Zone.updateComponent(id,updatedComponent)",
    "title": "Zone.updateComponent()",
    "name": "Zone.updateComponent",
    "description": "<p>Register a component to a component zone.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "ID",
            "description": "<p>the unique component object id.</p>"
          },
          {
            "group": "Parameter",
            "type": "Object",
            "optional": false,
            "field": "updatedComponent",
            "description": "<p>updated zone component object, will be merged with existing.</p>"
          }
        ]
      }
    },
    "group": "Reactium.Zone",
    "version": "0.0.0",
    "filename": "src/sdks/zone/index.js",
    "groupTitle": "Reactium.Zone"
  },
  {
    "type": "Object",
    "url": "Registry",
    "title": "Registry",
    "group": "Reactium",
    "name": "Registry",
    "description": "<p>Reactium uses a number of registry objects used to registering all sorts of objects that will be used elsewhere in the framework. New registry objects are generally instanciated as singletons on the overall SDK.</p> <p>There are many registry objects attached by default to the SDK, and developers can create new ones using <code>Utils.registryFactory()</code>.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "listById",
            "description": "<p>get Object keyed by id of most recent (or highest order) registered objects, filtering out unregistered or banned objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "list",
            "description": "<p>get list of most recent (or highest order) registered objects, filtering out unregistered or banned objects.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "registered",
            "description": "<p>get list of all historically registrated objects, even duplicates, ordered by order property of object (defaults to 100).</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "protected",
            "description": "<p>get list of protected registrations ids</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "unregistered",
            "description": "<p>get list of all existing registered objects ids that have been subsequently unregistered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "banned",
            "description": "<p>get list of all banned objects ids.</p>"
          },
          {
            "group": "Parameter",
            "type": "Getter",
            "optional": false,
            "field": "mode",
            "description": "<p>get current mode (Default Utils.Registry.MODES.HISTORY)</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "get",
            "description": "<p><code>reg.get(id,defaultValue)</code> pass the identifier of an object get that object from the registry. Optionally provide a default value if the id doesn't exist in the registry.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isProtected",
            "description": "<p>pass the identifier of an object to see if it has been protected</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isRegistered",
            "description": "<p>pass the identifier of an object to see if it has been registered</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isUnRegistered",
            "description": "<p>pass the identifier of an object to see is NOT registered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "isBanned",
            "description": "<p>pass the identifier of an object to see if it has been banned</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "ban",
            "description": "<p><code>reg.ban(id)</code> pass the identifier of an object to ban. Banned objects can not be registered and will not be show in list. Useful when you have code that needs to preempt the registration of an object from code you do not control. E.g. a plugin is introducing undesireable or disabled functionality</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "cleanup",
            "description": "<p><code>reg.cleanup(id)</code> pass the identifier of an object to be purged from historical registrations (i.e. free up memory) Automatically performed in mode Utils.Registry.CLEAN</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "protect",
            "description": "<p><code>reg.protect(id)</code> pass the identifier of an object to protect. Protected objects can not be overridden or cleaned up.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "register",
            "description": "<p><code>reg.register(id,data)</code> pass an identifier and a data object to register the object. The identifier will be added if it is not already registered (but protected) and not banned.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unprotect",
            "description": "<p><code>reg.unprotect(id)</code> pass an identifier to unprotect an object</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unregister",
            "description": "<p><code>reg.unregister(id)</code> pass an identifier to unregister an object. When in HISTORY mode (default), previous registration will be retained, but the object will not be listed. In CLEAN mode, the previous registrations will be removed, unless protected.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "flush",
            "description": "<p><code>reg.flush()</code> clear all registrations. Resets registry to newly constructed state.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "subscribe",
            "description": "<p><code>reg.subscribe(cb,id)</code> Adds a callback to indicate changes to the registry. Callback is called on register, unregister, protect, unprotect, ban, cleanup, and flush. Returns unsubscribe function.</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unsubscribe",
            "description": "<p><code>reg.unsubscribe(id)</code> unsubscribe a subscriber by id</p>"
          },
          {
            "group": "Parameter",
            "type": "Method",
            "optional": false,
            "field": "unsubscribeAll",
            "description": "<p><code>reg.unsubscribeAll()</code> unsubscribe all subscribers to changes made on the registry</p>"
          }
        ],
        "register": [
          {
            "group": "register",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the data object to be registered</p>"
          },
          {
            "group": "register",
            "type": "Object",
            "optional": false,
            "field": "data",
            "description": "<p>the object to be registered</p>"
          }
        ],
        "subscribe": [
          {
            "group": "subscribe",
            "type": "Function",
            "optional": false,
            "field": "cb",
            "description": "<p>Callback to be invoked on changes to the registry.</p>"
          },
          {
            "group": "subscribe",
            "type": "String",
            "optional": true,
            "field": "id",
            "description": "<p>optional id of the callback, if you want to invoke unsubscribe manually by id, instead of the callback returned from subscribe method</p>"
          }
        ],
        "unsubscribe": [
          {
            "group": "unsubscribe",
            "type": "String",
            "optional": false,
            "field": "id",
            "description": "<p>the id of the subscriber to unsubscribe</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/sdks/utils/registry.js",
    "groupTitle": "Reactium"
  },
  {
    "type": "RegisteredComponent",
    "url": "Zone",
    "title": "Zone",
    "version": "3.1.19",
    "name": "Zone",
    "description": "<p>Component used to identify a &quot;zone&quot; in your application where any arbitrary components will render. Plugin components registered for this zone will dynamically render in the zone. Plugins can be registered statically in Reactium by creating a <code>plugin.js</code> file that exports a component definition (<code>arcli plugin component</code> to generate boilerplate for one), or using the Reactium SDK <code>Reactium.Zone.addComponent()</code> call.</p> <p>See also the Zone SDK for filtering, sorting, or mapping over plugin components for a zone.</p> <p>To generate an exportable plugin module, use the <code>arcli plugin module</code> command.</p>",
    "parameter": {
      "fields": {
        "Parameter": [
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "zone",
            "description": "<p>Identifier of the zone where plugin components will be rendered.</p>"
          },
          {
            "group": "Parameter",
            "type": "Boolean",
            "optional": true,
            "field": "passThrough",
            "defaultValue": "false",
            "description": "<p>When true, will provide a <code>components</code> property to children of Zone instead of rendering plugin components directly as siblings. This is useful when you wish to make plugin components available, but take more control over how they render.</p> <p>Example Passthrough Usage: Using the <code>jsx-parser</code> module, components could be provided to a JSXParser component, and the actual render of those components could be dictated by a string of JSX and data context provided by a CMS.</p>"
          },
          {
            "group": "Parameter",
            "type": "Mixed",
            "optional": false,
            "field": "...params",
            "description": "<p>any number of arbitrary parameters (variadic) can be provided to the Zone, and will be passed automatically as props on your plugin components when they are rendered.</p>"
          }
        ]
      }
    },
    "group": "Registered_Component",
    "examples": [
      {
        "title": "PageHeader.js",
        "content": "import React from 'react';\nimport { useHookComponent } from 'reactium-core/sdk';\n\n// PageHeader is not hard-coded, but adaptable by plugins\nexport default props => {\n    const Zone = useHookComponent('Zone');\n    return (\n        <div class='page-header'>\n            <Zone zone={'page-header'} />\n        </div>\n    );\n};",
        "type": "json"
      },
      {
        "title": "src/app/components/plugin-src/MyHeaderPlugin/index.js",
        "content": "import Reactium from 'reactium-core/sdk';\nimport MyHeaderWidget from './MyHeaderWidget';\n\nconst registerPlugin = async () => {\n    await Reactium.Plugin.register('MyHeaderPlugin');\n    Reactium.Zone.addComponent({\n        id: 'MyHeaderWidget',\n        zone: 'page-header',\n        component: MyHeaderWidget,\n    });\n};\nregisterPlugin();",
        "type": "json"
      },
      {
        "title": "src/app/components/plugin-src/MyHeaderPlugin/MyHeaderWidget.js",
        "content": "import React from 'react';\n\nexport default props => {\n   return (\n       <div class='my-header-widget'>\n           I will end up in the header zone\n       </div>\n   );\n};",
        "type": "json"
      }
    ],
    "filename": "src/named-exports/Zone.js",
    "groupTitle": "Registered_Component"
  }
] });
