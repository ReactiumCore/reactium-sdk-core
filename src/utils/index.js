import _ from 'underscore';
import SplitParts from './splitter';
import cn from 'classnames';
import Registry from './registry';

const Utils = {
    conditionalWindow: () => typeof window !== 'undefined' ? window : undefined,
    conditionalDocument: () => typeof document !== 'undefined' ? document : undefined,
};

/**
 * @api {Function} Reactium.Utils.isWindow(iframeWindow) Utils.isWindow()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName Utils.isWindow
 * @apiDescription Determine if the window object has been set. Useful when developing for server side rendering.
 * @apiParam {Window} [iframeWindow] iframe window reference.
 * @apiExample Example Usage:
Reactium.Utils.isWindow();
// Returns: true if executed in a browser.
// Returns: false if executed in node (server side rendering).
 */
Utils.isWindow = iWindow => {
    iWindow = iWindow || Utils.conditionalWindow();
    return typeof iWindow !== 'undefined';
};

/**
 * @api {Function} Reactium.Utils.isElectronWindow(iframeWindow) Utils.isElectronWindow()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName isElectronWindow
 * @apiDescription Determine if window is an electron window. Useful for detecting electron usage.
 * @apiParam {Window} [iframeWindow] iframe window reference.
 * @apiExample Example Usage:
import { isElectronWindow } from 'reactium-core/sdk';
isElectronWindow();
// Returns: true if executed in electron.
// Returns: false if executed in node or browser.
 */
Utils.isElectron = (iWindow) => {
    iWindow = iWindow || Utils.conditionalWindow();

    return (
        typeof iWindow !== 'undefined' &&
        iWindow.process &&
        iWindow.process.type
    );
};

/**
 * @api {Function} Reactium.Utils.isServerWindow(iframeWindow) Utils.isServerWindow()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName isServerWindow
 * @apiDescription If global window object exists, and has boolean isJSDOM flag, this
 context is a JSON window object (not in the browser or electron)
 * @apiParam {Window} [iframeWindow] iframe window reference.
 * @apiExample Example Usage:
import { isServerWindow } from 'reactium-core/sdk';
isServerWindow();
// Returns: true if executed in server SSR context.
// Returns: false if executed in browser or electron.
 */
Utils.isServerWindow = iWindow => {
    iWindow = iWindow || Utils.conditionalWindow();
    return Utils.isWindow(iWindow) && iWindow.isJSDOM;
};

/**
 * @api {Function} Reactium.Utils.isBrowserWindow(iframeWindow) Utils.isBrowserWindow()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName isBrowserWindow
 * @apiDescription If global window object exists, and does not have boolean isJSDOM flag, this
 context may be browser or electron. Use isElectronWindow() to know the latter.
 * @apiParam {Window} [iframeWindow] iframe window reference.
 * @apiExample Example Usage:
import { isBrowserWindow } from 'reactium-core/sdk';
isBrowserWindow();
// Returns: true if executed in browser or electron.
// Returns: false if executed on server.
 */
Utils.isBrowserWindow = iWindow => {
    iWindow = iWindow || Utils.conditionalWindow();
    return Utils.isWindow(iWindow) && !iWindow.isJSDOM;
};


Utils.BREAKPOINTS_DEFAULT = {
    xs: 640,
    sm: 990,
    md: 1280,
    lg: 1440,
    xl: 1600,
};

/**
 * @api {Function} Reactium.Utils.breakpoints() Utils.breakpoints
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName Utils.breakpoints
 * @apiDescription Get breakpoints from browser body:after psuedo element or `Utils.BREAKPOINTS_DEFAULT` if unset or node.

| Breakpoint | Range |
| ---------- | ------ |
| xs | 0 - 640 |
| sm | 641 - 990 |
| md | 991 - 1280 |
| lg | 1281 - 1440 |
| xl | 1600+ |
 */
Utils.breakpoints = (iWindow, iDocument) => {
    iWindow = iWindow || Utils.conditionalWindow();
    iDocument = iDocument || Utils.conditionalDocument();

    try {
        const after = iDocument.querySelector('body');
        const content = iWindow
            .getComputedStyle(after, ':after')
            .getPropertyValue('content');
        return JSON.parse(JSON.parse(content));
    } catch (error) {
        return Utils.BREAKPOINTS_DEFAULT;
    }
};

/**
 * @api {Function} Reactium.Utils.breakpoint(width) Utils.breakpoint()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName Utils.breakpoint
 * @apiDescription Get the breakpoint of a window width.
 * @apiParam {Number} [width=window.innerWidth] Custom width to check. Useful if you have a resize event and want to skip the function from looking up the value again.
Reactium.Utils.breakpoint();
// Returns: the current window.innerWidth breakpoint.

Reactium.Utils.breakpoint(1024);
// Returns: sm
 */
Utils.breakpoint = (width, iWindow, iDocument) => {
    iWindow = iWindow || Utils.conditionalWindow();
    iDocument = iDocument || Utils.conditionalDocument();

    width = width ? width : Utils.isWindow(iWindow) ? window.innerWidth : null;

    if (!width) {
        return 'sm';
    }

    const breaks = Utils.breakpoints(iWindow, iDocument);
    const keys = Object.keys(breaks);
    const vals = Object.values(breaks);

    const index = _.sortedIndex(vals, width);

    if (index >= keys.length) {
        return keys.pop();
    }
    if (index <= 0) {
        return keys.shift();
    }

    return keys[index];
};

/**
 * @api {Function} Reactium.Utils.abbreviatedNumber(number) Utils.abbreviatedNumber()
 * @apiVersion 3.1.14
 * @apiGroup Reactium.Utils
 * @apiName Utils.abbreviatedNumber
 * @apiDescription Abbreviate a long number to a string.
 * @apiParam {Number} number The number to abbreviate.
 * @apiExample Example Usage:
Reactium.Utils.abbreviatedNumber(5000);
// Returns: 5k

Reactium.Utils.abbreviatedNumber(500000);
// Returns .5m
 */
Utils.abbreviatedNumber = value => {
    if (!value || value === 0) {
        return;
    }

    const suffixes = ['', 'k', 'm', 'b', 't'];

    let newValue = value;

    if (value >= 1000) {
        const suffixNum = Math.floor(('' + value).length / 3);
        let shortValue = '';

        for (let precision = 2; precision >= 1; precision--) {
            shortValue = parseFloat(
                (suffixNum != 0
                    ? value / Math.pow(1000, suffixNum)
                    : value
                ).toPrecision(precision),
            );
            const dotLessShortValue = (shortValue + '').replace(
                /[^a-zA-Z 0-9]+/g,
                '',
            );
            if (dotLessShortValue.length <= 2) {
                break;
            }
        }

        if (shortValue % 1 != 0) {
            shortValue = shortValue.toFixed(1);
        }
        newValue = shortValue + suffixes[suffixNum];

        newValue = String(newValue).replace('0.', '.');
    }

    return newValue;
};

/**
 * @api {Function} Utils.splitParts(parts) Utils.splitParts()
 * @apiDescription Breaks formatted string (or array of strings), into flat
 * array of parts/nodes, inserting an object in array in the place of `%key%`.
 * Useful for tokenizing a translation string, and getting an array that can
 * easily be mapped into React components.
 * Returns an object with `replace` and `value` methods.

 * Call `replace(key,value)` method (chaining) as many times as necessary to replace all tokens.
 * Call `value()` method to get the final array of Part objects.
 * Call `reset()` to reset the SlipParts object to the original string without replacements for reuse.
 * @apiParam {Mixed} parts String containing tokens like `%key%` to be replaced.
 * @apiParam (replace) {String} key when calling `replace(key,value)`, the token `%${key}%`
 * will be replaced with an Part object key->value pair.
 * @apiParam (replace) {Mixed} value the value to use in the key->pair replacement
 * @apiParam (Part) {String} key the key in the keypair
 * @apiParam (Part) {Mixed} value the value in the keypair
 * @apiName Utils.splitParts
 * @apiGroup Reactium.Utils
 * @apiExample Usage
 import React from 'react';
 import Reactium, { __ } from 'reactium-core/sdk';
 import moment from 'moment';
 import md5 from 'md5';

 const Gravatar = props => {
     const { email } = props;
     return (
         <img
             className='gravatar'
             src={`https://www.gravatar.com/avatar/${md5(
                 email.toLowerCase(),
             )}?size=50`}
             alt={email}
         />
     );
 };

 export default props => {
     const description = __('%username% updated post %slug% at %time%');
     const parts = Reactium.Utils.splitParts(description)[
         ('email', 'slug', 'time')
     ].forEach(key => parts.replace(key, props[key]));

     return (
         <span className='by-line'>
             {parts.value().map(part => {
                 // arbitrary React component possible
                 const { key, value } = part;

                 switch (key) {
                     case 'email': {
                         return <Gravatar key={key} email={value} />;
                     }
                     case 'time': {
                         return (
                             <span key={key} className='time'>
                                 {moment(value).fromNow()}
                             </span>
                         );
                     }
                     default: {
                         // plain string part
                         return <span key={key}>{value}</span>;
                     }
                 }
             })}
         </span>
     );
 };
 */
Utils.splitParts = original => new SplitParts(original);

/**
 * @api {Utils.cxFactory} Utils.cxFactory Utils.cxFactory
 * @apiDescription Create a CSS classname namespace (prefix) to use on one or more
sub-class. Uses the same syntax as the `classnames` library.
 * @apiParam {String} namespace the CSS class prefix
 * @apiName Utils.cxFactory
 * @apiGroup Reactium.Utils
 * @apiExample Usage:
import Reactium from 'reactium-core/sdk';
import React from 'react';

const MyComponent = props => {
    const cx = Reactium.Utils.cxFactory('my-component');
    const { foo } = props;

    return (
        <div className={cx()}>
            <div className={cx('sub-1')}>
                Classes:
                .my-component-sub-1
            </div>
            <div className={cx('sub-2', { bar: foo === 'bar' })}>
                Classes:
                .my-component-sub-2
                .my-component-foo
            </div>
        </div>
    );
};

MyComponent.defaultProps = {
    foo: 'bar',
};
 */
Utils.cxFactory = namespace => (...params) =>
        cn(...params)
            .split(' ')
            .map(cls => _.compact([namespace, cls]).join('-'))
            .join(' ');

/**
 * @api {Function} Utils.registryFactory(name,idField) Utils.registryFactory()
 * @apiDescription Creates a new instance of a simple registry object. Useful
 for creating an SDK registry for allowing plugins to register "things". e.g.
 components that will render inside a component, callbacks that will run.

 More documentation needed:
 - register method: used to register an object on registry
 - unregister method: used to unregister an object on registry
 - list property: getter for list of registered objects
 - protect method: called to prevent overwriting an id on registry
 - unprotect method: called to again allow overwriting on id

 * @apiName Utils.registryFactory
 * @apiGroup Reactium.Utils
 * @apiExample Basic Reactium Usage
import Reactium from 'reactium-core/sdk';

// trivial example of creation of new registry
const myRegistryPlugin = async () => {
    await Reactium.Plugin.register('MyRegistryPlugin', Reactium.Enums.priority.highest);

    // Using Plugin API to extend the SDK
    // Adds a new registry to the SDK called `MyRegistry`
    Reactium.MyRegistry = Reactium.Utils.registryFactory('MyRegistry');
};
myRegistryPlugin();

// trivial example of registry usage
const anotherPlugin = async () => {
    await Reactium.Plugin.register('AnotherPlugin');

    // register object with id 'anotherId' on registry
    Reactium.MyRegistry.register('anotherId', {
        foo: 'bar',
    });

    // iterate through registered items
    Reactium.MyRegistry.list.forEach(item => console.log(item));

    // unregister object with id 'anotherId'
    Reactium.MyRegistry.unregister('anotherId');
};
anotherPlugin();

* @apiExample Basic Core Usage
import SDK from '@atomic-reactor/reactium-sdk-core';
export default SDK.Utils.registryFactory('MyRegistry');
 */
Utils.registryFactory = (name, idField, mode) => new Registry(name, idField, mode);

Utils.Registry = Registry;

export default Utils;
