let {
    BoolArgumentType,
    DoubleArgumentType,
    FloatArgumentType,
    IntegerArgumentType,
    LongArgumentType,
    StringArgumentType,
} = com.mojang.brigadier.arguments;

let stringTypes = {};

function addArgType(name, treeToType, ctxToArg) {
    stringTypes[name] = {
        treeToType,
        ctxToArg,
    };
}

addArgType(
    "bool",
    () => BoolArgumentType.bool(),
    (ctx, name) => BoolArgumentType.getBool(ctx, name) && true,
);

addArgType(
    "double",
    ({ min, max }) =>
        DoubleArgumentType.doubleArg(
            min ?? -java.lang.Double.MIN_VALUE,
            max ?? java.lang.Double.MAX_VALUE,
        ),
    (ctx, name) => DoubleArgumentType.getDouble(ctx, name) + 0,
);

addArgType(
    "float",
    ({ min, max }) =>
        FloatArgumentType.floatArg(
            min ?? -java.lang.Float.MIN_VALUE,
            max ?? java.lang.Float.MAX_VALUE,
        ),
    (ctx, name) => FloatArgumentType.getFloat(ctx, name) + 0,
);

addArgType(
    "int",
    ({ min, max }) =>
        IntegerArgumentType.integer(
            min ?? java.lang.Integer.MIN_VALUE,
            max ?? java.lang.Integer.MAX_VALUE,
        ),
    (ctx, name) => IntegerArgumentType.getInteger(ctx, name) + 0,
);

addArgType(
    "long",
    ({ min, max }) =>
        LongArgumentType.integer(
            min ?? java.lang.Long.MIN_VALUE,
            max ?? java.lang.Long.MAX_VALUE,
        ),
    (ctx, name) => LongArgumentType.getLong(ctx, name) + 0,
);

addArgType(
    "word",
    () => StringArgumentType.word(),
    (ctx, name) => StringArgumentType.getString(ctx, name) + "",
);

addArgType(
    "string",
    () => StringArgumentType.string(),
    (ctx, name) => StringArgumentType.getString(ctx, name) + "",
);

addArgType(
    "greedy",
    () => StringArgumentType.greedyString(),
    (ctx, name) => StringArgumentType.getString(ctx, name) + "",
);

function treeToType(tree) {
    if (typeof tree.type != "string") return tree.type;

    if (stringTypes[tree.type]) {
        return stringTypes[tree.type].treeToType(tree);
    }

    throw new Error(`No such argument type ${tree.type}`);
}

function ctxToArg(ctx, typeName, name) {
    if (stringTypes[typeName]) {
        return stringTypes[typeName].ctxToArg(ctx, name);
    }

    throw new Error(`No such argument type ${tree.type}`);
}

module.exports = {
    addArgType,
    treeToType,
    ctxToArg,
};
