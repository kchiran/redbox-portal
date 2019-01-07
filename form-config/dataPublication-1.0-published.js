/**
 * Data Publication form - Published
 */

// import the common publication tabs
//
var _ = require('lodash');
var mainViewOnly = require('./publication/header-view-only-1.0.js');
var mainTab = require('./publication/tab-main-1.0.js');
// Published specific footer
var footer = require('./publication/footer-published-1.0.js');
// Start building the main tab and child tabs...
var startTab = require('./publication/tab-start-1.0.js');
var coverageTab = require('./publication/tab-coverage-1.0.js');
var dataTab = require('./publication/tab-data-1.0.js');
var supplementsTab = require('./publication/tab-supplements-1.0.js');
var licenseTab = require('./publication/tab-license-1.0.js');
var citationTab = require('./publication/tab-citation-1.0.js');
var submitTab = require('./publication/tab-submit-1.0.js');
var reviewerTab = require('./publication/tab-reviewer-1.0.js');
mainTab[0].definition.fields = _.concat(startTab, coverageTab, dataTab, supplementsTab, licenseTab, citationTab, submitTab, reviewerTab);
// now buid the main elements of the form....
var fields = _.concat(mainViewOnly, mainTab, footer);
module.exports = {
  name: 'dataPublication-1.0-published',
  type: 'dataPublication',
  skipValidationOnSave: false,
  editCssClasses: 'row col-md-12',
  viewCssClasses: 'row col-md-offset-1 col-md-10',
  messages: {
    "saving": ["@dmpt-form-saving"],
    "validationFail": ["@dmpt-form-validation-fail-prefix", "@dmpt-form-validation-fail-suffix"],
    "saveSuccess": ["@dmpt-form-save-success"],
    "saveError": ["@dmpt-form-save-error"]
  },
  fields: fields
};
