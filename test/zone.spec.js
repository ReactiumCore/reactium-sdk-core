import { SDK, A, B, C, ZoneRegistered, Nope, Another, MyZone } from './components';
import op from 'object-path';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';

const setupComponents = [
    {
        id: 'A Component',
        name: 'A Component',
        component: A,
        zone: ['zone-a', 'zone-everything'],
    },
    {
        id: 'B Component',
        name: 'B Component',
        component: B,
        zone: ['zone-b', 'zone-everything'],
    },
    {
        id: 'C Component',
        name: 'C Component',
        component: C,
        zone: ['zone-c', 'zone-everything'],
    },
    {
        id: 'Nope',
        name: 'Nope',
        component: Nope,
        zone: ['zone-a', 'zone-b', 'zone-c', 'zone-everything'],
    },
    {
    id: 'ZoneRegistered',
        name: 'ZoneRegistered',
        component: 'ZoneRegistered',
        zone: 'zone-everything',
    },
];

const anotherComponent = {
    id: 'Another',
    name: 'Another',
    component: Another,
    zone: 'zone-another',
};

const setup = async () => {
    await SDK.Component.register('ZoneRegistered', ZoneRegistered);
    await SDK.Hook.register('zone-defaults', async context => {
        op.set(context, 'controls', {
            filter: component => component.name !== 'Nope',
            mapper: _ => _,
            sort: {
                sortBy: 'name',
                reverse: true,
            },
        });
        op.set(context, 'components', setupComponents);
    });
};

describe('Zone', () => {
    describe('getZoneComponents() before init()', () => {
        it('should throw', () => {
            expect(() => SDK.Zone.getZoneComponents('some-zone')).toThrow();
        });
    });
});

describe('Zone', () => {
    describe('After init()', () => {
        it('should have ZoneRegistered, C, B, A in zone-everything', async () => {
            await setup();
            await SDK.Zone.init();
            const zoneComponents = SDK.Zone.getZoneComponents(
                'zone-everything',
            );
            expect(zoneComponents.length).toEqual(4);
            expect(zoneComponents[0].name).toEqual('ZoneRegistered');
            expect(zoneComponents[0]).toMatchObject({
                ...setupComponents[4],
                component: ZoneRegistered,
                zone: ['zone-everything'],
            });
            expect(zoneComponents[1].name).toEqual('C Component');
            expect(zoneComponents[1]).toMatchObject(setupComponents[2]);
            expect(zoneComponents[2].name).toEqual('B Component');
            expect(zoneComponents[2]).toMatchObject(setupComponents[1]);
            expect(zoneComponents[3].name).toEqual('A Component');
            expect(zoneComponents[3]).toMatchObject(setupComponents[0]);
        });
        it('should have one component (A) in zone-a', async () => {
            const zoneComponents = SDK.Zone.getZoneComponents(
                'zone-a',
            );
            expect(zoneComponents.length).toEqual(1);
        })
    });

    describe('After addFilter() _=>_', () => {
        it('should also include Nope component in zone-everything that was filtered before.', async () => {
            await SDK.Zone.addFilter('zone-everything', _ => _);
            const zoneComponents = SDK.Zone.getZoneComponents(
                'zone-everything',
            );

            expect(zoneComponents.length).toEqual(5);
        })
        it('should still not include Nope in zone-a that was filtered by default before.', async () => {
            const zoneComponents = SDK.Zone.getZoneComponents(
                'zone-a',
            );
            expect(zoneComponents.length).toEqual(1);
        })
    });

    describe('After addSort()', () => {
        it('ZoneRegistered should be last.', async () => {
            await SDK.Zone.addSort('zone-everything', 'name', false);
            const zoneComponents = SDK.Zone.getZoneComponents(
                'zone-everything',
            );

            expect(zoneComponents[0].name).toEqual('A Component');
            expect(zoneComponents[0]).toMatchObject(setupComponents[0]);
            expect(zoneComponents[4].name).toEqual('ZoneRegistered');
            expect(zoneComponents[4]).toMatchObject({
                ...setupComponents[4],
                component: ZoneRegistered,
                zone: ['zone-everything'],
            });
        })
    });

    describe('After subscribing to zone-another and adding a component to zone.', () => {
        it('Should get updated zone information', async () => {
            const subscription = new Promise((resolve) => {
                const unsub = SDK.Zone.subscribe('zone-another', results => {
                    resolve({ unsub, results });
                })
            });

            SDK.Zone.addComponent(anotherComponent);
            const {unsub, results} = await subscription;

            expect(typeof unsub).toEqual('function');
            expect(results).toMatchObject([{
                ...anotherComponent,
                zone: ['zone-another'],
            }]);
            unsub();
        })
    });

    describe('<Zone zone="zone-everything" />', () => {
        it('Should render zone-everything zone', async () => {
            let zoneDiv = document.createElement('div');
            anotherComponent.id = 'zone-everything version of anotherComponent';
            anotherComponent.zone = 'zone-everything';
            SDK.Zone.addComponent(anotherComponent);

            await ReactTestUtils.act(async () => {
                // the subscribing component
                ReactDOM.render(
                    <MyZone />,
                    zoneDiv,
                );
            });

            expect(zoneDiv.innerHTML).toEqual('AAnotherBCNopeZoneRegistered');
            ReactDOM.unmountComponentAtNode(zoneDiv);
        })
    })
});
