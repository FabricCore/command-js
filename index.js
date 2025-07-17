// as taken from https://github.com/FabricCore/bootstrap.js/blob/master/sys/command.js

const { addArgType } = require("./argTypes");

let fullTree = {};

let buildLiteral = module.require("./buildLiteral");
let cacheLiteral = module.require("./buildCache");

function testName(tree) {
    if (tree === undefined) return;

    if (!/^[a-z0-9]+$/i.test(tree.name)) {
        console.error(
            `command literal "${tree.name}" contains illegal characters`,
        );
        return false;
    }

    for (let [key, value] of Object.entries(tree.args ?? {})) {
        value.name = key;
        testName(value);
    }

    return true;
}

function register(argTree) {
    if (!testName(argTree)) {
        console.error(
            `Did not register command: ${argTree.name} is not a valid name`,
        );
        return false;
    }
    module.globals.command.cacheTree ??= {};
    cacheLiteral(argTree, [argTree.name]);
    fullTree[argTree.name] = argTree;
}

function registerInternal(dispatcher, _registry) {
    for (let [name, subtree] of Object.entries(fullTree)) {
        try {
            dispatcher.register(buildLiteral(subtree, [name]));
        } catch (e) {
            console.error(
                `Failed to register command ${subtree.name}.\nCause ${e}`,
            );
        }
    }
}

function deregisterAll() {
    fullTree = {};
}

module.exports = {
    register,
    registerInternal,
    deregisterAll,
    addArgType: module.require("./argTypes").addArgType,
};
