"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var App = /** @class */ (function () {
    function App() {
        this.express = express();
        this.mountRoutes();
    }
    App.prototype.mountRoutes = function () {
        var router = express.Router();
        router.get('/', function (req, res) {
            res.json({
                message: 'Hello Typescript',
            });
        });
        this.express.use('/', router);
    };
    return App;
}());
exports.default = new App().express;
//# sourceMappingURL=Appss.js.map