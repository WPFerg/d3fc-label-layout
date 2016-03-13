import babel from 'rollup-plugin-babel';

export default {
    entry: 'index.js',
    moduleName: 'fc_label_layout',
    format: 'umd',
    plugins: [ babel() ],
    dest: 'build/d3fc-label-layout.js',
    globals: {
        'd3': 'd3'
    }
};
