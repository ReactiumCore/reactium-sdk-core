import { SDK } from './components';
import uuid from 'uuid/v4';

describe('Registry in default mode', () => {
    it('should register item', () => {
        const registry = new SDK.Utils.Registry('TestRegistry');
        const id = uuid();
        registry.register(id, {
            name: 'test item',
        });

        expect(registry.list).toEqual(
            expect.arrayContaining([{ id, name: 'test item', order: 100 }]),
        );
    });

    it('should unregister item', () => {
        const registry = new SDK.Utils.Registry('TestRegistry');
        const id = uuid();
        registry.register(id, {
            name: 'test item',
        });

        registry.unregister(id);

        expect(registry.list).toEqual(expect.arrayContaining([]));
    });

    it('should retain unregistered item', () => {
        const registry = new SDK.Utils.Registry('TestRegistry', 'id', SDK.Utils.Registry.MODES.HISTORY);
        const id = uuid();
        registry.register(id, {
            name: 'test item',
        });

        registry.unregister(id);

        expect(registry.registered).toEqual(
            expect.arrayContaining([{ id, name: 'test item', order: 100 }]),
        );
        expect(registry.unregistered).toEqual(
            expect.arrayContaining([id]),
        );
    });
});

describe('Registry in clean mode', () => {
    it('should register item', () => {
        const registry = new SDK.Utils.Registry('TestRegistry', 'test', SDK.Utils.Registry.MODES.CLEAN);
        const id = uuid();
        registry.register(id, {
            name: 'test item',
        });

        expect(registry.list).toEqual(
            expect.arrayContaining([{ test: id, name: 'test item', order: 100 }]),
        );
    });

    it('should unregister item', () => {
        const registry = new SDK.Utils.Registry('TestRegistry', 'test', SDK.Utils.Registry.MODES.CLEAN);
        const id = uuid();
        registry.register(id, {
            name: 'test item',
        });

        registry.unregister(id);

        expect(registry.list).toEqual(expect.arrayContaining([]));
    });

    it('should not retain unregistered item', () => {
        const registry = new SDK.Utils.Registry('TestRegistry', 'name', SDK.Utils.Registry.MODES.CLEAN);
        const id = uuid();
        registry.register(id, {
            style: 'test item',
        });

        registry.unregister(id);

        expect(registry.list).toEqual([]);

        expect(registry.registered).toEqual([]);

        expect(registry.unregistered).toEqual([]);
    });
});
