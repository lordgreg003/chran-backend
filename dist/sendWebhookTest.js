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
const axios_1 = __importDefault(require("axios"));
// Define the payload structure
const payload = {
    title: "This happened today at ITAM",
    description: "This is a sample post",
    slug: "this-happened-today-at-itam",
    media: [
        {
            url: "https://res.cloudinary.com/dg8cmo2gb/image/upload/v1732618339/blog_posts/g12wzcr5gw1po9c80zqr.jpg",
            type: "image",
        },
        {
            url: "https://res.cloudinary.com/dg8cmo2gb/image/upload/v1732618339/blog_posts/g12wzcr5gw1po9c80zqr.jpg",
            type: "image",
        },
    ],
    fullUrl: "https://chran1.vercel.app/blog/this-happened-today-at-itam",
};
// Define the webhook URL
const webhookUrl = "https://hook.eu2.make.com/1iq799yjpugo0v7fgwwfggvj21qyrren";
// Send the request using Axios
const sendTestRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.post(webhookUrl, payload, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        console.log("Webhook test sent successfully:", response.data);
    }
    catch (error) {
        console.error("Error sending test request:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
        }
    }
});
// Run the function
sendTestRequest();
