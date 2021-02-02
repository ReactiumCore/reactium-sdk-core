import React, { forwardRef } from 'react';
import Hook from '../hook';
import Enums from '../enums';
import op from 'object-path';
import _ from 'underscore';
import uuid from 'uuid/v4';

const defaults = {
    components: [],
    controls: {
        filter: _ => true,
        mapper: _ => _,
        sort: {
            sortBy: 'order',
            reverse: false,
        },
    },
};

// access controls
const INITIALIZED = Symbol('INITIALIZED');
const ZONES = Symbol('ZONES');
const ADD = Symbol('ADD');
const REMOVE = Symbol('REMOVE');
const FILTER = Symbol('FILTER');
const MAP = Symbol('MAP');
const SORT = Symbol('SORT');
const UPDATE = Symbol('UPDATE');
const UNSUBSCRIBE = Symbol('UNSUBSCRIBE');

class Zones {
    constructor() {
        this[INITIALIZED] = false;
        this[ZONES] = {
            zones: {},
        };

        op.set(this[ZONES], 'subscribers', {
            byId: {},
            zoneIds: {},
        });
        op.set(this[ZONES], 'components', {
            version: 1,
            allById: {},
            zoneComponentIds: {},
        });
        op.set(this[ZONES], 'controls.zoneControls', {});
    }

    async init() {
        if ((this[INITIALIZED] = false)) return;

        // Setup default controls
        const context = await Hook.run('zone-defaults');

        this.defaultControls = {};
        op.set(
            this.defaultControls,
            'filter',
            op.get(context, 'controls.filter', defaults.controls.filter),
        );
        op.set(
            this.defaultControls,
            'mapper',
            op.get(context, 'controls.mapper', defaults.controls.mapper),
        );
        op.set(
            this.defaultControls,
            'sort',
            op.get(context, 'controls.sort', defaults.controls.sort),
        );

        // Setup default components
        const components = op.get(context, 'components', defaults.components);
        if (!Array.isArray(components))
            throw new Error(
                `components must be array of objects, typeof ${typeof components} provided.`,
            );

        const ids = components.map(component => this.addComponent(component));
        this[INITIALIZED] = true;
        return ids;
    }

    addComponent(component) {
        let id = op.get(component, 'id');
        if (!id || op.has(this[ZONES], ['components', 'allById', id]))
            id = uuid();

        let zones = op.get(component, 'zone');
        if (!zones || (Array.isArray(zones) && zones.length < 1))
            throw new Error(`Plugin component ${id} missing target zone(s)`);

        if (!Array.isArray(zones)) zones = [zones];

        op.set(this[ZONES], ['components', 'allById', id], {
            ...component,
            zone: zones,
            id,
        });

        zones.forEach(zone => {
            op.set(
                this[ZONES],
                ['components', 'zoneComponentIds', zone, id],
                id,
            );
        });

        if (this[INITIALIZED]) {
            Hook.runSync('zone-add-component', component);
            zones.forEach(zone => this[UPDATE](zone));
        }

        return id;
    }

    updateComponent(id, updates = {}) {
        const componentUpdates = { ...updates };

        // don't allow id change
        op.del(componentUpdates, 'id');

        if (op.has(this[ZONES], ['components', 'allById', id])) {
            const component = op.get(this[ZONES], [
                'components',
                'allById',
                id,
            ]);
            let existingZones = op.get(component, 'zone', []);
            if (!Array.isArray(existingZones))
                existingZones = _.compact([existingZones]);

            const updatedComponent = { ...component, ...componentUpdates };

            let zones = op.get(updatedComponent, 'zone');
            if (!zones || (Array.isArray(zones) && zones.length < 1))
                throw new Error(
                    `Plugin component ${id} missing target zone(s)`,
                );

            if (!Array.isArray(zones)) zones = [zones];

            op.set(
                this[ZONES],
                ['components', 'allById', id],
                updatedComponent,
            );

            zones.forEach(zone => {
                op.set(
                    this[ZONES],
                    ['components', 'zoneComponentIds', zone, id],
                    id,
                );
            });

            existingZones
                .filter(zone => !zones.includes(zone))
                .forEach(zone => {
                    op.del(this[ZONES], [
                        'components',
                        'zoneComponentIds',
                        zone,
                        id,
                    ]);
                });

            if (this[INITIALIZED]) {
                Hook.runSync('zone-update-component', updatedComponent);
                _.chain(zones.concat(existingZones))
                    .compact()
                    .uniq()
                    .value()
                    .forEach(zone => this[UPDATE](zone));
            }
        }
    }

    removeComponent(id) {
        if (op.has(this[ZONES], ['components', 'allById', id])) {
            const component = op.get(this[ZONES], [
                'components',
                'allById',
                id,
            ]);
            let zones = op.get(component, 'zone');
            if (!Array.isArray(zones)) zones = _.compact([zones]);

            op.del(this[ZONES], ['components', 'allById', id]);
            zones.forEach(zone => {
                op.del(this[ZONES], [
                    'components',
                    'zoneComponentIds',
                    zone,
                    id,
                ]);
            });

            if (this[INITIALIZED]) {
                Hook.runSync('zone-remove-component', component);
                zones.forEach(zone => this[UPDATE](zone));
            }
        }
    }

    getZoneComponents(zone, raw = false) {
        if (!this[INITIALIZED])
            throw new Error('getZoneComponents called before Zone.init()');

        const ids = Object.values(
            op.get(this[ZONES], ['components', 'zoneComponentIds', zone], {}),
        );
        let zoneComponents = _.compact(
            ids.map(id => op.get(this[ZONES], ['components', 'allById', id])),
        );

        if (!raw) {
            zoneComponents = this[FILTER](zoneComponents, zone);
            zoneComponents = this[MAP](zoneComponents, zone);
            zoneComponents = this[SORT](zoneComponents, zone);
        }

        return zoneComponents;
    }

    getZoneComponent(zone, id) {
        const components = this.getZoneComponents(zone);
        return _.findWhere(components, {id});
    }

    hasZoneComponent(zone, id) {
        return !!this.getZoneComponent(zone, id);
    }

    addControl(type, zone, argument, order = Enums) {
        const control = {
            id: uuid(),
            [type]: argument,
            order,
        };

        op.set(this[ZONES], ['controls', 'byId', control.id], { type, zone });
        op.set(
            this[ZONES],
            ['controls', 'zoneControls', zone, type, control.id],
            control,
        );

        this[UPDATE](zone);
        return control.id;
    }

    addFilter(zone, argument, order) {
        return this.addControl('filter', zone, argument, order);
    }

    addMapper(zone, argument, order) {
        return this.addControl('mapper', zone, argument, order);
    }

    addSort(zone, sortBy = 'order', reverse = false, order) {
        return this.addControl(
            'sort',
            zone,
            {
                sortBy,
                reverse,
            },
            order,
        );
    }

    removeControl(id) {
        const { type, zone } = op.get(this[ZONES], ['controls', 'byId', id]);

        op.del(this[ZONES], ['controls', 'zoneControls', zone, type, id]);

        this[UPDATE](zone);
    }

    removeFilter(id) {
        return this.removeControl(id);
    }
    removeMapper(id) {
        return this.removeControl(id);
    }
    removeSort(id) {
        return this.removeControl(id);
    }

    subscribe(zone, cb) {
        const id = uuid();
        if (typeof cb === 'function') {
            op.set(this[ZONES], ['subscribers', 'byId', id], {
                zone,
                cb,
            });

            op.set(this[ZONES], ['subscribers', 'zoneIds', zone, id], id);
            return () => this[UNSUBSCRIBE](id);
        }
        throw new Error('Zone.subscribe must be passed a callback function.');
    }

    [UNSUBSCRIBE] = id => {
        if (op.has(this[ZONES], ['subscribers', 'byId', id])) {
            const zone = op.get(this[ZONES], ['subscribers', 'byId', id, 'zone']);
            op.del(this[ZONES], ['subscribers', 'byId', id]);
            op.del(this[ZONES], ['subscribers', 'zoneIds', zone, id]);
        }
    };

    [FILTER] = (zoneComponents, zone) => {
        const filters = _.sortBy(
            op.get(
                this[ZONES],
                ['controls', 'zoneControls', zone, 'filter'],
                [{ filter: op.get(this.defaultControls, 'filter') }],
            ),
            'order',
        );

        return filters.reduce(
            (components, { filter }) => components.filter(filter),
            [...zoneComponents],
        );
    };

    [MAP] = (zoneComponents, zone) => {
        const mappers = _.sortBy(
            op.get(
                this[ZONES],
                ['controls', 'zoneControls', zone, 'mapper'],
                [{ mapper: op.get(this.defaultControls, 'mapper') }],
            ),
            'order',
        );

        return mappers.reduce(
            (components, { mapper }) => components.map(mapper),
            [...zoneComponents],
        );
    };

    [SORT] = (zoneComponents, zone) => {
        const sorts = _.sortBy(
            op.get(
                this[ZONES],
                ['controls', 'zoneControls', zone, 'sort'],
                [{ sort: op.get(this.defaultControls, 'sort') }],
            ),
            'order',
        );

        return sorts.reduce(
            (components, { sort }) => {
                const newComponents = _.sortBy(components, sort.sortBy);
                if (sort.reverse) return newComponents.reverse();
                return newComponents;
            },
            [...zoneComponents],
        );
    };

    [UPDATE] = zone => {
        const zoneComponents = this.getZoneComponents(zone);
        Object.values(op.get(this[ZONES], ['subscribers', 'zoneIds', zone], {}))
            .map(id => op.get(this[ZONES], ['subscribers', 'byId', id]))
            .forEach(({ cb }) => cb(zoneComponents));
    };
}

export default new Zones();

/**
 * @api {Function} Zone.addMapper(zone,mapper,order) Zone.addMapper()
 * @apiName Zone.addMapper
 * @apiDescription Add a component zone mapping function, used to augment the
 zone component object before passed to `<Zone />`. Returns unique id.
 * @apiParam {String} zone the zone this mapper will apply to
 * @apiParam {String} mapper the mapper function that will be passed each component object
 * @apiParam {String} [order=Enums.priority.neutral] the priority your mapper
  will take in list of mappers in this zone
 * @apiGroup Reactium.Zone
 * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
import React from 'react';
import VIPBadge from './some/path/Vip';
// for this zone, if component is of type "vip", add a VIPBage component to the component
// components children property
const mapper = (component) => {
    if (component.type === 'vip')
    component.children = [
        <VIPBadge />
    ];
    return component;
};
const id = Reactium.Zone.addMapper('zone-1', mapper)
 */

/**
* @api {Function} Zone.removeMapper(id) Zone.removeMapper()
* @apiName Zone.removeMapper
* @apiDescription Remove mapping functions for a zone..
* @apiParam {String} id the id of the mapper to remove from the zone
* @apiGroup Reactium.Zone
* @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Zone.removeMapper(mapperId);
*/

/**
* @api {Function} Zone.addFilter(zone,filter,order) Zone.addFilter()
* @apiName Zone.addFilter
* @apiDescription Add a component zone filter function, used to filter which
components will appear in `<Zone />` Returns unique id.
* @apiParam {String} zone the zone this filter will apply to
* @apiParam {String} filter the filter function that will be passed each zone component object
* @apiParam {String} [order=Enums.priority.neutral] the priority your filter
will take in list of filters in this zone
* @apiGroup Reactium.Zone
* @apiExample reactium-hooks.js
import Reactium from 'reactium-core/sdk';

const registerPlugin = async () => {
    await Reactium.Plugin.register('MyVIPView');
    const permitted = await Reactium.User.can(['vip.view']);

    // Hide this component if current user shouldn't see vip components
    const filter = component => {
      return component.type !== 'vip' || !permitted
    };

    const id = Reactium.Zone.addFilter('zone-1', filter)
}
registerPlugin();
*/

/**
* @api {Function} Zone.removeFilter(id) Zone.removeFilter()
* @apiName Zone.removeFilter
* @apiDescription Remove filter functions for a component zone for this component.
* @apiParam {String} id the id of the filter to remove
* @apiGroup Reactium.Zone
* @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Zone.removeFilter(filterId);
*/

/**
 * @api {Function} Zone.addSort(zone,sortBy,reverse,order) Zone.addSort()
 * @apiName Zone.addSort
 * @apiDescription Add a component zone sort critera, used to augment the zone
 component object before passed to `<Zone />`
 * @apiParam {String} zone the zone this sort will apply to
 * @apiParam {String} [sortBy=order] zone component object property to sort
 the list of components by
 * @apiParam {Boolean} [reverse=false] reverse sort order
 * @apiParam {String} [order=Enums.priority.neutral] the priority your sort will
  take in list of sorts in this zone
 * @apiGroup Reactium.Zone
 * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';

// sort by zone component.type property
Reactium.Zone.addSort('zone-1', 'type')
 */

/**
  * @api {Function} Zone.removeSort(componentName,zone) Zone.removeSort()
  * @apiName Zone.removeSort
  * @apiDescription Remove sort critera for a component zone for this component.
  This should be called only:
 //   * @apiParam {String} zone the zone to remove this sort from
  * @apiGroup Reactium.Zone
  * @apiExample Example Usage
import Reactium from 'reactium-core/sdk';
Reactium.Zone.removeSort('myPlugin', 'zone-1');
  */

/**
 * @api {Function} Zone.addComponent(component,capabilities,strict) Zone.addComponent()
 * @apiName Zone.addComponent
 * @apiDescription Register a component to a component zone.
 * @apiParam {Object} zone component object, determines what component renders in a zone, what order
 * and additional properties to pass to the component.
 * @apiParam {Array} [capabilities] list of capabilities to check before adding
 component to zone. Can also be added as property of zone component object.
 * @apiParam {Boolean} [strict=true] true to only add component if all
 capabilities are allowed, otherwise only one capability is necessary
 * @apiGroup Reactium.Zone
 * @apiExample plugin-example.js
import SomeComponent from './path/to/SomeComponent';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('myPlugin').then(() => {
    // When the component is initialized, `<SomeComponent>` will render in
    // `"zone-1"`
    Reactium.Zone.addComponent({
        // Required - Component to render. May also be a string, if the component
        // has been registered with Reactium.Component.register().
        // @type {Component|String}
        component: SomeComponent,

        // Required - One or more zones this component should render.
        // @type {String|Array}
        zone: ['zone-1'],

        // By default components in zone are rendering in ascending order.
        // @type {Number}
        order: {{order}},

        // [Optional] - additional search subpaths to use to find the component,
        // if String provided for component property.
        // @type {[type]}
        //
        // e.g. If component is a string 'TextInput', uncommenting the line below would
        // look in components/common-ui/form/inputs and components/general to find
        // the component 'TextInput'
        // paths: ['common-ui/form/inputs', 'general']

        // [Optional] - Additional params:
        //
        // Any arbitrary free-form additional properties you provide below, will be provided as params
        // to the component when rendered.
        //
        // e.g. Below will be provided to the MyComponent, <MyComponent pageType={'home'} />
        // These can also be used to help sort or filter components, or however you have your
        // component use params.
        // @type {Mixed}
        // pageType: 'home',
    })
})
*/

/**
 * @api {Function} Zone.updateComponent(id,updatedComponent) Zone.updateComponent()
 * @apiName Zone.updateComponent
 * @apiDescription Register a component to a component zone.
 * @apiParam {String} ID the unique component object id.
 * @apiParam {Object} updatedComponent updated zone component object, will be merged with existing.
 * @apiGroup Reactium.Zone
 */

/**
 * @api {Function} Zone.removeComponent(ID) Zone.removeComponent()
 * @apiName Zone.removeComponent
 * @apiDescription Removes a component added by `Zone.addComponent()` from a component zone by id.
 * @apiParam {String} ID the unique component object id.
 * @apiGroup Reactium.Zone
 */

/**
 * @api {Function} Zone.getZoneComponents(zone,raw) Zone.getZoneComponents()
 * @apiName Zone.getZoneComponents
 * @apiDescription Get existing registrations for a zone, by default goes through mapping, sorting, filtering. Add raw=true to get unadulterated list, even if they may not be renderable in the Zone.
 * Returns the object used in Zone.addComponent()
 * @apiParam {String} zone the zone name to get components from
 * @apiParam {Boolean} [raw=false] Set to true to get all components, whether or not they are currently filtered, and without mapping or extra sorting.
 * @apiGroup Reactium.Zone
 */

/**
 * @api {Function} Zone.getZoneComponent(zone,id) Zone.getZoneComponent()
 * @apiName Zone.getZoneComponent
 * @apiDescription Get the component from a zone by its id.
 * @apiParam {String} zone the zone name to get components from
 * @apiParam {String} id the id of the registered component, specified in the object passed to Zone.addComponent() or returned by it.
 * @apiGroup Reactium.Zone
 */

/**
 * @api {Function} Zone.hasZoneComponent(zone,id) Zone.hasZoneComponent()
 * @apiName Zone.hasZoneComponent
 * @apiDescription Returns true if component with id is present in the zone.
 * @apiParam {String} zone the zone name to get components from
 * @apiParam {String} id the id of the registered component, specified in the object passed to Zone.addComponent() or returned by it.
 * @apiGroup Reactium.Zone
 */

/**
  * @api {Function} Zone.subscribe(zone,cb) Zone.subscribe()
  * @apiName Zone.subscribe
  * @apiDescription Subscribe to components added, removed, or updated in a particular rendering zone.
  Returns an unsubscribe function. Call this function to unsubscribe from changes.
  * @apiParam {String} zone the zone to subscribe to
  * @apiParam {Function} callback a function that will be called when a change occurs to zone.
  * @apiGroup Reactium.Zone
  * @apiExample useZoneComponents.js
  import Reactium from 'reactium-core/sdk';
  import { useState, useEffect } from 'react';

  export const useZoneComponents = zone => {
      const [components, updateComponents] = useState(Reactium.Zone.getZoneComponents(zone));

      useEffect(() => Reactium.Zone.subscribe(zone, zoneComponents => {
          updateComponents(zoneComponents)
      }), [zone]);

      return components;
  };
  */
