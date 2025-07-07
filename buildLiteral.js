let ClientCommandManager =
    Packages.net.fabricmc.fabric.api.client.command.v2.ClientCommandManager;

let buildArgument = module.require("./buildArgument");

function buildLiteral(tree, identifier) {
    let command = ClientCommandManager.literal(tree.name);

    switch (typeof tree.execute) {
        case "undefined":
            break;
        case "function":
            let currentIdentifier = identifier.join(" ");
            command = command.executes(
                (ctx) =>
                    module.globals.command.cacheTree[currentIdentifier](ctx) ??
                    1,
            );
            break;
        case "string":
        default:
            throw new Error(
                `Command.execute should be string or function, got ${tree.execute}`,
            );
    }

    tree.args ??= {};
    tree.subcommands ??= {};

    for (let [name, value] of Object.entries(tree.args)) {
        value.name = name;
        command = command.then(
            buildArgument(value, identifier.concat([`<${name}>`])),
        );
    }

    for (let [name, value] of Object.entries(tree.subcommands)) {
        value.name = name;
        command = command.then(buildLiteral(value, identifier.concat(name)));
    }

    return command;
}

module.exports = buildLiteral;
