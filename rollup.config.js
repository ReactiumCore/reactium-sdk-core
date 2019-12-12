// import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import pkg from './package.json';

export default [
    {
        input: 'src/index.js',
        external: ['react', 'react-dom'],
        output: [
            { file: pkg.main, format: 'cjs', exports: 'named' },
        ],
        plugins: [
            babel({
                exclude: ['node_modules/**'],
            }),
            json(),
            commonjs(),
        ],
    },
    {
        input: 'test/components/index.js',
        external: ['react', 'react-dom'],
        output: [
            { file: pkg.testComponents, format: 'cjs', exports: 'named' },
        ],
        plugins: [
            babel({
                exclude: ['node_modules/**'],
            }),
            json(),
            commonjs(),
        ],
    },
];
