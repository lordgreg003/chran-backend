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
const axios_1 = __importDefault(require("axios")); // Import axios to make HTTP requests
const handleToken_1 = __importDefault(require("../utils/handleToken"));
const handleValidation_1 = require("../utils/handleValidation");
const adminModel_1 = require("../model/adminModel");
const authController = {};
// Facebook App ID and Secret (store these in environment variables for security)
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "834398233245197";
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "a1a0d4fc4e1f92c73251c82dfa456a63";
// Function to verify the Facebook access token
const verifyFacebookToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://graph.facebook.com/debug_token?input_token=${token}&access_token=${FACEBOOK_APP_ID}|${FACEBOOK_APP_SECRET}`);
        return response.data.data;
    }
    catch (error) {
        console.error("Error verifying Facebook token:", error);
        throw new Error("Invalid Facebook token");
    }
});
// Registration Logic
authController.register = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, facebookToken } = req.body;
    try {
        if (facebookToken) {
            const fbTokenData = yield verifyFacebookToken(facebookToken);
            if (!fbTokenData.is_valid) {
                res.status(400).json({ message: "Invalid Facebook token" });
                return; // Exit early here
            }
            const facebookUserData = yield axios_1.default.get(`https://graph.facebook.com/me?access_token=${facebookToken}`);
            console.log(facebookUserData.data);
        }
        const errors = yield (0, handleValidation_1.handleValidation)(new adminModel_1.Admin(), req.body, res);
        if (errors.length > 0) {
            return;
        }
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
            return; // Exit early here
        }
        const newAdmin = new adminModel_1.Admin({
            username: (username || "").trim().toLowerCase(),
            password,
        });
        yield newAdmin.save();
        const accessToken = handleToken_1.default.generateToken({ id: newAdmin._id, username: newAdmin.username }, "30d");
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
        next(error); // No return here, just call next to propagate the error
    }
}));
authController.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, facebookToken } = req.body;
    try {
        if (facebookToken) {
            const fbTokenData = yield verifyFacebookToken(facebookToken);
            if (!fbTokenData.is_valid) {
                res.status(400).json({ message: "Invalid Facebook token" });
                return; // Exit early here
            }
            const facebookUserData = yield axios_1.default.get(`https://graph.facebook.com/me?access_token=${facebookToken}`);
            console.log(facebookUserData.data);
        }
        const errors = yield (0, handleValidation_1.handleValidation)(new adminModel_1.Admin(), req.body, res);
        if (errors.length > 0) {
            return;
        }
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
            return; // Exit early here
        }
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
            return; // Exit early here
        }
        const accessToken = handleToken_1.default.generateToken({
            id: admin._id,
            username: admin.username,
        }, "1d");
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
        console.error("Error during admin login:", error);
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
