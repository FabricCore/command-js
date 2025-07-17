```
let command = require("command");

command.register({
  name: "nameofcommand",

  execute: () => console.log("you ran /nameofcommand"),

  subcommands: {
     boop: {
       execute: () => console.log("you ran /nameofcommand boop"),
       args: { /* ... */ },
       subcommands: { /* ... */ }
     }
  }

  args: {
    one: {
      type: "int",
      min: 1,
      max: 10,

      args: {
        two: {
          type: "string",

          execute: (one, two) => {
            // note: the new argument syntax requires all argument types to be provided
            // as a string
            console.log(`you ran /nameofcommand ${one} ${two}`);
          }
        }
      }
    }
  }
})
```

You can define a new argument type with

```
let command = require("command");

command.addArgType(
    "double", // name of argument type
    ({ min, max }) => // params it takes
        DoubleArgumentType.doubleArg(
            min ?? -java.lang.Double.MAX,
            max ?? java.lang.Double.MAX,
        ),
    (ctx, name) => DoubleArgumentType.getDouble(ctx, name), // how to get the value from ctx and name
);
```

> ## Legacy Spec
>
> The old spec is still supported, but not recommended because its less convenient to use.
>
> ```js
> let command = require("command");
>
> command.register(commandDefinition);
>
> command.register({
>   name: "nameofcommand",
>   execute: () => {
>     // do something
>     return 0;
>   },
>
>   subcommands: {
>     nameofsubcommand: commandDefinition,
>   },
>
>   args: {
>     nameofargument: {
>       type: argumentType, // com.mojang.brigadier.arguments stuff
>       execute: () => {
>         /* ... */
>       },
>       suggests: () => [
>         /* list of items to suggest */
>       ],
>
>       args: {
>         /* ... */
>       },
>       subcommands: {
>         /* ... */
>       },
>     },
>   },
> });
> ```
>
> Note all `execute` are optional.
