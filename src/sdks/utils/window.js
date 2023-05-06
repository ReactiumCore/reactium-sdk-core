import _ from 'underscore';

export const conditionalWindow = () =>
    typeof window !== 'undefined' ? window : undefined;
export const conditionalDocument = () =>
    typeof document !== 'undefined' ? document : undefined;

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
export const isWindow = (iWindow) => {
    iWindow = iWindow || conditionalWindow();
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
export const isElectronWindow = (iWindow) => {
    iWindow = iWindow || conditionalWindow();

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
export const isServerWindow = (iWindow) => {
    iWindow = iWindow || conditionalWindow();
    return isWindow(iWindow) && iWindow.isJSDOM;
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
export const isBrowserWindow = (iWindow) => {
    iWindow = iWindow || conditionalWindow();
    return isWindow(iWindow) && !iWindow.isJSDOM;
};

export const BREAKPOINTS_DEFAULT = {
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
export const breakpoints = (iWindow, iDocument) => {
    iWindow = iWindow || conditionalWindow();
    return iWindow.breakpoints || BREAKPOINTS_DEFAULT;
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
export const breakpoint = (width, iWindow, iDocument) => {
    iWindow = iWindow || conditionalWindow();
    iDocument = iDocument || conditionalDocument();

    width = width ? width : isWindow(iWindow) ? window.innerWidth : null;

    if (!width) {
        return 'sm';
    }

    const breaks = breakpoints(iWindow, iDocument);
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
