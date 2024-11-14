"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tokenHandler = {
    generateToken: (fieldToSecure, duration) => {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("JWT secret key is missing");
            // console.log("JWT Secret Key for signing:", secret);
            return jsonwebtoken_1.default.sign({ fieldToSecure }, secret, {
                expiresIn: duration ? duration : "30d",
            });
        }
        catch (error) {
            throw new Error(`Error generating token: ${error.message}`);
        }
    },
    decodeToken: (token) => {
        try {
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw new Error("JWT secret key is missing");
            // console.log("JWT Secret Key for verifying:", secret);
            return jsonwebtoken_1.default.verify(token, secret);
        }
        catch (error) {
            throw new Error(`Error decoding token: ${error.message}`);
        }
    },
};
exports.default = tokenHandler;
