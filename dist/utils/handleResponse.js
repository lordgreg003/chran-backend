"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const responseHandle = {};
responseHandle.successResponse = (res, status, message, data) => {
    return res.status(Number(status)).json({
        status: "success",
        message,
        data,
    });
};
exports.default = responseHandle;
