module.exports = function (css, map, meta) {
    // console.log(css, map, meta);
    // console.log(meta.ast.root.variables);
    return `module.exports=${JSON.stringify(meta.ast.root.variables)}`;
};
