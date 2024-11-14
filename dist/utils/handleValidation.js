"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidation = void 0;
const class_validator_1 = require("class-validator");
const handleValidation = (obj_1, ...args_1) => __awaiter(void 0, [obj_1, ...args_1], void 0, function* (obj, reqItem = {}, res) {
    try {
        Object.assign(obj, reqItem);
        const errors = yield (0, class_validator_1.validate)(obj);
        if (errors.length > 0) {
            res.status(422).json({
                status: "failed",
                errors: errors.map((err) => ({
                    field: err.property,
                    message: err.constraints
                        ? Object.values(err.constraints).join(", ")
                        : "",
                })),
            });
            return errors;
        }
        return errors;
    }
    catch (error) {
        throw new Error(error);
    }
});
exports.handleValidation = handleValidation;
