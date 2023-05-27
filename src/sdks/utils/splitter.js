import _ from 'underscore';

const splitter = (parts, key, value) => {
    const search = `%${key}%`;
    if (typeof parts === 'string' && parts.includes(search)) {
        parts = parts.replace(search, '|FOUND_IT|');
        return _.compact(
            parts.split('|').map(part => {
                if (part === 'FOUND_IT')
                    return {
                        key,
                        value,
                        type: 'replacement',
                    };

                if (part === '') return;

                return part;
            }),
        );
    } else if (Array.isArray(parts)) {
        return _.flatten(parts.map(part => splitter(part, key, value)));
    } else {
        return parts;
    }
};

class SplitParts {
    constructor(strVal) {
        this.original = strVal;
        this.reset();
    }

    get original() {
        return this._original;
    }

    set original(strVal) {
        this._original = strVal;
    }

    reset() {
        this.parts = [this.original];
        return this;
    }

    replace(key, value) {
        this.parts = splitter(this.parts, key, value);
        return this;
    }

    value() {
        return this.parts.map(part => {
            if (typeof part === 'string')
                return {
                    key: part,
                    value: part,
                    type: 'part',
                };

            return part;
        });
    }
}
SplitParts.splitter = splitter;

export { SplitParts as default, SplitParts };

/**
 * @api {function} Utils.splitParts splitParts
 * @apiName Utils.splitParts
 * @apiGroup Reactium.Utils
 * @apiDescription splitParts is a utility function that allows you to easily interpolate React components into a string. It works by tokenizing the string, allowing you to identify specific parts that you want to replace with a React component. You can then use the replace method to specify the values for these tokens, and the value method to get an array of the parts, which you can map over and return the appropriate React components for each part. This can be useful for situations where you want to dynamically render a string that includes both plain text and React components.
 * @apiParam {String} strVal The input string to tokenize
 * @apiExample
 *
 * import React from 'react';
 * import Reactium, { __ } from '@atomic-reactor/reactium-core/sdk';
 * import moment from 'moment';
 * import md5 from 'md5';
 *
 * const Gravatar = props => {
 *     const { email } = props;
 *     return (
 *         <img
 *             className='gravatar'
 *             src={`https://www.gravatar.com/avatar/${md5(
 *                 email.toLowerCase(),
 *             )}?size=50`}
 *             alt={email}
 *         />
 *     );
 * };
 *
 * export default props => {
 *     const description = __('%email% updated post %slug% at %time%');
 *     const parts = Reactium.Utils.splitParts(description);
 *     Object.entries(props).forEach(([key, value]) => {
 *         parts.replace(key, value);
 *     });
 *
 *     return (
 *         <span className='by-line'>
 *             {parts.value().map(part => {
 *                 // arbitrary React component possible
 *                 const { key, value } = part;
 *
 *                 switch (key) {
 *                     case 'email': {
 *                         return <Gravatar key={key} email={value} />;
 *                     }
 *                     case 'time': {
 *                         return (
 *                             <span key={key} className='time'>
 *                                 {moment(value).fromNow()}
 *                             </span>
 *                         );
 *                     }
 *                     default: {
 *                         // plain string part
 *                         return <span key={key}>{value}</span>;
 *                     }
 *                 }
 *             })}
 *         </span>
 *     );
 * };
 */
export const splitParts = (original) => new SplitParts(original);
