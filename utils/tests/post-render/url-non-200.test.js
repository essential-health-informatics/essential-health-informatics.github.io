"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const glob = __importStar(require("glob"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const render_folder = '_site';
const verbose = false;
function checkUrlStatus(url) {
    return __awaiter(this, void 0, void 0, function* () {
        if (url.startsWith('file://')) {
            const filePath = url.replace('file://', '');
            try {
                yield fs.promises.access(filePath, fs.constants.F_OK);
                return 200;
            }
            catch (_a) {
                return 404;
            }
        }
        else {
            try {
                const response = yield axios_1.default.get(url);
                return response.status;
            }
            catch (error) {
                if (error.response) {
                    return error.response.status;
                }
                else {
                    console.log(`Error fetching ${url}:`, error.message);
                    return 0;
                }
            }
        }
    });
}
function findHtmlFiles(dir) {
    const pattern = path.join(dir, '**/*.html');
    return glob.sync(pattern);
}
function checkUrlsInSiteFolder() {
    return __awaiter(this, void 0, void 0, function* () {
        const siteFolder = path.join(process.cwd(), render_folder);
        const htmlFiles = findHtmlFiles(siteFolder);
        let errorMessage = '';
        for (const file of htmlFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            const urls = content.match(/href="([^"]+)"/g);
            const fileShort = file.replace(process.cwd(), '');
            if (urls) {
                for (const url of urls) {
                    const cleanUrl = url.replace(/href="|"/g, '');
                    let fullUrl = cleanUrl;
                    if (cleanUrl.startsWith('http')) {
                        const status = yield checkUrlStatus(fullUrl);
                        if (status !== 200) {
                            console.log(`URL ${fullUrl} returned status ${status}`);
                            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, url \x1b[2m${cleanUrl}\x1b[0m returned status \x1b[2m${status}\x1b[0m\n`;
                        }
                        else {
                            verbose && console.log(`URL ${fullUrl} is OK`);
                            continue;
                        }
                    }
                    else if (cleanUrl.startsWith('#') ||
                        cleanUrl.startsWith('/site_libs/')) {
                        continue;
                    }
                    else if (cleanUrl.startsWith('/')) {
                        fullUrl = path.resolve(process.cwd(), cleanUrl);
                        try {
                            yield fs.promises.access(render_folder, fs.constants.F_OK);
                            verbose &&
                                console.log(`\x1b[34mLocal file ${fullUrl} exists\x1b[0m`);
                        }
                        catch (_a) {
                            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, the local url \x1b[2m${cleanUrl}\x1b[0m did not exist\n`;
                        }
                    }
                    else {
                        fullUrl = path.resolve(path.dirname(file), cleanUrl);
                        try {
                            yield fs.promises.access(fullUrl, fs.constants.F_OK);
                        }
                        catch (_b) {
                            errorMessage += `In file \x1b[2m${fileShort}\x1b[0m, the local url \x1b[2m${cleanUrl}\x1b[0m does not exist\n`;
                        }
                    }
                }
            }
        }
        return errorMessage;
    });
}
describe('URLs in site folder', () => {
    it('should return 200 for all URLs', () => __awaiter(void 0, void 0, void 0, function* () {
        const errorMessage = yield checkUrlsInSiteFolder();
        if (errorMessage) {
            throw new Error(`The following url fails occurred:\n\n${errorMessage}`);
        }
    }));
});
