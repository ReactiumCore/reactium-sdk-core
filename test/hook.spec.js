import SDK from '../lib';

const { Hook } = SDK;

describe('When a hook is registered', () => {
    it('will execute when run synchronously', async () => {
        const cb = jest.fn();
        Hook.registerSync('test-hook', cb, 0, 'test-id');
        Hook.runSync('test-hook');
        expect(cb).toHaveBeenCalled();
    });

    it('will execute when run asynchronously', async () => {
        const cb = jest.fn();
        Hook.register('test-hook', cb, 0, 'test-id');
        await Hook.run('test-hook');
        expect(cb).toHaveBeenCalled();
    });

    it('will NOT execute when run asynchronously if it has been unregisted', async () => {
        const cb = jest.fn();
        Hook.register('test-hook', cb, 0, 'test-id');
        Hook.unregister('test-id');
        await Hook.run('test-hook');
        expect(cb).not.toHaveBeenCalled();
    });

    it('will NOT execute when run asynchronously if it has been unregisted by domain', async () => {
        const cb = jest.fn();
        Hook.register('test-hook', cb, 0, 'test-id', 'testing');
        Hook.unregisterDomain('test-hook', 'testing');
        await Hook.run('test-hook');
        expect(cb).not.toHaveBeenCalled();
    });

    afterEach(() => {
        Hook.unregister('test-id');
    });
});
