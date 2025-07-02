let ClientCommandManager =
    Packages.net.fabricmc.fabric.api.client.command.v2.ClientCommandManager;

let buildLiteral = module.require("./buildLiteral");

function buildArgument(tree) {
    let command = ClientCommandManager.argument(tree.name, tree.type);

    switch (typeof tree.execute) {
        case "string":
            // TODO load the damn file
            break;
        case "function":
            command = command.executes(tree.execute);
            break;
        default:
            throw new Error(
                `Command.execute should be string or function, got ${tree.execute}`,
            );
    }

    tree.args ??= {};
    tree.subcommands ??= {};

    for (let [name, value] of Object.entries(tree.args)) {
        value.name = name;
        command = command.then(buildArgument(value));
    }

    for (let [name, value] of Object.entries(tree.subcommands)) {
        value.name = name;
        command = command.then(buildLiteral(value));
    }

    return command;
}

module.exports = buildArgument;
