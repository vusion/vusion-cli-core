module.exports = function (env) {
    if (['build', 'dev'].indexOf(env) === -1) {
        throw new Error('Env should within [ build, dev ]');
    }
    return require(`./${env}`);
};
