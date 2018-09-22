let env = process.env.NODE_ENV || "development";

if(env === "test" || env === "development") {
    const config = require("./config.json")[env];
    for(key in config) {
        if(typeof config[key] === "object") {
            process.env[key] = JSON.stringify(config[key]);
        } else {
            process.env[key] = config[key];
        }
    };
}

process.env.NODE_ENV = env;