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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express_async_handler_1 = require("express-async-handler");
var axios_1 = require("axios"); // Import axios to make HTTP requests
var handleToken_1 = require("../utils/handleToken");
var handleValidation_1 = require("../utils/handleValidation");
var adminModel_1 = require("../model/adminModel");
var authController = {};
// Facebook App ID and Secret (store these in environment variables for security)
var FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || "834398233245197";
var FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET || "a1a0d4fc4e1f92c73251c82dfa456a63";
// Function to verify the Facebook access token
var verifyFacebookToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, axios_1["default"].get("https://graph.facebook.com/debug_token?input_token=" + token + "&access_token=" + FACEBOOK_APP_ID + "|" + FACEBOOK_APP_SECRET)];
            case 1:
                response = _a.sent();
                return [2 /*return*/, response.data.data];
            case 2:
                error_1 = _a.sent();
                console.error("Error verifying Facebook token:", error_1);
                throw new Error("Invalid Facebook token");
            case 3: return [2 /*return*/];
        }
    });
}); };
// Registration Logic
authController.register = express_async_handler_1["default"](function (req, res, next) { return __awaiter(void 0, void 0, Promise, function () {
    var _a, username, password, facebookToken, fbTokenData, facebookUserData, errors, userExists, newAdmin, accessToken, error_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password, facebookToken = _a.facebookToken;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                if (!facebookToken) return [3 /*break*/, 4];
                return [4 /*yield*/, verifyFacebookToken(facebookToken)];
            case 2:
                fbTokenData = _b.sent();
                if (!fbTokenData.is_valid) {
                    res.status(400).json({ message: "Invalid Facebook token" });
                    return [2 /*return*/]; // Exit early here
                }
                return [4 /*yield*/, axios_1["default"].get("https://graph.facebook.com/me?access_token=" + facebookToken)];
            case 3:
                facebookUserData = _b.sent();
                console.log(facebookUserData.data);
                _b.label = 4;
            case 4: return [4 /*yield*/, handleValidation_1.handleValidation(new adminModel_1.Admin(), req.body, res)];
            case 5:
                errors = _b.sent();
                if (errors.length > 0) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, adminModel_1.Admin.findOne({
                        username: (username || "").trim().toLowerCase()
                    })];
            case 6:
                userExists = _b.sent();
                if (userExists) {
                    res.status(422).json({
                        status: "failed",
                        errors: [
                            {
                                field: "username",
                                message: "Username already taken"
                            },
                        ]
                    });
                    return [2 /*return*/]; // Exit early here
                }
                newAdmin = new adminModel_1.Admin({
                    username: (username || "").trim().toLowerCase(),
                    password: password
                });
                return [4 /*yield*/, newAdmin.save()];
            case 7:
                _b.sent();
                accessToken = handleToken_1["default"].generateToken({ id: newAdmin._id, username: newAdmin.username }, "30d");
                res.status(201).json({
                    status: "success",
                    message: "Registration successful",
                    data: {
                        accessToken: accessToken,
                        user: {
                            id: newAdmin._id,
                            username: newAdmin.username
                        }
                    }
                });
                return [3 /*break*/, 9];
            case 8:
                error_2 = _b.sent();
                console.error("Error during admin registration: ", error_2);
                next(error_2); // No return here, just call next to propagate the error
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
authController.login = express_async_handler_1["default"](function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, username, password, facebookToken, fbTokenData, facebookUserData, errors, admin, validPassword, accessToken, error_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, username = _a.username, password = _a.password, facebookToken = _a.facebookToken;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                if (!facebookToken) return [3 /*break*/, 4];
                return [4 /*yield*/, verifyFacebookToken(facebookToken)];
            case 2:
                fbTokenData = _b.sent();
                if (!fbTokenData.is_valid) {
                    res.status(400).json({ message: "Invalid Facebook token" });
                    return [2 /*return*/]; // Exit early here
                }
                return [4 /*yield*/, axios_1["default"].get("https://graph.facebook.com/me?access_token=" + facebookToken)];
            case 3:
                facebookUserData = _b.sent();
                console.log(facebookUserData.data);
                _b.label = 4;
            case 4: return [4 /*yield*/, handleValidation_1.handleValidation(new adminModel_1.Admin(), req.body, res)];
            case 5:
                errors = _b.sent();
                if (errors.length > 0) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, adminModel_1.Admin.findOne({
                        username: username.trim().toLowerCase()
                    })];
            case 6:
                admin = _b.sent();
                if (!admin) {
                    res.status(401).json({
                        errors: [
                            {
                                field: "username",
                                message: "Admin does not exist"
                            },
                        ]
                    });
                    return [2 /*return*/]; // Exit early here
                }
                return [4 /*yield*/, admin.matchPassword(password.trim())];
            case 7:
                validPassword = _b.sent();
                if (!validPassword) {
                    res.status(401).json({
                        errors: [
                            {
                                field: "password",
                                message: "Invalid password"
                            },
                        ]
                    });
                    return [2 /*return*/]; // Exit early here
                }
                accessToken = handleToken_1["default"].generateToken({
                    id: admin._id,
                    username: admin.username
                }, "1d");
                res.status(200).json({
                    status: "success",
                    message: "Login successful",
                    data: {
                        accessToken: accessToken,
                        user: {
                            id: admin._id,
                            username: admin.username
                        }
                    }
                });
                return [3 /*break*/, 9];
            case 8:
                error_3 = _b.sent();
                console.error("Error during admin login:", error_3);
                res.status(500).json({
                    errors: [
                        {
                            message: "Server error. Please try again later."
                        },
                    ]
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); });
exports["default"] = authController;
