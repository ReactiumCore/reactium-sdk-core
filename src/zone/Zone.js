/**
 * -----------------------------------------------------------------------------
 * Imports
 * -----------------------------------------------------------------------------
 */
import React, { useRef, useState, useEffect } from 'react';
import ZoneSDK from './index';
import { useHookComponent } from '../named-exports/component';
import Component from '../component';
import op from 'object-path';

export const useZoneComponents = zone => {
    const components = useRef(ZoneSDK.getZoneComponents(zone));
    const [version, setVersion] = useState(Date.now());
    useEffect(
        () =>
            ZoneSDK.subscribe(zone, zoneComponents => {
                components.current = zoneComponents;
                setVersion(Date.now());
            }),
        [zone],
    );

    return components.current;
};

const HookComponent = ({ hookName = '', ...props }) => {
    const DynamicComponent = useHookComponent(hookName);
    return <DynamicComponent { ...props } />;
};

export const SimpleZone = props => {
    const { zone } = props;
    const components = useZoneComponents(zone);

    return components.map(zoneComponent => {
        const { id } = zoneComponent;
        const { children, ...zoneProps } = props;

        const { component: Component, ...componentProps } = zoneComponent;
        const allProps = {
            ...zoneProps,
            ...componentProps,
            zone,
        };

        if (typeof Component === 'string') {
            return (
                <HookComponent key={id} hookName={Component} {...allProps} />
            );
        }

        return Component && <Component key={id} {...allProps} />;
    });
};

const PassThroughZone = props => {
    const { zone, children, ...bindings } = props;
    const components = useZoneComponents(zone);

    return React.Children.map(children, Child => {
        return React.cloneElement(Child, {
            zone,
            components: components.reduce(
                (passThroughComponents, component) => {
                    let name = op.get(
                        component,
                        'name',
                        op.get(component, 'component.name'),
                    );
                    if (name && component.component) {
                        passThroughComponents[name] = component.component;
                        if (typeof component.component === 'string') {
                            passThroughComponents[name] = resolveHookComponent(
                                component.component,
                            );
                        }
                    }
                    return passThroughComponents;
                },
                {},
            ),
            bindings,
        });
    });
};

/**
 * -----------------------------------------------------------------------------
 * React Component: Zone
 * -----------------------------------------------------------------------------
 */
const Zone = props => {
    const { children, passThrough = false } = props;

    return (
        <>
            {!passThrough && <SimpleZone {...props} />}
            {passThrough ? <PassThroughZone {...props} /> : children}
        </>
    );
};

Component.register('Zone', Zone);

export default Zone;

/**
 * @api {RegisteredComponent} Zone Zone
 * @apiVersion 3.1.19
 * @apiName Zone
 * @apiDescription Component used to identify a "zone" in your application where
 any arbitrary components will render. Plugin components registered for this zone will
 dynamically render in the zone. Plugins can be registered statically in Reactium by
 creating a `plugin.js` file that exports a component definition
 (`arcli plugin component` to generate boilerplate for one), or using the Reactium SDK
 `Reactium.Zone.addComponent()` call.

 See also the Zone SDK for filtering, sorting, or mapping over plugin components for a zone.

 To generate an exportable plugin module, use the `arcli plugin module` command.
 * @apiParam {String} zone Identifier of the zone where plugin components will be rendered.
 * @apiParam {Boolean} [passThrough=false] When true, will provide a `components`
property to children of Zone instead of rendering plugin components directly as
siblings. This is useful when you wish to make plugin components available, but
take more control over how they render.

Example Passthrough Usage: Using the `jsx-parser` module,
components could be provided to a JSXParser component, and the actual render
of those components could be dictated by a string of JSX and data context provided
by a CMS.
 * @apiParam {Mixed} ...params any number of arbitrary parameters (variadic) can be provided to the Zone, and will be passed
 automatically as props on your plugin components when they are rendered.
 * @apiGroup Registered Component
 * @apiExample PageHeader.js
import React from 'react';
import { useHookComponent } from 'reactium-core/sdk';

// PageHeader is not hard-coded, but adaptable by plugins
export default props => {
    const Zone = useHookComponent('Zone');
    return (
        <div class='page-header'>
            <Zone zone={'page-header'} />
        </div>
    );
};
* @apiExample src/app/components/plugin-src/MyHeaderPlugin/index.js
import Reactium from 'reactium-core/sdk';
import MyHeaderWidget from './MyHeaderWidget';

const registerPlugin = async () => {
    await Reactium.Plugin.register('MyHeaderPlugin');
    Reactium.Zone.addComponent({
        id: 'MyHeaderWidget',
        zone: 'page-header',
        component: MyHeaderWidget,
    });
};
registerPlugin();

* @apiExample src/app/components/plugin-src/MyHeaderPlugin/MyHeaderWidget.js
import React from 'react';

export default props => {
   return (
       <div class='my-header-widget'>
           I will end up in the header zone
       </div>
   );
};
 */

/**
  * @api {ReactHook} useZoneComponents(zone) useZoneComponents()
  * @apiDescription A React hook used in the `Zone` component to determine what
  components should currently be rendered. Useful to observe a zone in another component.
  If you want to observe to the zone components without necessarily causing a rerender in your component,
  use `Reactium.Zone.getZoneComponents()` (to get a list of components in the zone), alone or
  in combination with `Reactium.Zone.subscribe()`.
  * @apiParam {String} zone the zone id.
  * @apiName useZoneComponents
  * @apiGroup ReactHook
  * @apiExample Example
 import React from 'react';
 import { useZoneComponents } from 'reactium-core/sdk';

 export props => {
     const zoneComponents = useZoneComponents('my-zone');

     return (
         <div>
             Components in Zone: {zoneComponents.length}
         </div>
     );
 };
  */
