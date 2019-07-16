module.exports = [
  // -------------------------------------------------------------------
  // Data Tab
  // -------------------------------------------------------------------
  {
    class: "Container",
    definition: {
      id: "data",
      label: "@dataPublication-data-tab",
      fields: [{
          class: 'Container',
          compClass: 'TextBlockComponent',
          definition: {
            value: '@dataPublication-data-heading',
            type: 'h3'
          }
        },
        {
          class: 'PublishDataLocationSelector',
          compClass: 'PublishDataLocationSelectorComponent',
          definition: {
            name: "dataLocations", // this will create another entry on form group that will contain the list of those selected
            visibilityCriteria: false, // hidden when access rights is unchecked
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            notesEnabled: false,
            iscEnabled: true,
            selectAllItems: '@dataPublication-publish-select-all',
            noLocationSelectedText: '@dataPublication-publish-metadata-no-location-selected',
            noLocationSelectedHelp: '@dataPublication-publish-metadata-only-help',
            publicCheck: 'public',
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'dataLocations'
                }]
              }
            }
          }
        },
        {
          class: 'HtmlRaw',
          compClass: 'HtmlRawComponent',
          editOnly:true,
          definition: {
            name: "dataPub-dm-prefix-0",
            value: '@dataPublication-data-manager',
            visibilityCriteria: true, // visible when access rights is checked
            subscribe: {}
          }
        },
        {
          class: 'TextField',
          definition: {
            name: 'dataLicensingAccess_manager',
            label: '@dataPublication-dataLicensingAccess_manager',
            type: 'text',
            readOnly: true,
            visibilityCriteria: true, // visible when access rights is checked
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'contributor_data_manager.text_full_name'
                }]
              }
            }
          }
        },
        {
          class: 'HtmlRaw',
          compClass: 'HtmlRawComponent',
          editOnly:true,
          definition: {
            name: "dataPub-dm-suffix-0",
            value: '@dataPublication-data_manager-transferResponsibility',
            visibilityCriteria: true, // visible when access rights is checked
            subscribe: {}
          }
        },
        {
          class: 'SelectionField',
          compClass: 'SelectionFieldComponent',
          definition: {
            name: 'dc:accessRights',
            label: '@dataPublication-dc:accessRights',
            help: '@dataPublication-dc:accessRights-help',
            defaultValue: '@dataPublication-dc:accessRights-open',
            controlType: 'radio',
            readOnly: false,
            options: [
              {
                value: "@dataPublication-dc:accessRights-open",
                label: "@dataPublication-dc:accessRights-open"
              },
              {
                value: "@dataPublication-dc:accessRights-restricted-val",
                label: "@dataPublication-dc:accessRights-restricted"
              }
            ],
            subscribe: {}
          }
        },
        {
          class: 'TextField',
          definition: {
            name: 'accessRights_url',
            label: '@dataPublication-accessRights_url',
            help: '@dataPublication-accessRights_url-help',
            type: 'text',
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>'
          }
        }
      ]
    }
  }
];
