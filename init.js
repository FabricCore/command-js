let ClientCommandRegistrationCallback =
    Packages.net.fabricmc.fabric.api.client.command.v2
        .ClientCommandRegistrationCallback;

module.globals.command ??= {};
module.globals.command.registerInternal = module.require("./").registerInternal;

if (!(module.globals.command ?? {}).registered) {
    let callback = new ClientCommandRegistrationCallback({
        register: function (dispatcher, registry) {
            module.globals.command.registerInternal(dispatcher, registry);
        },
    });

    ClientCommandRegistrationCallback.EVENT.register(callback);
}

module.globals.command.registered = true;
