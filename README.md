```js
let command = require("command");

command.register(commandDefinition);

command.register({
  name: "nameofcommand",
  execute: () => {
    // do something
    return 0;
  },

  subcommands: {
    nameofsubcommand: commandDefinition,
  },

  args: {
    nameofargument: {
      type: argumentType, // com.mojang.brigadier.arguments stuff
      execute: () => {
        /* ... */
      },
      suggests: () => [
        /* list of items to suggest */
      ],

      args: {
        /* ... */
      },
      subcommands: {
        /* ... */
      },
    },
  },
});
```

Note all `execute` are optional.
