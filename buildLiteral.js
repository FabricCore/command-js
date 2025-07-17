let ClientCommandManager =
    Packages.net.fabricmc.fabric.api.client.command.v2.ClientCommandManager;

function buildLiteral(tree, identifier, argStack = []) {
    let command = ClientCommandManager.literal(tree.name);

    switch (typeof tree.execute) {
        case "undefined":
            break;
        case "function":
            let currentIdentifier = identifier.join(" ");
            let isNewSpec = argStack.every(
                ([_, type]) => typeof type == "string",
            );

            command = command.executes(function (...args) {
                return (
                    module.globals.command.cacheTree[currentIdentifier].apply(
                        null,
                        isNewSpec
                            ? argStack.map(([name, type]) =>
                                  ctxToArg(args[0], type, name),
                              )
                            : args,
                    ) ?? 1
                );
            });
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
            module.globals.command.buildArgument(
                value,
                identifier.concat([`<${name}>`]),
                argStack.concat([[name, value.type]]),
            ),
        );
    }

    for (let [name, value] of Object.entries(tree.subcommands)) {
        value.name = name;
        command = command.then(
            buildLiteral(value, identifier.concat(name), argStack),
        );
    }

    return command;
}

module.globals.command.buildLiteral = buildLiteral;
