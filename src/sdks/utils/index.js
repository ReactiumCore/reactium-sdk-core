import _ from 'underscore';
import SplitParts from './splitter';
import Registry from './registry';

import * as registryUtils from './registry';
import * as windowUtils from './window';
import * as splitterUtils from './splitter';
import * as numberUtils from './number';
import * as classnamesUtils from './classnames';

export * from './registry';
export * from './window';
export * from './splitter';
export * from './number';
export * from './classnames';

export { SplitParts, Registry };

export const Utils = {
    ...registryUtils,
    ...windowUtils,
    ...splitterUtils,
    ...numberUtils,
    ...classnamesUtils,
    SplitParts,
    Registry,
};

export default Utils;
