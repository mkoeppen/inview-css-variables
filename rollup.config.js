import babel from '@rollup/plugin-babel';

export default {
    input: 'src/iife-wrapper.js',
    output: [
        {
            file: 'build/inview-css-variables.min.js',
            format: 'iife'
        }
    ],
    plugins: [
      babel({ babelHelpers: 'bundled' })
    ]
};