let ClientCommandManager =
    Packages.net.fabricmc.fabric.api.client.command.v2.ClientCommandManager;
let SuggestionProvider = com.mojang.brigadier.suggestion.SuggestionProvider;

let buildLiteral = module.require("./buildLiteral", "lazy");

function buildArgument(tree) {
    let command = ClientCommandManager.argument(tree.name, tree.type);

    if (tree.suggests) {
        switch (typeof tree.suggests) {
            case "function":
                let suggests = new SuggestionProvider({
                    getSuggestions: function (context, builder) {
                        for (let item of tree.suggests(context)) {
                            builder.suggest(item);
                        }
                        return builder.buildFuture();
                    },
                });

                command = command.suggests(suggests);
                break;
            default:
                command = command.suggests(tree.suggests);
        }
    }

    switch (typeof tree.execute) {
        case "undefined":
            break;
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
