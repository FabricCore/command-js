let ClientCommandManager =
    Packages.net.fabricmc.fabric.api.client.command.v2.ClientCommandManager;
let SuggestionProvider = com.mojang.brigadier.suggestion.SuggestionProvider;

let { ctxToArg, treeToType } = module.require("./argTypes");

function buildArgument(tree, identifier, argStack) {
    if (tree.type == undefined) {
        tree.type = "greedy";
        console.error(
            `Command ${identifier.join("::")} does not have an argument type.`,
        );
        let command = ClientCommandManager.literal("missingArgumentType");
        return command;
    }
    let command = ClientCommandManager.argument(tree.name, treeToType(tree));

    if (tree.suggests) {
        if (
            typeof tree.suggests == "function" ||
            Array.isArray(tree.suggests)
        ) {
            let suggests = new SuggestionProvider({
                getSuggestions: function (context, builder) {
                    try {
                        let suggestions = tree.suggests;
                        if (typeof tree.suggests == "function") {
                            suggestions = tree.suggests(context);
                        }

                        for (let item of suggestions) {
                            builder.suggest(item);
                        }
                    } catch (e) {
                        console.error(
                            "An error has occured when generating suggestions, please contact package maintainer.",
                        );
                        console.error(`Cause: ${e}`);
                    }
                    return builder.buildFuture();
                },
            });

            command = command.suggests(suggests);
        } else {
            command = command.suggests(tree.suggests);
        }
    }

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
            buildArgument(
                value,
                identifier.concat([`<${name}>`]),
                argStack.concat([[name, value.type]]),
            ),
        );
    }

    for (let [name, value] of Object.entries(tree.subcommands)) {
        value.name = name;
        command = command.then(
            module.globals.command.buildLiteral(
                value,
                identifier.concat(name),
                argStack,
            ),
        );
    }

    return command;
}

module.globals.command ??= {};
module.globals.command.buildArgument = buildArgument;
