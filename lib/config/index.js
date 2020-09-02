"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var path = require("path");
var envFound = dotenv.config({ path: path.join(__dirname, 'config.env') });
if (envFound.error) {
    throw new Error('Could not find .env file');
}
exports.default = {
    port: process.env.PORT,
};
//# sourceMappingURL=index.js.map