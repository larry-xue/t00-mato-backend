"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.UpdateTodoDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var create_todo_dto_1 = require("./create-todo.dto");
var UpdateTodoDto = /** @class */ (function (_super) {
    __extends(UpdateTodoDto, _super);
    function UpdateTodoDto() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return UpdateTodoDto;
}(swagger_1.PartialType(create_todo_dto_1.CreateTodoDto)));
exports.UpdateTodoDto = UpdateTodoDto;
