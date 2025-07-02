// as taken from https://github.com/FabricCore/bootstrap.js/blob/master/sys/command.js

let fullTree = {};

let buildLiteral = module.require("./buildLiteral");

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
    fullTree[argTree.name] = argTree;
}

function registerInternal(dispatcher, _registry) {
    for (let subtree of Object.values(fullTree)) {
        try {
            dispatcher.register(buildLiteral(subtree));
        } catch (e) {
            console.error(
                `Failed to register command ${subtree.name}.\nCause ${e}`,
            );
        }
    }

    fullTree = {};
}

module.exports = {
    register,
    registerInternal,
};
