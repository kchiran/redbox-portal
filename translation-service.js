"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const ngx_i18next_1 = require("ngx-i18next");
const Subject_1 = require("rxjs/Subject");
const config_service_1 = require("./config-service");
let TranslationService = class TranslationService {
    constructor(translateI18Next, configService) {
        this.translateI18Next = translateI18Next;
        this.configService = configService;
        this.subjects = {};
        this.initTranslator();
    }
    initTranslator() {
        this.subjects['init'] = new Subject_1.Subject();
        const ts = new Date().getTime();
        this.translateI18Next.init({
            debug: true,
            returnNull: false,
            returnEmptyString: true,
            lng: 'en',
            fallbackLng: 'en',
            backend: { loadPath: `/locales/{{lng}}/{{ns}}.json?ts=${ts}` }
        }).then(() => {
            console.log(`Translator loaded...`);
            this.translatorReady = true;
            this.translatorLoaded();
        });
    }
    translatorLoaded() {
        if (this.translatorReady) {
            this.subjects['init'].next(this);
        }
    }
    isReady(handler) {
        const subs = this.subjects['init'].subscribe(handler);
        this.translatorLoaded();
        return subs;
    }
    t(key) {
        return this.translateI18Next.translate(key);
    }
};
TranslationService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [typeof (_a = typeof ngx_i18next_1.TranslateI18Next !== "undefined" && ngx_i18next_1.TranslateI18Next) === "function" ? _a : Object, config_service_1.ConfigService])
], TranslationService);
exports.TranslationService = TranslationService;
