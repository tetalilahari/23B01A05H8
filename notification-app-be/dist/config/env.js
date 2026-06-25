"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.CONFIG = {
    PORT: process.env.PORT || 3001,
    BEARER_TOKEN: process.env.BEARER_TOKEN || "",
    TEST_SERVER: process.env.TEST_SERVER || "http://4.224.186.213/evaluation-service",
};
