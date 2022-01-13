"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../../helper/utils");
var CommandError_1 = __importDefault(require("../../CommandError"));
var ApiClient_1 = __importDefault(require("../ApiClient"));
var url_1 = require("./url");
var utils_2 = require("./utils");
var fs_extra_1 = __importDefault(require("fs-extra"));
var path_1 = __importDefault(require("path"));
var mime_1 = __importDefault(require("mime"));
exports.default = {
    startUpload: function (data, namespace) {
        try {
            var activeContext = utils_1.getActiveContext();
            var axiosOption = Object.assign({}, {
                data: data,
            }, utils_2.getCommonHeaderOptions());
            return ApiClient_1.default.post(url_1.URLS.START_UPLOAD_FILE(activeContext.application_id, activeContext.company_id, namespace), axiosOption);
        }
        catch (error) {
            throw new CommandError_1.default(error.message, error.code);
        }
    },
    uploadFile: function (filepath, namespace) { return __awaiter(void 0, void 0, void 0, function () {
        var activeContext, stats, contentType, startData, axiosOption, res1, startResponse, s3Url, res2, uploadResponse, res3, completeResponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    activeContext = utils_1.getActiveContext();
                    // start
                    try {
                        stats = fs_extra_1.default.statSync(filepath);
                    }
                    catch (err) {
                        // if the file does not exist, just return
                        console.log(err);
                        return [2 /*return*/];
                    }
                    contentType = mime_1.default.getType(path_1.default.extname(filepath));
                    if (contentType === 'image/jpg') {
                        contentType = 'image/jpeg';
                    }
                    startData = {
                        file_name: path_1.default.basename(filepath),
                        content_type: contentType,
                        size: stats.size,
                    };
                    axiosOption = Object.assign({}, {
                        data: startData,
                    }, utils_2.getCommonHeaderOptions());
                    return [4 /*yield*/, ApiClient_1.default.post(url_1.URLS.START_UPLOAD_FILE(activeContext.application_id, activeContext.company_id, namespace), axiosOption)];
                case 1:
                    res1 = _a.sent();
                    startResponse = res1 ? res1.data : res1;
                    s3Url = startResponse.upload.url;
                    return [4 /*yield*/, ApiClient_1.default.put(s3Url, {
                            data: fs_extra_1.default.readFileSync(filepath),
                            headers: { 'Content-type': contentType },
                        })];
                case 2:
                    res2 = _a.sent();
                    uploadResponse = res2 ? res2.data : res2;
                    // complete
                    axiosOption = Object.assign({}, {
                        data: __assign({ response: startResponse }, startData),
                    }, utils_2.getCommonHeaderOptions());
                    return [4 /*yield*/, ApiClient_1.default.post(url_1.URLS.COMPLETE_UPLOAD_FILE(activeContext.application_id, activeContext.company_id, namespace), axiosOption)];
                case 3:
                    res3 = _a.sent();
                    completeResponse = res3 ? res3.data : res3;
                    return [2 /*return*/, {
                            start: startResponse,
                            upload: uploadResponse,
                            complete: completeResponse,
                        }];
            }
        });
    }); },
};
