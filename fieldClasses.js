"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const field_simple_1 = require("./form/field-simple");
const field_textfield_component_1 = require("./form/field-textfield.component");
const field_simple_component_1 = require("./form/field-simple.component");
const record_meta_component_1 = require("./form/record-meta.component");
const field_vocab_component_1 = require("./form/field-vocab.component");
const field_repeatable_component_1 = require("./form/field-repeatable.component");
const field_contributor_component_1 = require("./form/field-contributor.component");
const workflow_button_component_1 = require("./form/workflow-button.component");
const action_button_component_1 = require("./form/action-button.component");
const field_relatedobjectdata_component_1 = require("./form/field-relatedobjectdata.component");
const field_relatedobjectselector_component_1 = require("./form/field-relatedobjectselector.component");
const field_datalocation_component_1 = require("./form/field-datalocation.component");
const field_relatedfileupload_component_1 = require("./form/field-relatedfileupload.component");
const field_publishdatalocationselector_component_1 = require("./form/field-publishdatalocationselector.component");
const field_map_component_1 = require("./form/field-map.component");
const field_group_component_1 = require("./form/field-group.component");
const workspace_field_component_1 = require("./form/workspace-field.component");
const workspace_selector_component_1 = require("./form/workspace-selector.component");
const workspace_select_component_1 = require("./form/workspace-select.component");
const field_andsvocab_component_1 = require("./form/field-andsvocab.component");
const field_pdflist_component_1 = require("./form/field-pdflist.component");
const field_asynch_component_1 = require("./form/field-asynch.component");
exports.fieldClasses = {
    'TextField': { 'meta': field_textfield_component_1.TextField, 'comp': field_textfield_component_1.TextFieldComponent },
    'TextArea': { 'meta': field_textfield_component_1.TextArea, 'comp': field_textfield_component_1.TextAreaComponent },
    'MarkdownTextArea': { 'meta': field_textfield_component_1.MarkdownTextArea, 'comp': field_textfield_component_1.MarkdownTextAreaComponent },
    'DateTime': { 'meta': field_simple_1.DateTime, 'comp': field_simple_component_1.DateTimeComponent },
    'Container': { 'meta': field_simple_1.Container, 'comp': [field_simple_component_1.TextBlockComponent, field_group_component_1.GenericGroupComponent] },
    'TabOrAccordionContainer': { 'meta': field_simple_1.TabOrAccordionContainer, 'comp': field_simple_component_1.TabOrAccordionContainerComponent },
    'ButtonBarContainer': { 'meta': field_simple_1.ButtonBarContainer, 'comp': field_simple_component_1.ButtonBarContainerComponent },
    'AnchorOrButton': { 'meta': field_simple_1.AnchorOrButton, 'comp': field_simple_component_1.AnchorOrButtonComponent },
    'SaveButton': { 'meta': field_simple_1.SaveButton, 'comp': field_simple_component_1.SaveButtonComponent },
    'CancelButton': { 'meta': field_simple_1.CancelButton, 'comp': field_simple_component_1.CancelButtonComponent },
    'VocabField': { 'meta': field_vocab_component_1.VocabField, 'comp': field_vocab_component_1.VocabFieldComponent, 'lookupService': 'vocabFieldLookupService' },
    'RepeatableContainer': { 'meta': field_repeatable_component_1.RepeatableContainer, 'comp': [field_repeatable_component_1.RepeatableVocabComponent, field_textfield_component_1.RepeatableTextfieldComponent, field_group_component_1.RepeatableGroupComponent] },
    'RepeatableContributor': { 'meta': field_repeatable_component_1.RepeatableContributor, 'comp': field_repeatable_component_1.RepeatableContributorComponent },
    'RepeatableVocab': { 'meta': field_repeatable_component_1.RepeatableVocab, 'comp': field_repeatable_component_1.RepeatableVocabComponent },
    'ContributorField': { 'meta': field_contributor_component_1.ContributorField, 'comp': field_contributor_component_1.ContributorComponent, 'lookupService': 'vocabFieldLookupService' },
    'HiddenValue': { 'meta': field_simple_1.HiddenValue, 'comp': field_simple_component_1.HiddenValueComponent },
    'WorkflowStepButton': { 'meta': workflow_button_component_1.WorkflowStepButton, 'comp': workflow_button_component_1.WorkflowStepButtonComponent },
    'ActionButton': { 'meta': action_button_component_1.ActionButton, 'comp': action_button_component_1.ActionButtonComponent },
    'LinkValueComponent': { 'meta': field_simple_1.LinkValue, 'comp': field_simple_component_1.LinkValueComponent },
    'SelectionField': { 'meta': field_simple_1.SelectionField, 'comp': [field_simple_component_1.SelectionFieldComponent, field_simple_component_1.DropdownFieldComponent] },
    'RelatedObjectDataField': { 'meta': field_relatedobjectdata_component_1.RelatedObjectDataField, 'comp': field_relatedobjectdata_component_1.RelatedObjectDataComponent, 'lookupService': 'vocabFieldLookupService' },
    'MapField': { 'meta': field_map_component_1.MapField, 'comp': field_map_component_1.MapComponent, 'lookupService': 'vocabFieldLookupService' },
    'ParameterRetriever': { 'meta': field_simple_1.ParameterRetrieverField, 'comp': field_simple_component_1.ParameterRetrieverComponent },
    'RecordMetadataRetriever': { 'meta': record_meta_component_1.RecordMetadataRetrieverField, 'comp': record_meta_component_1.RecordMetadataRetrieverComponent },
    'RelatedObjectSelector': { 'meta': field_relatedobjectselector_component_1.RelatedObjectSelectorField, 'comp': field_relatedobjectselector_component_1.RelatedObjectSelectorComponent },
    'DataLocation': { 'meta': field_datalocation_component_1.DataLocationField, 'comp': field_datalocation_component_1.DataLocationComponent },
    'RelatedFileUpload': { 'meta': field_relatedfileupload_component_1.RelatedFileUploadField, 'comp': field_relatedfileupload_component_1.RelatedFileUploadComponent },
    'WorkspaceSelectorField': { 'meta': workspace_field_component_1.WorkspaceSelectorField, 'comp': [workspace_selector_component_1.WorkspaceSelectorComponent, workspace_selector_component_1.WorkspaceSelectorFieldComponent, workspace_select_component_1.WorkspaceSelectComponent, workspace_select_component_1.WorkspaceSelectFieldComponent] },
    'PublishDataLocationSelector': { 'meta': field_publishdatalocationselector_component_1.PublishDataLocationSelectorField, 'comp': field_publishdatalocationselector_component_1.PublishDataLocationSelectorComponent },
    'TabNavButton': { 'meta': field_simple_1.TabNavButton, 'comp': field_simple_component_1.TabNavButtonComponent },
    'Spacer': { 'meta': field_simple_1.Spacer, 'comp': field_simple_component_1.SpacerComponent },
    'ANDSVocab': { 'meta': field_andsvocab_component_1.ANDSVocabField, 'comp': field_andsvocab_component_1.ANDSVocabComponent },
    'PDFList': { 'meta': field_pdflist_component_1.PDFListField, 'comp': field_pdflist_component_1.PDFListComponent },
    'AsynchField': { 'meta': field_asynch_component_1.AsynchField, 'comp': field_asynch_component_1.AsynchComponent },
    'Toggle': { 'meta': field_simple_1.Toggle, 'comp': field_simple_component_1.ToggleComponent },
    'HtmlRaw': { 'meta': field_simple_1.HtmlRaw, 'comp': field_simple_component_1.HtmlRawComponent }
};
