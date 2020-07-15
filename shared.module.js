"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const angular2_markdown_1 = require("angular2-markdown");
const forms_1 = require("@angular/forms");
const platform_browser_1 = require("@angular/platform-browser");
const records_service_1 = require("./form/records.service");
const field_control_service_1 = require("./form/field-control.service");
const field_textfield_component_1 = require("./form/field-textfield.component");
const field_simple_component_1 = require("./form/field-simple.component");
const record_meta_component_1 = require("./form/record-meta.component");
const field_vocab_component_1 = require("./form/field-vocab.component");
const field_repeatable_component_1 = require("./form/field-repeatable.component");
const field_contributor_component_1 = require("./form/field-contributor.component");
const field_pdflist_component_1 = require("./form/field-pdflist.component");
const field_relatedobjectdata_component_1 = require("./form/field-relatedobjectdata.component");
const field_relatedobjectselector_component_1 = require("./form/field-relatedobjectselector.component");
const field_datalocation_component_1 = require("./form/field-datalocation.component");
const field_relatedfileupload_component_1 = require("./form/field-relatedfileupload.component");
const field_publishdatalocationselector_component_1 = require("./form/field-publishdatalocationselector.component");
const field_andsvocab_component_1 = require("./form/field-andsvocab.component");
const field_map_component_1 = require("./form/field-map.component");
const workflow_button_component_1 = require("./form/workflow-button.component");
const action_button_component_1 = require("./form/action-button.component");
const config_service_1 = require("./config-service");
const translation_service_1 = require("./translation-service");
const ng2_datetime_1 = require("ng2-datetime/ng2-datetime");
const ng2_completer_1 = require("ng2-completer");
const ngx_i18next_1 = require("ngx-i18next");
const ngx_leaflet_1 = require("@asymmetrik/ngx-leaflet");
const ngx_leaflet_draw_1 = require("@asymmetrik/ngx-leaflet-draw");
const dmp_field_component_1 = require("./form/dmp-field.component");
const user_service_simple_1 = require("./user.service-simple");
const dashboard_service_1 = require("./dashboard-service");
const ands_service_1 = require("./ands-service");
const StringTemplatePipe_1 = require("./StringTemplatePipe");
const roles_service_1 = require("./roles-service");
const util_service_1 = require("./util-service");
const email_service_1 = require("./email-service");
const field_group_component_1 = require("./form/field-group.component");
const workspace_selector_component_1 = require("./form/workspace-selector.component");
const workspace_service_1 = require("./workspace-service");
const workspace_field_component_1 = require("./form/workspace-field.component");
const workspace_selector_component_2 = require("./form/workspace-selector.component");
const workspace_select_component_1 = require("./form/workspace-select.component");
const field_control_meta_service_1 = require("./form/field-control-meta.service");
const angular_tree_component_1 = require("angular-tree-component");
const field_asynch_component_1 = require("./form/field-asynch.component");
const tree_node_checkbox_component_1 = require("./form/tree-node-checkbox.component");
const mobx_angular_1 = require("mobx-angular");
let SharedModule = class SharedModule {
};
SharedModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, forms_1.ReactiveFormsModule, ng2_datetime_1.NKDatetimeModule, ng2_completer_1.Ng2CompleterModule, ngx_i18next_1.TranslateI18NextModule, ngx_leaflet_1.LeafletModule.forRoot(), ngx_leaflet_draw_1.LeafletDrawModule.forRoot(), angular2_markdown_1.MarkdownModule.forRoot(), angular_tree_component_1.TreeModule, mobx_angular_1.MobxAngularModule],
        exports: [ng2_datetime_1.NKDatetimeModule, ng2_completer_1.Ng2CompleterModule, ngx_i18next_1.TranslateI18NextModule, dmp_field_component_1.DmpFieldComponent, field_textfield_component_1.TextFieldComponent, field_simple_component_1.DropdownFieldComponent, field_simple_component_1.TabOrAccordionContainerComponent, field_simple_component_1.ButtonBarContainerComponent, field_simple_component_1.TextBlockComponent, field_textfield_component_1.MarkdownTextAreaComponent, field_textfield_component_1.TextAreaComponent, field_simple_component_1.DateTimeComponent, field_simple_component_1.AnchorOrButtonComponent, field_vocab_component_1.VocabFieldComponent, field_repeatable_component_1.RepeatableVocabComponent, field_contributor_component_1.ContributorComponent, field_repeatable_component_1.RepeatableContributorComponent, field_simple_component_1.HtmlRawComponent, field_simple_component_1.HiddenValueComponent, workflow_button_component_1.WorkflowStepButtonComponent, action_button_component_1.ActionButtonComponent, field_simple_component_1.LinkValueComponent, field_simple_component_1.SelectionFieldComponent, field_textfield_component_1.RepeatableTextfieldComponent, StringTemplatePipe_1.StringTemplatePipe, field_group_component_1.GenericGroupComponent, field_group_component_1.RepeatableGroupComponent, field_map_component_1.MapComponent, field_simple_component_1.ParameterRetrieverComponent, record_meta_component_1.RecordMetadataRetrieverComponent, field_relatedobjectselector_component_1.RelatedObjectSelectorComponent, field_datalocation_component_1.DataLocationComponent, field_relatedfileupload_component_1.RelatedFileUploadComponent, field_publishdatalocationselector_component_1.PublishDataLocationSelectorComponent, workspace_selector_component_1.WorkspaceSelectorFieldComponent, field_simple_component_1.TabNavButtonComponent, field_simple_component_1.SpacerComponent, workspace_field_component_1.WorkspaceFieldComponent, workspace_selector_component_2.WorkspaceSelectorComponent, workspace_select_component_1.WorkspaceSelectFieldComponent, workspace_select_component_1.WorkspaceSelectComponent, field_andsvocab_component_1.ANDSVocabComponent, field_pdflist_component_1.PDFListComponent, angular_tree_component_1.TreeModule, field_asynch_component_1.AsynchComponent, field_simple_component_1.ToggleComponent, tree_node_checkbox_component_1.TreeNodeCheckboxComponent],
        declarations: [dmp_field_component_1.DmpFieldComponent, field_textfield_component_1.TextFieldComponent, field_simple_component_1.DropdownFieldComponent, field_simple_component_1.TabOrAccordionContainerComponent, field_simple_component_1.ButtonBarContainerComponent, field_simple_component_1.TextBlockComponent, field_textfield_component_1.MarkdownTextAreaComponent, field_textfield_component_1.TextAreaComponent, field_simple_component_1.DateTimeComponent, field_simple_component_1.AnchorOrButtonComponent, field_simple_component_1.SaveButtonComponent, field_simple_component_1.CancelButtonComponent, field_vocab_component_1.VocabFieldComponent, field_repeatable_component_1.RepeatableVocabComponent, field_contributor_component_1.ContributorComponent, field_repeatable_component_1.RepeatableContributorComponent, field_simple_component_1.HtmlRawComponent, field_simple_component_1.HiddenValueComponent, workflow_button_component_1.WorkflowStepButtonComponent, action_button_component_1.ActionButtonComponent, field_simple_component_1.LinkValueComponent, field_simple_component_1.SelectionFieldComponent, field_textfield_component_1.RepeatableTextfieldComponent, field_relatedobjectdata_component_1.RelatedObjectDataComponent, StringTemplatePipe_1.StringTemplatePipe, field_group_component_1.GenericGroupComponent, field_group_component_1.RepeatableGroupComponent, field_map_component_1.MapComponent, field_simple_component_1.ParameterRetrieverComponent, record_meta_component_1.RecordMetadataRetrieverComponent, field_relatedobjectselector_component_1.RelatedObjectSelectorComponent, field_datalocation_component_1.DataLocationComponent, field_relatedfileupload_component_1.RelatedFileUploadComponent, field_publishdatalocationselector_component_1.PublishDataLocationSelectorComponent, workspace_selector_component_1.WorkspaceSelectorFieldComponent, field_simple_component_1.TabNavButtonComponent, field_simple_component_1.SpacerComponent, workspace_field_component_1.WorkspaceFieldComponent, workspace_selector_component_2.WorkspaceSelectorComponent, workspace_select_component_1.WorkspaceSelectFieldComponent, workspace_select_component_1.WorkspaceSelectComponent, field_andsvocab_component_1.ANDSVocabComponent, field_pdflist_component_1.PDFListComponent, field_asynch_component_1.AsynchComponent, field_simple_component_1.ToggleComponent, tree_node_checkbox_component_1.TreeNodeCheckboxComponent],
        providers: [field_control_service_1.FieldControlService, records_service_1.RecordsService, field_vocab_component_1.VocabFieldLookupService, config_service_1.ConfigService, translation_service_1.TranslationService, user_service_simple_1.UserSimpleService, dashboard_service_1.DashboardService, roles_service_1.RolesService, email_service_1.EmailNotificationService, util_service_1.UtilityService, workspace_service_1.WorkspaceTypeService, field_control_meta_service_1.FieldControlMetaService, ands_service_1.ANDSService],
        bootstrap: [],
        entryComponents: [dmp_field_component_1.DmpFieldComponent, field_textfield_component_1.TextFieldComponent, field_simple_component_1.DropdownFieldComponent, field_simple_component_1.TabOrAccordionContainerComponent, field_simple_component_1.ButtonBarContainerComponent, field_simple_component_1.TextBlockComponent, field_textfield_component_1.MarkdownTextAreaComponent, field_textfield_component_1.TextAreaComponent, field_simple_component_1.DateTimeComponent, field_simple_component_1.AnchorOrButtonComponent, field_simple_component_1.SaveButtonComponent, field_simple_component_1.CancelButtonComponent, field_vocab_component_1.VocabFieldComponent, field_repeatable_component_1.RepeatableVocabComponent, field_contributor_component_1.ContributorComponent, field_repeatable_component_1.RepeatableContributorComponent, field_simple_component_1.HtmlRawComponent, field_simple_component_1.HiddenValueComponent, workflow_button_component_1.WorkflowStepButtonComponent, action_button_component_1.ActionButtonComponent, field_simple_component_1.LinkValueComponent, field_simple_component_1.SelectionFieldComponent, field_textfield_component_1.RepeatableTextfieldComponent, field_relatedobjectdata_component_1.RelatedObjectDataComponent, field_group_component_1.GenericGroupComponent, field_group_component_1.RepeatableGroupComponent, field_map_component_1.MapComponent, field_simple_component_1.ParameterRetrieverComponent, record_meta_component_1.RecordMetadataRetrieverComponent, field_relatedobjectselector_component_1.RelatedObjectSelectorComponent, field_datalocation_component_1.DataLocationComponent, field_relatedfileupload_component_1.RelatedFileUploadComponent, field_publishdatalocationselector_component_1.PublishDataLocationSelectorComponent, workspace_selector_component_1.WorkspaceSelectorFieldComponent, field_simple_component_1.TabNavButtonComponent, field_simple_component_1.SpacerComponent, workspace_field_component_1.WorkspaceFieldComponent, workspace_selector_component_2.WorkspaceSelectorComponent, workspace_select_component_1.WorkspaceSelectComponent, workspace_select_component_1.WorkspaceSelectFieldComponent, field_andsvocab_component_1.ANDSVocabComponent, field_pdflist_component_1.PDFListComponent, field_asynch_component_1.AsynchComponent, field_simple_component_1.ToggleComponent, tree_node_checkbox_component_1.TreeNodeCheckboxComponent]
    })
], SharedModule);
exports.SharedModule = SharedModule;
