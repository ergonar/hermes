"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path = require("path");
var App_1 = require("./App");
dotenv.config({ path: path.join(__dirname, './../src/config/config.env') });
var port = process.env.PORT;
var server = App_1.default.listen(port, '0.0.0.0', function (error) {
    if (error) {
        return console.log(error);
    }
    return console.log("Running on port " + port);
});
//# sourceMappingURL=server.js.map