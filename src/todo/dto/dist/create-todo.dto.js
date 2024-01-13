"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CreateTodoDto = void 0;
var swagger_1 = require("@nestjs/swagger");
var class_validator_1 = require("class-validator");
var CreateTodoDto = /** @class */ (function () {
    function CreateTodoDto() {
    }
    __decorate([
        class_validator_1.IsString(),
        swagger_1.ApiProperty()
    ], CreateTodoDto.prototype, "title");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString(),
        swagger_1.ApiProperty()
    ], CreateTodoDto.prototype, "detail");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsNumber(),
        swagger_1.ApiProperty(),
        class_validator_1.Min(1)
    ], CreateTodoDto.prototype, "repeat");
    __decorate([
        class_validator_1.IsOptional(),
        class_validator_1.IsString(),
        swagger_1.ApiProperty()
    ], CreateTodoDto.prototype, "connect_to");
    return CreateTodoDto;
}());
exports.CreateTodoDto = CreateTodoDto;
