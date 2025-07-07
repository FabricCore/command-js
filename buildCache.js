// build the tree at module.globals.command.cacheTree
//
function cacheArgument(tree, identifier) {
    switch (typeof tree.execute) {
        case "undefined":
            break;
        case "function":
            module.globals.command.cacheTree[identifier.join(" ")] =
                tree.execute;
            break;
        case "string":
        default:
            throw new Error(
                `Command.execute should be string or function, got ${tree.execute}`,
            );
    }

    for (let [name, value] of Object.entries(tree.args ?? {})) {
        value.name = name;
        cacheArgument(value, identifier.concat([`<${name}>`]));
    }

    for (let [name, value] of Object.entries(tree.subcommands ?? {})) {
        value.name = name;
        cacheLiteral(value, identifier.concat([name]));
    }
}

function cacheLiteral(tree, identifier) {
    switch (typeof tree.execute) {
        case "undefined":
            break;
        case "function":
            module.globals.command.cacheTree[identifier.join(" ")] =
                tree.execute;
            break;
        case "string":
        default:
            throw new Error(
                `Command.execute should be string or function, got ${tree.execute}`,
            );
    }

    for (let [name, value] of Object.entries(tree.args ?? {})) {
        value.name = name;
        cacheArgument(value, identifier.concat([`<${name}>`]));
    }

    for (let [name, value] of Object.entries(tree.subcommands ?? {})) {
        value.name = name;
        cacheLiteral(value, identifier.concat([name]));
    }
}

module.exports = cacheLiteral;
