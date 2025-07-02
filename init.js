let ClientCommandRegistrationCallback =
    Packages.net.fabricmc.fabric.api.client.command.v2
        .ClientCommandRegistrationCallback;

let { registerInternal } = module.require("./");

let callback = new ClientCommandRegistrationCallback({
    register: function (dispatcher, registry) {
        registerInternal(dispatcher, registry);
    },
});

ClientCommandRegistrationCallback.EVENT.register(callback);
