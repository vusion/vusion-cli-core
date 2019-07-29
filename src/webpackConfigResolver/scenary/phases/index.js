module.exports = {
    ...require('./module'),
    ...require('./plugins'),
    ...require('./optimization'),
    devtool: require('./devtool'),
    entry: require('./entry'),
    output: require('./output'),

    resolve: require('./resolve'),
    stats: require('./stats'),
};
