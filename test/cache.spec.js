import SDK from '..';

const { Cache } = SDK;

test('Cache.set()', () => {
    Cache.set('foo.baz', 'bar');
    Cache.set('foo.bar', 'baz', 500);
    expect(Cache.get('foo')).toMatchObject({
        baz: 'bar',
        bar: 'baz'
    });

    // Should have expired by now
    setTimeout(() => {
        expect(Cache.get('foo.bar')).toBeUndefined();
        expect(Cache.get('foo.baz')).toEqual('bar');
    }, 600)
})
