[![Build Status](https://travis-ci.org/Atomic-Reactor/reactium-sdk-core.svg?branch=master)](https://travis-ci.org/Atomic-Reactor/reactium-sdk-core)

# Reactium SDK Core

Core subset of Reactium SDK singleton and named exports.

## Install

```
npm install --save @atomic-reactor/reactium-sdk-core
```

## Usage

Non-Reactium projects
```js
import SDK, { Zone, useHookComponent } from '@atomic-reactor/reactium-sdk-core';
```

Reactium projects
```js
import SDK, { Zone, useHookComponent } from 'reactium-core/sdk';
```

## API Description

This project is best used with [Reactium](https://github.com/Atomic-Reactor/Reactium) but can also be used independently. See the [API documentation](https://atomic-reactor.github.io/reactium-sdk-core/).

**Note:** The API documentation link above is written with lots of examples to by used inside a Reactium app projects, but most examples will work if you import from the NPM module directly.

### SDK Objects

The primary SDK objects in this library are:
* **Cache**: For controlling runtime object cache in node or browser
* **Handle**: Registry that manages React handle references
* **Hook**: Registry for callbacks for async/sync "hook" invocations.
* **Component**: Registry for replaceable React component string tokens.
* **Pulse**: Registry for running recurring processes over time (like cron for React)
* **Zone**: Registry for React components to render in "rendering zones" (i.e. `<Zone />` component)
* **Prefs**: Allows you to manipulate local storage from React very quickly and easily.

### React Hooks

This SDK comes with a number of React hooks:
* **useHookComponent**: Use a React component registers to Component registry. Allows you to create string token component that can be implemented elsewhere.
* **useDerivedState**: Tool to managed derived React state from props (if you must).
* **useEventHandle**: Create an imperative handle that is also an implementation of EventTarget. Can be used in conjunction with useImperativeHandle (React built-in) or useRegisterHandle/useHandle (Reactium SDK hooks).
* **useEventEffect**: Quickly and easily add and remove event listeners.
* **useFocusEffect**: Get a true/false state when element is focused.
* **useFulfilledObject**: Helps you aggregate async data in React when all conditions are met / ready.
* **useRegisterHandle**: Register an imperative React handle that can be used anywhere in the app.
* **useHandle**: Use a registered imperative React handle by handle id.
* **useRegisterSyncHandle**: Register an imperative React handle that is also a sync state management object. (See useSyncState)
* **useSelectHandle**: Allows you to "select" state from a registered sync handle, and rerender your React component when the selection changes.
* **useIsContainer**: Determines if the element is a child of the container. Useful for traversing the DOM to find out if an event or action happened within the specified container.
* **useAsyncEffect**: Like useEffect, but with built-in protection for setting state async.
* **useStatus**: Helper hook for walking through enumerated states.
* **useSyncState**: A drop in replacement for useState that avoids async state update getting out of sync with your render. Also an EventTarget for event streaming state updates.
* **useRefs**: Manage multiple refs easily.
* **useEventRefs**: Like useRefs, but also an EventTarget for event streaming reference changes.
* **useScrollToggle**: Facilitates enabling or disabling body scrolling in the browser.

### Browser / App Utilities
* **Registry**: A generic subscribable registry class.
* **registryFactory**: A function that quickly create Registry objects.
* **cxFactory**: A function that will build a React className namespace, for easily passing a CSS context down through components.
* **splitParts**: A function that makes it easy to convert a tokenized string into a map of React components.
* **isWindow**: A function that detects the presence of a global "window" object.
* **isServer**: A function that detects if running on node.js (as opposed to in browser)
* **isServerWindow**: A functions for determining if the window object is actually on the server (using JSDOM) in Reactium.
* **isElectron**: A function for determining if the environment is actually Electron (not the web browser)

### React Components
* **Zone**: A "rendering zone" for other components to dynamically render.
* **HookComponent**: An "abstract component" which can be implemented elsewhere.

## ES Module Exports

As a reference, here is a full list of the library esmodule exports. (Just to make you aware of what is available in your `import` statements)

```js
{
    default: {
        Cache: Cache { _subscribers: {}, _subscribedPaths: {} },
        Component: Component {
            __name: 'Component',
            __idField: 'id',
            __registered: [Array],
            __protected: {},
            __unregister: {},
            __banned: {},
            __subscribers: {},
            __mode: 'CLEAN'
        },
        Enums: { cache: [Object], priority: [Object], Plugin: [Object] },
        Handle: Handle { handles: {}, subscriptions: {} },
        Hook: {
            action: [Object],
            actionIds: [Object],
            flush: [Function (anonymous)],
            unregister: [Function (anonymous)],
            _register: [Function (anonymous)],
            register: [Function (anonymous)],
            registerSync: [Function (anonymous)],
            list: [Function (anonymous)],
            _actions: [Function (anonymous)],
            run: [Function (anonymous)],
            runSync: [Function (anonymous)]
        },
        Pulse: Pulse {
        Task: [class PulseTask],
        Utils: {
            conditionalWindow: [Function: conditionalWindow],
            conditionalDocument: [Function: conditionalDocument],
            isWindow: [Function: isWindow],
            isElectronWindow: [Function: isElectronWindow],
            isServerWindow: [Function: isServerWindow],
            isBrowserWindow: [Function: isBrowserWindow],
            BREAKPOINTS_DEFAULT: [Object],
            breakpoints: [Function: breakpoints],
            breakpoint: [Function: breakpoint],
            abbreviatedNumber: [Function: abbreviatedNumber],
            splitParts: [Function: splitParts],
            cxFactory: [Function: cxFactory],
            registryFactory: [Function: registryFactory],
            Registry: [Function]
        },
        Plugin: {
            ready: false,
            callbacks: [Function (anonymous)],
            register: [Function (anonymous)],
            isActive: [Function (anonymous)],
            list: [Function (anonymous)],
            unregister: [Function (anonymous)]
        },
        Zone: {
            [Symbol(UNSUBSCRIBE)]: [Function (anonymous)],
            [Symbol(FILTER)]: [Function (anonymous)],
            [Symbol(MAP)]: [Function (anonymous)],
            [Symbol(SORT)]: [Function (anonymous)],
            [Symbol(UPDATE)]: [Function (anonymous)],
            [Symbol(INITIALIZED)]: false,
            [Symbol(ZONES)]: [Object]
        },
        Prefs: {
            clear: [Function: clear],
            get: [Function: get],
            set: [Function: set]
        },
        Server: { Middleware: [Registry] },
        version: '1.2.1'
    },
    Cache: [Getter],
    Component: [Getter],
    Enums: [Getter],
    Handle: [Getter],
    Hook: [Getter],
    Pulse: [Getter],
    Plugin: [Getter],
    Utils: [Getter],
    ZoneRegistry: [Getter],
    Prefs: [Getter],
    Server: [Getter],
    SplitParts: [Getter],
    Registry: [Getter],
    conditionalWindow: [Getter],
    conditionalDocument: [Getter],
    isWindow: [Getter],
    isElectronWindow: [Getter],
    isServerWindow: [Getter],
    isBrowserWindow: [Getter],
    BREAKPOINTS_DEFAULT: [Getter],
    breakpoints: [Getter],
    breakpoint: [Getter],
    abbreviatedNumber: [Getter],
    splitParts: [Getter],
    cxFactory: [Getter],
    registryFactory: [Getter],
    Zone: [Getter],
    useHookComponent: [Getter],
    useDerivedState: [Getter],
    ComponentEvent: [Getter],
    useEventHandle: [Getter],
    useEventEffect: [Getter],
    useFocusEffect: [Getter],
    useFulfilledObject: [Getter],
    useRegisterHandle: [Getter],
    useHandle: [Getter],
    useRegisterSyncHandle: [Getter],
    useSelectHandle: [Getter],
    useIsContainer: [Getter],
    useAsyncEffect: [Getter],
    useStatus: [Getter],
    useSyncState: [Getter],
    useScrollToggle: [Getter],
    createRefsProxyFactory: [Getter],
    useRefs: [Getter],
    useEventRefs: [Getter],
    SimpleZone: [Getter],
    PassThroughZone: [Getter],
    HookComponent: [Getter]
}
```
