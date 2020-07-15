"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let StringTemplatePipe = class StringTemplatePipe {
    constructor() {
        this.generateTemplateString = (function () {
            var cache = {};
            function generateTemplate(template) {
                var fn = cache[template];
                if (!fn) {
                    var sanitized = template
                        .replace(/\$\{([\s]*[^;\s\{]+[\s]*)\}/g, function (_, match) {
                        return `\$\{map.${match.trim()}\}`;
                    })
                        .replace(/(\$\{(?!map\.)[^}]+\})/g, '');
                    fn = Function('map', `return \`${sanitized}\``);
                }
                return fn;
            }
            ;
            return generateTemplate;
        })();
    }
    transform(templateString, args) {
        if (args != null) {
            var template = this.generateTemplateString(templateString);
            return template(args);
        }
        return templateString;
    }
};
StringTemplatePipe = __decorate([
    core_1.Pipe({
        name: 'stringTemplate'
    })
], StringTemplatePipe);
exports.StringTemplatePipe = StringTemplatePipe;
