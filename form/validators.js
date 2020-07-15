"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class RbValidator {
    static isEmpty(control) {
        return (control && (_.isEmpty(control.value) || control.value.length == 0));
    }
    static noEmptyInGroup(field, dependentFieldNames) {
        return (control) => {
            const group = field.formModel;
            if (group) {
                const status = { empty: false, emptyFields: [] };
                _.forEach(dependentFieldNames, (f) => {
                    const isEmpty = RbValidator.isEmpty(group.controls[f]);
                    if (isEmpty) {
                        status.emptyFields.push(f);
                    }
                    status.empty = status.empty || (isEmpty != null);
                });
                const retval = status.empty ? status : null;
                return retval;
            }
            console.log(`Group doesn't exist yet: ${field.name}`);
        };
    }
}
exports.RbValidator = RbValidator;
