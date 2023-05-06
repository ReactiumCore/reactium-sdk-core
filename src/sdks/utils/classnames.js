import cn from 'classnames';
import _ from 'underscore';

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
export const cxFactory =
    (namespace) =>
    (...params) =>
        cn(...params)
            .split(' ')
            .map((cls) => _.compact([namespace, cls]).join('-'))
            .join(' ');
