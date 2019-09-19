module.exports = [
  // -------------------------------------------------------------------
  // Start Tab
  // -------------------------------------------------------------------
  {
    class: "Container",
    definition: {
      id: "about",
      label: "@dataPublication-about-tab",
      active: true,
      fields: [{
          class: "ParameterRetriever",
          compClass: 'ParameterRetrieverComponent',
          definition: {
            name: 'parameterRetriever',
            parameterName: 'dataRecordOid'
          }
        },
        {
          class: 'RecordMetadataRetriever',
          compClass: 'RecordMetadataRetrieverComponent',
          definition: {
            name: 'dataRecordGetter',
            subscribe: {
              'parameterRetriever': {
                onValueUpdate: [{
                  action: 'publishMetadata'
                }]
              },
              'dataRecord': {
                relatedObjectSelected: [{
                  action: 'publishMetadata'
                }]
              }
            }
          }
        },
        {
          class: 'Container',
          compClass: 'TextBlockComponent',
          definition: {
            value: '@dataPublication-about-heading',
            type: 'h3'
          }
        },
        {
          class: 'RelatedObjectSelector',
          compClass: 'RelatedObjectSelectorComponent',
          definition: {
            label: '@dataPublication-related-record',
            name: 'dataRecord',
            help: '@dataPublication-chooseDR-help',
            recordType: 'dataRecord',
            required: true,
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'recordSelected'
            }
          ]
          }
          }
        }
      },
/*        {
          class: 'HiddenValue',
          compClass: 'HiddenValueComponent',
          definition: {
            name: 'title',
            label: '@dataPublication-title',
            help: '@dataPublication-title-help',
            type: 'text',
//            required: true,
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'title'
                }]
              }
            }
          }
        },
*/
        {
          class: 'Toggle',
          compClass: 'ToggleComponent',
          variableSubstitutionFields: ['valueCheck'],
          definition: {
            valueCheck: '@user_edupersonscopedaffiliation',
            name: 'project-hdr',
            checkedWhen: 'student@uts.edu.au',
            label: '@dataRecord-project-hdr',
            help: '@dataRecord-project-hdr-help',
            controlType: 'checkbox',
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'project-hdr'
                }]
              }
            }
          }
        },
        {
          class: 'MarkdownTextArea',
          compClass: 'MarkdownTextAreaComponent',
          definition: {
            name: 'description',
            label: '@dataPublication-description',
            help: '@dataPublication-description-help',
            type: 'text',
            required: true,
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'description'
                }]
              }
            }
          }
        },
        {
          class: 'SelectionField',
          compClass: 'DropdownFieldComponent',
          definition: {
            name: 'datatype',
            label: '@dataPublication-datatype',
            help: '@dataPublication-datatype-help',
            required: true,
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            options: [{
                value: "",
                label: "@dataPublication-dataype-select:Empty"
              },
              {
                value: "audiovisual",
                label: "@dataPublication-dataype-select:audiovisual"
              },
              {
                value: "catalogueOrIndex",
                label: "@dataPublication-dataype-select:catalogueOrIndex"
              },
              {
                value: "collection",
                label: "@dataPublication-dataype-select:collection"
              },
              {
                value: "dataPaper",
                label: "@dataPublication-dataype-select:dataPaper"
              },
              {
                value: "dataset",
                label: "@dataPublication-dataype-select:dataset"
              },
              {
                value: "event",
                label: "@dataPublication-dataype-select:event"
              },
              {
                value: "interactiveResource",
                label: "@dataPublication-dataype-select:interactiveResource"
              },
              {
                value: "image",
                label: "@dataPublication-dataype-select:image"
              },
              {
                value: "model",
                label: "@dataPublication-dataype-select:model"
              },
              {
                value: "physicalObject",
                label: "@dataPublication-dataype-select:physicalObject"
              },
              {
                value: "registry",
                label: "@dataPublication-dataype-select:registry"
              },
              {
                value: "repository",
                label: "@dataPublication-dataype-select:repository"
              },
              {
                value: "service",
                label: "@dataPublication-dataype-select:service"
              },
              {
                value: "software",
                label: "@dataPublication-dataype-select:software"
              },
              {
                value: "sound",
                label: "@dataPublication-dataype-select:sound"
              },
              {
                value: "text",
                label: "@dataPublication-dataype-select:text"
              },
              {
                value: "workflow",
                label: "@dataPublication-dataype-select:workflow"
              }
            ],
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'datatype'
                }]
              }
            }
          }
        },
        {
          class: 'RepeatableContainer',
          compClass: 'RepeatableTextfieldComponent',
          definition: {
            label: "@dataPublication-keywords",
            help: "@dataPublication-keywords-help",
            name: "finalKeywords",
            editOnly: true,
            required: true,
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            fields: [{
              class: 'TextField',
              definition: {
                type: 'text',
                required: true,
                validationMessages: {
                  required: "@dataRecord-keywords-required"
                }
              }
            }],
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'finalKeywords'
                }]
              }
            }
          }
        },
        {
          class: 'RepeatableVocab',
          compClass: 'RepeatableVocabComponent',
          definition: {
            name: 'foaf:fundedBy_foaf:Agent',
            label: "@dmpt-foaf:fundedBy_foaf:Agent",
            help: "@dmpt-foaf:fundedBy_foaf:Agent-help",
            forceClone: ['lookupService', 'completerService'],
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            fields: [{
              class: 'VocabField',
              definition: {
                disableEditAfterSelect: false,
                vocabId: 'Funding Bodies',
                sourceType: 'mint',
                fieldNames: ['dc_title', 'dc_identifier', 'ID', 'repository_name'],
                searchFields: 'dc_title',
                titleFieldArr: ['dc_title'],
                stringLabelToField: 'dc_title'
              }
            }],
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'foaf:fundedBy_foaf:Agent'
                }]
              }
            }
          }
        },
        {
          class: 'RepeatableVocab',
          compClass: 'RepeatableVocabComponent',
          definition: {
            name: 'foaf:fundedBy_vivo:Grant',
            label: "@dmpt-foaf:fundedBy_vivo:Grant",
            help: "@dmpt-foaf:fundedBy_vivo:Grant-help",
            forceClone: ['lookupService', 'completerService'],
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            fields: [{
              class: 'VocabField',
              definition: {
                disableEditAfterSelect: false,
                vocabId: 'Research Activities',
                sourceType: 'mint',
                fieldNames: ['dc_title', 'grant_number', 'foaf_name', 'dc_identifier', 'known_ids', 'repository_name'],
                searchFields: 'grant_number,dc_title',
                titleFieldArr: ['grant_number', 'repository_name', 'dc_title'],
                titleFieldDelim: [{
                    prefix: '[',
                    suffix: ']'
                  },
                  {
                    prefix: ' (',
                    suffix: ')'
                  },
                  {
                    prefix: ' ',
                    suffix: ''
                  }
                ],
                stringLabelToField: 'dc_title'
              }
            }],
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'foaf:fundedBy_vivo:Grant'
                }]
              }
            }
          }
        },
        {
          class: 'ANDSVocab',
          compClass: 'ANDSVocabComponent',
          definition: {
            label: "@dmpt-project-anzsrcFor",
            help: "@dmpt-project-anzsrcFor-help",
            name: "dc:subject_anzsrc:for",
            vocabId: 'anzsrc-for',
            disabledExpression: '<%= _.isEmpty(relatedRecordId) %>',
            subscribe: {
              'dataRecordGetter': {
                onValueUpdate: [{
                  action: 'utilityService.getPropertyFromObject',
                  field: 'dc:subject_anzsrc:for'
                }]
              }
            }
          }
        }
      ]
    }
  }
];
