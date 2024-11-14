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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const handleToken_1 = __importDefault(require("../utils/handleToken")); // Assuming you
const handleValidation_1 = require("../utils/handleValidation"); //
const adminModel_1 = require("../model/adminModel");
const authController = {};
// Registration Logic
authController.register = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Auth']
    const { username, password } = req.body;
    try {
        // Validate the user fields
        const errors = yield (0, handleValidation_1.handleValidation)(new adminModel_1.Admin(), // Validate against Admin model
        req.body, res);
        if (errors.length > 0) {
            return; // No need to return anything, just exit the function
        }
        // Check if the username is already taken
        const userExists = yield adminModel_1.Admin.findOne({
            username: (username || "").trim().toLowerCase(),
        });
        if (userExists) {
            res.status(422).json({
                status: "failed",
                errors: [
                    {
                        field: "username",
                        message: "Username already taken",
                    },
                ],
            });
            return; // Exit the function after sending the response
        }
        // Create a new admin
        const newAdmin = new adminModel_1.Admin({
            username: (username || "").trim().toLowerCase(),
            password, // Store the raw password for hashing
        });
        yield newAdmin.save(); // Save the admin to the database
        // Generate access token
        const accessToken = handleToken_1.default.generateToken({ id: newAdmin._id, username: newAdmin.username }, "30d");
        // Send the success response
        res.status(201).json({
            status: "success",
            message: "Registration successful",
            data: {
                accessToken,
                user: {
                    id: newAdmin._id,
                    username: newAdmin.username,
                },
            },
        });
    }
    catch (error) {
        console.error("Error during admin registration: ", error);
        next(error);
    }
}));
// Login Logic
authController.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // #swagger.tags = ['Auth']
    const { username, password } = req.body;
    try {
        // Validate the user fields
        const errors = yield (0, handleValidation_1.handleValidation)(new adminModel_1.Admin(), // Validate against Admin model
        req.body, res);
        if (errors.length > 0) {
            return;
        }
        // Check if the username exists
        const admin = yield adminModel_1.Admin.findOne({
            username: username.trim().toLowerCase(),
        });
        if (!admin) {
            res.status(401).json({
                errors: [
                    {
                        field: "username",
                        message: "Admin does not exist",
                    },
                ],
            });
            return;
        }
        // Validate the password
        const validPassword = yield admin.matchPassword(password.trim());
        if (!validPassword) {
            res.status(401).json({
                errors: [
                    {
                        field: "password",
                        message: "Invalid password",
                    },
                ],
            });
            return;
        }
        // Generate a token and send it along with user details
        const accessToken = handleToken_1.default.generateToken({
            id: admin._id,
            username: admin.username,
        }, "1d");
        // Send the success response
        res.status(200).json({
            status: "success",
            message: "Login successful",
            data: {
                accessToken,
                user: {
                    id: admin._id,
                    username: admin.username,
                },
            },
        });
    }
    catch (error) {
        console.error("Error during admin login:", error); // Log the error for debugging
        res.status(500).json({
            errors: [
                {
                    message: "Server error. Please try again later.",
                },
            ],
        });
    }
}));
exports.default = authController;
