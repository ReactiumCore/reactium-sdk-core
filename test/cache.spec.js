import SDK from '../lib';

const { Cache } = SDK;

test('Cache.set()', done => {
    const subscriber = jest.fn();
    const cbs = [
        Cache.subscribe('foo', subscriber),
        Cache.subscribe('foo', subscriber),
    ];

    Cache.set('foo.baz', 'bar');
    Cache.set('foo.bar', 'baz', 100);
    expect(Cache.get('foo')).toMatchObject({
        baz: 'bar',
        bar: 'baz'
    });

    // Should have expired by now
    setTimeout(() => {
        // expire for one root is an expire for others
        expect(Cache.get('foo')).toBeUndefined();
        expect(subscriber).toHaveBeenCalledTimes(6);
        cbs[0]();
        expect(Object.keys(Cache._subscribers).length).toEqual(1);
        cbs[1]();
        expect(Object.keys(Cache._subscribers).length).toEqual(0);
        done();
    }, 200)
})
