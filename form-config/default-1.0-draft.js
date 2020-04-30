/**
 * RDMP form
 */
module.exports = {
  name: 'default-1.0-draft',
  type: 'rdmp',
  skipValidationOnSave: false,
  editCssClasses: 'row col-md-12',
  viewCssClasses: 'row col-md-offset-1 col-md-10',
  messages: {
    "saving": ["@dmpt-form-saving"],
    "validationFail": ["@dmpt-form-validation-fail-prefix", "@dmpt-form-validation-fail-suffix"],
    "saveSuccess": ["@dmpt-form-save-success"],
    "saveError": ["@dmpt-form-save-error"]
  },
  fields: [
    {
      class: 'TextField',
      definition: {
        visible: false,
        visibilityCriteria: true,
        name: 'human_participant_data',
        label: 'human_participant_data',
        publishTag: 'human_participant_data',
        type: 'text',
        publish: {
          onValueUpdate: {
            modelEventSource: 'valueChanges'
          }
        },
        subscribe: {
          'ethics_describe': {
            onItemSelect: [{
              action: 'setProp',
              valueTest: ['human_participant_data'],
              props: [
                {key: 'value', val: 'human_participant_data', clear: true}
              ]
            }]
          }
        }
      }
    },
    {
      class: 'TextField',
      definition: {
        visible: false,
        visibilityCriteria: true,
        name: 'human_participant_data_identifiable',
        label: 'human_participant_data_identifiable',
        publishTag: 'human_participant_data_identifiable',
        type: 'text',
        publish: {
          onValueUpdate: {
            modelEventSource: 'valueChanges'
          }
        },
        subscribe: {
          'ethics_identifiable': {
            onItemSelect: [{
              fieldName: 'human_participant_data_identifiable:subscribedto:ethics_describe',
              action: 'setProp',
              valueTest: ['ethics_identifiable'],
              props: [
                {key: 'value', val: 'human_participant_data_identifiable', clear: true}
              ]
            }]
          },
          'ethics_describe': {
            onItemSelect: [{
              action: 'setProp',
              valueTest: ['human_participant_data'],
              props: [
                {key: 'value', val: 'human_participant_data', clear: true}
              ]
            }]
          }
        }
      }
    },
    {
      class: 'TextField',
      definition: {
        visible: true,
        visibilityCriteria: true,
        name: 'human_participant_data_identifiable_consent',
        label: 'human_participant_data_identifiable_consent',
        publishTag: 'human_participant_data_identifiable_consent',
        type: 'text',
        publish: {
          onValueUpdate: {
            modelEventSource: 'valueChanges'
          }
        },
        subscribe: {
          'ethics_identifiable_informed_consent_publish': {
            onItemSelect: [{
              debug: 'onItemSelect:human_participant_data_identifiable_consent:subscribedto:ethics_identifiable_informed_consent_publish',
              action: 'setProp',
              setPublishedValue: true,
              props: []
            }]
          }
        }
      }
    },
    {
      class: 'TextField',
      definition: {
        visible: false,
        visibilityCriteria: true,
        name: 'ethics_third_party',
        label: 'ethics_third_party',
        publishTag: 'ethics_third_party',
        type: 'text',
        publish: {
          onValueUpdate: {
            modelEventSource: 'valueChanges'
          }
        },
        subscribe: {
          'ethics_data_secondary_third_party': {
            onItemSelect: [{
              debug: 'ethics_third_party',
              action: 'setProp',
              valueTest: ['yes'],
              props: [
                {key: 'value', val: 'ethics_third_party', val2: ''},
              ]
            }]
          }
        }
      }
    },
    {
      class: 'Container',
      compClass: 'TextBlockComponent',
      viewOnly: true,
      definition: {
        name: 'title',
        type: 'h1'
      }
    },
    {
      class: 'Container',
      compClass: 'GenericGroupComponent',
      definition: {
        cssClasses: "form-inline",
        fields: [{
            class: "AnchorOrButton",
            viewOnly: true,
            definition: {
              label: '@dmp-edit-record-link',
              value: '/@branding/@portal/record/edit/@oid',
              cssClasses: 'btn btn-large btn-info',
              showPencil: true,
              controlType: 'anchor'
            },
            variableSubstitutionFields: ['value']
          },
          {
            class: "AnchorOrButton",
            viewOnly: true,
            definition: {
              label: '@dmp-create-datarecord-link',
              value: '/@branding/@portal/record/dataRecord/edit?rdmpOid=@oid',
              cssClasses: 'btn btn-large btn-info margin-15',
              controlType: 'anchor'
            },
            variableSubstitutionFields: ['value']
          },
          {
            class: 'PDFList',
            viewOnly: true,
            definition: {
              name: 'pdf',
              label: 'pdf',
              cssClasses: 'btn btn-large btn-info margin-15'
            }
          }
        ]
      }
    },
    {
      class: 'TextArea',
      viewOnly: true,
      definition: {
        name: 'description',
        label: 'Description'
      }
    },
    {
      class: "TabOrAccordionContainer",
      compClass: "TabOrAccordionContainerComponent",
      definition: {
        id: "mainTab",
        accContainerClass: "view-accordion",
        expandAccordionsOnOpen: true,
        fields: [
          // -------------------------------------------------------------------
          // Project Tab
          // -------------------------------------------------------------------
          {
            class: "Container",
            definition: {
              id: "project",
              label: "@dmpt-project-tab",
              active: true,
              fields: [{
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-project-heading',
                    type: 'h3'
                  }
                },
                {
                  class: 'VocabField',
                  compClass: 'VocabFieldComponent',
                  definition: {
                    name: 'title',
                    label: "@dmpt-project-title",
                    help: "@dmpt-project-title-help",
                    forceClone: ['lookupService', 'completerService'],
                    disableEditAfterSelect: false,
                    disabledExpression: '<%= !_.isEmpty(oid) && (_.indexOf(user.roles, \'Admin\') == -1) %>',
                    vocabId: '\"Research Activities\"%20AND%20(text_status:(%22Completed%22%20OR%20%22Applied%22%20OR%20%22Approved%22%20OR%20%22Closed%20Off%22%20OR%20%22Combined%22%20OR%20%22Transferred%22))',
                    sourceType: 'mint',
                    fieldNames: ['dc_title', 'folio', 'description', 'summary', 'refId', 'keyword', 'startDate', 'endDate', 'organization', 'fundingSource', 'rmId'],
                    searchFields: 'autocomplete_title',
                    titleFieldArr: ['dc_title'],
                    stringLabelToField: 'dc_title',
                    storeLabelOnly: true,
                    publish: {},
                    required: true
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    name: 'dc:identifier',
                    label: '@dmpt-project-id',
                    help: '@dmpt-project-id-help',
                    type: 'text',
                    required: true,
                    subscribe: {
                      title: {
                        onItemSelect: [{
                            action: 'reset'
                          },
                          {
                            action: 'utilityService.getFirstofArray',
                            field: 'rmId'
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  class: 'Toggle',
                  compClass: 'ToggleComponent',
                  variableSubstitutionFields: ['valueCheck'],
                  definition: {
                    valueCheck: '@user_edupersonscopedaffiliation',
                    name: 'project-hdr',
                    checkedWhen: 'student@uts.edu.au',
                    label: '@dmpt-project-hdr',
                    help: '@dmpt-project-hdr-help',
                    controlType: 'checkbox'
                  }
                },
                {
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',
                  definition: {
                    name: 'description',
                    label: '@dmpt-project-desc',
                    help: '@dmpt-project-desc-help',
                    rows: 10,
                    cols: 10,
                    required: true,
                    subscribe: {
                      title: {
                        onItemSelect: [{
                            action: 'reset'
                          },
                          {
                            action: 'utilityService.concatenate',
                            fields: [
                              'description',
                              'summary'
                            ],
                            delim: ' '
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    type: 'hr'
                  }
                },
                {
                  class: 'RepeatableContainer',
                  compClass: 'RepeatableTextfieldComponent',
                  definition: {
                    label: '@dmpt-finalKeywords',
                    help: '@dmpt-finalKeywords-help',
                    name: 'finalKeywords',
                    fields: [{
                      class: 'TextField',
                      definition: {
                        required: false,
                        type: 'text',
                        validationMessages: {
                          required: "@dataRecord-keywords-required"
                        }
                      }
                    }],
                    subscribe: {
                      title: {
                        onItemSelect: [{
                            action: 'reset'
                          },
                          {
                            action: 'utilityService.splitArrayStringsToArray',
                            field: 'keyword',
                            regex: ',|;',
                            flags: 'i'
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  /* hide the website field
                  class: 'TextField',
                  */
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    name: 'dc:relation_bibo:Website',
                    label: '@dmpt-project-website',
                    help: '@dmpt-project-website-help',
                    type: 'text'
                  }
                },
                {
                  class: 'DateTime',
                  definition: {
                    name: "dc:coverage_vivo:DateTimeInterval_vivo:start",
                    label: "@dmpt-project-startdate",
                    help: '@dmpt-project-startdate-help',
                    datePickerOpts: {
                      format: 'dd/mm/yyyy',
                      startView: 2,
                      icon: 'fa fa-calendar',
                      autoclose: true
                    },
                    timePickerOpts: false,
                    hasClearButton: false,
                    valueFormat: 'YYYY-MM-DD',
                    displayFormat: 'DD/MM/YYYY',
                    publish: {
                      onValueUpdate: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      title: {
                        onItemSelect: [
                          {
                            action: 'reset'
                          },
                          {
                            action: 'utilityService.convertToDateFormat',
                            field: 'startDate',
                            delim: ',',
                            formatOrigin: 'DD-MMM-YY',
                            formatTarget: 'YYYY-MM-DD'
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  class: 'DateTime',
                  definition: {
                    name: "dc:coverage_vivo:DateTimeInterval_vivo:end",
                    label: "@dmpt-project-enddate",
                    help: '@dmpt-project-enddate-help',
                    datePickerOpts: {
                      format: 'dd/mm/yyyy',
                      startView: 2,
                      icon: 'fa fa-calendar',
                      autoclose: true
                    },
                    timePickerOpts: false,
                    hasClearButton: false,
                    valueFormat: 'YYYY-MM-DD',
                    displayFormat: 'DD/MM/YYYY',
                    subscribe: {
                      'dc:coverage_vivo:DateTimeInterval_vivo:start': {
                        onValueUpdate: []
                      },
                      title: {
                        onItemSelect: [
                          {
                            action: 'reset'
                          },
                          {
                            action: 'utilityService.convertToDateFormat',
                            field: 'endDate',
                            delim: ',',
                            formatOrigin: 'DD-MMM-YY',
                            formatTarget: 'YYYY-MM-DD'
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  class: 'RepeatableContainer',
                  compClass: 'RepeatableVocabComponent',
                  definition: {
                    name: 'foaf:fundedBy_foaf:Agent',
                    label: "@dmpt-foaf:fundedBy_foaf:Agent",
                    help: "@dmpt-foaf:fundedBy_foaf:Agent-help",
                    forceClone: ['lookupService', 'completerService'],
                    fields: [{
                      class: 'VocabField',
                      definition: {
                        disableEditAfterSelect: false,
                        vocabId: '\"Funding Bodies\"',
                        sourceType: 'mint',
                        fieldNames: ['dc_title', 'dc_identifier', 'ID', 'repository_name'],
                        searchFields: 'dc_title',
                        titleFieldArr: ['dc_title'],
                        stringLabelToField: 'dc_title'
                      }
                    }]
                  }
                },
                {
                  class: 'RepeatableVocab',
                  compClass: 'RepeatableVocabComponent',
                  definition: {
                    name: 'foaf:fundedBy_vivo:Grant',
                    label: '@dmpt-foaf:fundedBy_vivo:Grant',
                    help: '@dmpt-foaf:fundedBy_vivo:Grant-help',
                    forceClone: ['lookupService', 'completerService'],
                    fields: [{
                      class: 'VocabField',
                      definition: {
                        disableEditAfterSelect: false,
                        vocabId: '\"Research Activities\"',
                        sourceType: 'mint',
                        fieldNames: ['dc_title', 'grant_number', 'foaf_name', 'dc_identifier', 'known_ids', 'repository_name'],
                        searchFields: 'grant_number,dc_title',
                        titleFieldArr: ['grant_number', 'dc_title'],
                        stringLabelToField: 'dc_title'
                      }
                    }],
                    publish: {
                      onValueUpdate: {
                        modelEventSource: 'valueChanges',
                        fields: [{
                            'grant_number': 'grant_number[0]'
                          },
                          {
                            'dc_title': 'dc_title'
                          }
                        ]
                      }
                    }
                  }
                },
                {
                  // hide the FOR codes https://synergy.itd.uts.edu.au/jira/browse/ST-634
                  // class: 'ANDSVocab',
                  // compClass: 'ANDSVocabComponent',
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    visible: false,
                    label: "@dmpt-project-anzsrcFor",
                    help: "@dmpt-project-anzsrcFor-help",
                    name: "dc:subject_anzsrc:for",
                    vocabId: 'anzsrc-for'
                  }
                },
                {
                  /* hide the SEO field
                  class: 'ANDSVocab',
                  compClass: 'ANDSVocabComponent',*/
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    label: "@dmpt-project-anzsrcSeo",
                    help: "@dmpt-project-anzsrcSeo-help",
                    name: "dc:subject_anzsrc:seo",
                    vocabId: 'anzsrc-seo'
                  }
                }
              ]
            }
          },
          // -------------------------------------------------------------------
          // People Tab
          // -------------------------------------------------------------------
          {
            class: "Container",
            definition: {
              id: "people",
              label: "@dmpt-people-tab",
              fields: [{
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-people-tab',
                    type: 'h3'
                  }
                },
                {
                  class: 'ContributorField',
                  showHeader: true,
                  showRole: false,
                  definition: {
                    name: 'contributor_ci',
                    required: true,
                    label: '@dmpt-people-tab-ci',
                    help: '@dmpt-people-tab-ci-help',
                    role: "@dmpt-people-tab-ci-role",
                    freeText: false,
                    forceLookupOnly: true,
                    vocabId: 'Parties AND repository_name:People%20AND%20(*%3A*%20-text_has_appointment:NULL)',
                    sourceType: 'mint',
                    disabledExpression: '<%= !_.isEmpty(oid) %>',
                    fieldNames: [{
                        'text_full_name': 'text_full_name'
                      }, {
                        'full_name_honorific': 'text_full_name_honorific'
                      }, {
                        'email': 'Email[0]'
                      },
                      {
                        'given_name': 'Given_Name[0]'
                      },
                      {
                        'family_name': 'Family_Name[0]'
                      },
                      {
                        'honorific': 'Honorific[0]'
                      },
                      {
                        'full_name_family_name_first': 'dc_title'
                      }
                    ],
                    searchFields: 'autocomplete_given_name,autocomplete_family_name,autocomplete_full_name',
                    titleFieldArr: ['text_full_name'],
                    titleFieldDelim: '',
                    titleCompleterDescription: 'Email',
                    nameColHdr: '@dmpt-people-tab-name-hdr',
                    emailColHdr: '@dmpt-people-tab-email-hdr',
                    orcidColHdr: '@dmpt-people-tab-orcid-hdr',
                    validation_required_name: '@dmpt-people-tab-validation-name-required',
                    validation_required_email: '@dmpt-people-tab-validation-email-required',
                    validation_invalid_email: '@dmpt-people-tab-validation-email-invalid',
                    publish: {
                      onValueUpdate: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    findRelationshipFor: ['student@uts.edu.au'],
                    findRelationship: {
                      relationship: 'dc_supervisor',
                      relateWith: 'userEmail',
                      role: 'Chief Investigator',
                      searchField: 'Email',
                      searchRelation: 'dc_utsId',
                      title: 'text_full_name',
                      fullNameHonorific: 'text_full_name_honorific',
                      honorific: 'honorific',
                      email: 'dc_email',
                      givenName: 'text_given_name',
                      familyName: 'text_family_name'
                    },
                    userEmail: '@user_email',
                    relationshipFor: '@user_edupersonscopedaffiliation',
                  },
                  variableSubstitutionFields: ['userEmail', 'relationshipFor']
                },
                {
                  class: 'ContributorField',
                  showHeader: true,
                  definition: {
                    name: 'contributor_data_manager',
                    required: true,
                    label: '@dmpt-people-tab-data-manager',
                    help: '@dmpt-people-tab-data-manager-help',
                    role: "@dmpt-people-tab-data-manager-role",
                    freeText: false,
                    vocabId: 'Parties AND repository_name:People%20AND%20(*%3A*%20-text_has_appointment:NULL)',
                    sourceType: 'mint',
                    disabledExpression: '<%= !_.isEmpty(oid) %>',
                    fieldNames: [{
                        'text_full_name': 'text_full_name'
                      }, {
                        'full_name_honorific': 'text_full_name_honorific'
                      }, {
                        'email': 'Email[0]'
                      },
                      {
                        'given_name': 'Given_Name[0]'
                      },
                      {
                        'family_name': 'Family_Name[0]'
                      },
                      {
                        'honorific': 'Honorific[0]'
                      },
                      {
                        'full_name_family_name_first': 'dc_title'
                      }
                    ],
                    searchFields: 'autocomplete_given_name,autocomplete_family_name,autocomplete_full_name',
                    titleFieldArr: ['text_full_name'],
                    titleFieldDelim: '',
                    titleCompleterDescription: 'Email',
                    nameColHdr: '@dmpt-people-tab-name-hdr',
                    emailColHdr: '@dmpt-people-tab-email-hdr',
                    orcidColHdr: '@dmpt-people-tab-orcid-hdr',
                    showRole: false,
                    publish: {
                      onValueUpdate: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    value: {
                      name: '@user_name',
                      email: '@user_email',
                      username: '@user_username',
                      text_full_name: '@user_name'
                    }
                  },
                  variableSubstitutionFields: ['value.name', 'value.email', 'value.username', 'value.text_full_name']
                },
                {
                  class: 'RepeatableContributor',
                  compClass: 'RepeatableContributorComponent',
                  definition: {
                    name: "contributors",
                    skipClone: ['showHeader', 'initialValue'],
                    forceClone: [{
                      field: 'vocabField',
                      skipClone: ['injector']
                    }],
                    fields: [{
                      class: 'ContributorField',
                      showHeader: true,
                      definition: {
                        required: false,
                        label: '@dmpt-people-tab-contributors',
                        help: '@dmpt-people-tab-contributors-help',
                        role: "@dmpt-people-tab-contributors-role",
                        freeText: false,
                        vocabId: 'Parties AND repository_name:People%20AND%20(*%3A*%20-text_has_appointment:NULL)',
                        sourceType: 'mint',
                        fieldNames: [{
                            'text_full_name': 'text_full_name'
                          }, {
                            'full_name_honorific': 'text_full_name_honorific'
                          }, {
                            'email': 'Email[0]'
                          },
                          {
                            'given_name': 'Given_Name[0]'
                          },
                          {
                            'family_name': 'Family_Name[0]'
                          },
                          {
                            'honorific': 'Honorific[0]'
                          },
                          {
                            'full_name_family_name_first': 'dc_title'
                          }
                        ],
                        searchFields: 'autocomplete_given_name,autocomplete_family_name,autocomplete_full_name',
                        titleFieldArr: ['text_full_name'],
                        titleFieldDelim: '',
                        titleCompleterDescription: 'Email',
                        nameColHdr: '@dmpt-people-tab-name-hdr',
                        emailColHdr: '@dmpt-people-tab-email-hdr',
                        orcidColHdr: '@dmpt-people-tab-orcid-hdr',
                        showRole: false,
                        activeValidators: {}
                      }
                    }]
                  }
                },
                {
                  class: 'RepeatableContributor',
                  compClass: 'RepeatableContributorComponent',
                  definition: {
                    name: "contributor_supervisors",
                    skipClone: ['showHeader', 'initialValue'],
                    forceClone: [{
                      field: 'vocabField',
                      skipClone: ['injector']
                    }],
                    fields: [{
                      class: 'ContributorField',
                      showHeader: true,
                      definition: {
                        required: false,
                        label: '@dmpt-people-tab-supervisor',
                        help: '@dmpt-people-tab-supervisor-help',
                        role: "@dmpt-people-tab-supervisor-role",
                        freeText: false,
                        vocabId: 'Parties AND repository_name:People%20AND%20(*%3A*%20-text_has_appointment:NULL)',
                        sourceType: 'mint',
                        fieldNames: [{
                            'text_full_name': 'text_full_name'
                          }, {
                            'full_name_honorific': 'text_full_name_honorific'
                          }, {
                            'email': 'Email[0]'
                          },
                          {
                            'given_name': 'Given_Name[0]'
                          },
                          {
                            'family_name': 'Family_Name[0]'
                          },
                          {
                            'honorific': 'Honorific[0]'
                          },
                          {
                            'full_name_family_name_first': 'dc_title'
                          }
                        ],
                        searchFields: 'autocomplete_given_name,autocomplete_family_name,autocomplete_full_name',
                        titleFieldArr: ['text_full_name'],
                        titleFieldDelim: '',
                        titleCompleterDescription: 'Email',
                        nameColHdr: '@dmpt-people-tab-name-hdr',
                        emailColHdr: '@dmpt-people-tab-email-hdr',
                        orcidColHdr: '@dmpt-people-tab-orcid-hdr',
                        showRole: false,
                        publish: {
                          onValueUpdate: {
                            modelEventSource: 'valueChanges'
                          }
                        }
                      }
                    }]
                  }
                }
              ]
            }
          },
          // -------------------------------------------------------------------
          // New
          // Ethics Tab
          // -------------------------------------------------------------------
          {
            class: "Container",
            definition: {
              id: "new-ethics",
              label: "@dmpt-ethics-tab",
              fields: [{
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-ethics-heading',
                    type: 'h3'
                  }
                },
                {
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  visible: true,
                  definition: {
                    value: '@dmpt-ethics:iscs:initial',
                    type: 'h5'
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    name: 'ethics_iscs',
                    value: '@dmpt-ethics:iscs:initial',
                    help: '@dmpt-ethics:iscs:initial:help',
                    type: 'p',
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    editable: false,
                    readOnly: true,
                    visible: true,
                    visibilityCriteria: true,
                    name: 'dmpt_ethics_iscs',
                    label: '@dmpt-ethics:iscs',
                    help: '@dmpt-ethics:iscs:help',
                    publishTag: 'dmpt_ethics_iscs',
                    type: 'text',
                    value: '@dmpt-ethics:iscs:sensitive',
                    publish: {
                      onValueUpdate: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      // 'ethics_sensitive_data': {
                      //   onItemSelect: [{
                      //     fieldName: 'dmpt_ethics_iscs:subscribedto:ethics_sensitive_data',
                      //     action: 'setProp',
                      //     valueTest: ['iscs_confidential'],
                      //     props: [
                      //       {key: 'value', val: '@dmpt-ethics:iscs:confidential', val2: '@dmpt-ethics:iscs:sensitive'},
                      //     ]
                      //   }]
                      // },
                      // 'ethics_describe': {
                      //   onItemSelect: [{
                      //     fieldName: 'dmpt_ethics_iscs:subscribedto:ethics_describe',
                      //     action: 'setProp',
                      //     valueTest: ['ethics_describe'],
                      //     props: [
                      //       {key: 'value', val: 'ethics_describe', val2: ''},
                      //     ]
                      //   }]
                      // },
                      // 'ethics_approval_type': {
                      //   onValueUpdate: [{
                      //     fieldName: 'dmpt_ethics_iscs:subscribedto:ethics_approval_type',
                      //     action: 'setProp',
                      //     valueTest: ['committee', 'iscs_confidential'],
                      //     props: [
                      //       {key: 'value', val: '@dmpt-ethics:iscs:confidential', val2: ''}
                      //     ]
                      //   }]
                      // }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    required: false,
                    name: 'ethics_describe',
                    label: '@dmpt-ethics:describe',
                    help: '@dmpt-ethics:describe:help',
                    controlType: 'checkbox',
                    options: [{
                        value: "human_participant_data",
                        label: "@dmpt-ethics:describe:human_participant_data",
                        publishTag: "human_participant_data"
                      },{
                        value: "animal_use",
                        label: "@dmpt-ethics:describe:animal_use",
                        publishTag: "ethics_approval_required"
                      },
                      {
                        value: "gmos",
                        label: "@dmpt-ethics:describe:gmos",
                        publishTag: "ethics_approval_required"
                      },
                      {
                        value: "infectious_materials_pathogens_cytotoxic_substances",
                        label: "@dmpt-ethics:describe:infectious_materials_pathogens_cytotoxic_substances",
                        publishTag: "ethics_approval_required"
                      },
                      {
                        value: "ionizing_radiation",
                        label: "@dmpt-ethics:describe:ionizing_radiation",
                        publishTag: "ethics_approval_required"
                      },
                      {
                        value: "clinical_trials",
                        label: "@dmpt-ethics:describe:clinical_trials",
                        publishTag: "ethics_approval_required"
                      },
                      {
                        value: "commercially_sensitive_data",
                        label: "@dmpt-ethics:describe:commercially_sensitive_data",
                        publishTag: ""
                      },
                      {
                        value: "policed_data",
                        label: "@dmpt-ethics:describe:policed_data",
                        publishTag: ""
                      },
                      {
                        value: "indigenous_cultural_intelectual_property",
                        label: "@dmpt-ethics:describe:indigenous_cultural_intelectual_property",
                        publishTag: ""
                      },
                      {
                        value: "other_sensitive",
                        label: "@dmpt-ethics:describe:other_sensitive",
                        publishTag: ""
                      },
                      {
                        value: "none",
                        label: "@dmpt-ethics:describe:none",
                        publishTag: ""
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      },
                      onValueUpdate: {
                        modelEventSource: 'valueChanges'
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    required: true,
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_human_participant_data_individual',
                    label: '@dmpt-ethics:human_participant_data:individual',
                    help: '@dmpt-ethics:human_participant_data:individual:help',
                    controlType: 'radio',
                    options: [{
                        value: "personal",
                        label: "@dmpt-ethics:human_participant_data:personal"
                      },
                      {
                        value: "sensitive_personal",
                        label: "@dmpt-ethics:human_participant_data:sensitive_personal",
                        publishTag: "iscs_confidential"
                      },
                      {
                        value: "health",
                        label: "@dmpt-ethics:human_participant_data:health",
                        publishTag: "iscs_sensitive"
                      }
                    ],
                    subscribe: {
                      'human_participant_data': {
                        onValueUpdate: [{
                          debug: 'onValueUpdate:ethics_human_participant_data_individuals:subscribedto:human_participant_data',
                          action: 'setProp',
                          valueTest: ['human_participant_data'],
                          props: [
                            {key: 'visible', val: true},
                            {key: 'required', val: true},
                            {key: 'value', val: ''}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'Toggle',
                  compClass: 'ToggleComponent',
                  variableSubstitutionFields: ['valueCheck'],
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    valueCheck: '@user_edupersonscopedaffiliation',
                    name: 'ethics_identifiable',
                    checkedWhen: 'student@uts.edu.au',
                    label: '@dmpt-ethics:identifiable',
                    help: '@dmpt-ethics:identifiable:help',
                    controlType: 'checkbox',
                    publishTag: 'ethics_identifiable',
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      'human_participant_data': {
                        onValueUpdate: [{
                          debug: 'onValueUpdate:ethics_identifiable:subscribedto:human_participant_data',
                          action: 'setProp',
                          valueTest: ['human_participant_data'],
                          props: [
                            {key: 'visible', val: true, val2: false},
                            {key: 'required', val: true, val2: false},
                            {key: 'value', val: '', val2: ''}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                  visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_human_participant_data_severity_risk',
                    label: '@dmpt-ethics:human_participant_data:severity_risk',
                    help: '@ethics:human-participant-data:severity_risk:help',
                    type: 'text',
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'onValueUpdate:ethics_human_participant_data_severity_risk:subscribedto:human_participant_data_identifiable',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_other_countries',
                    label: '@dmpt-ethics:identifiable:other_countries',
                    help: '@dmpt-ethics:identifiable:other_countries:help',
                    type: 'text',
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'onValueUpdate:ethics_identifiable_other_countries:subscribedto:human_participant_data_identifiable',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    required: true,
                    name: 'ethics_approval',
                    label: '@dmpt-ethics:approval',
                    help: '@dmpt-ethics:approval:help',
                    controlType: 'radio',
                    options: [{
                        value: "yes",
                        label: "Yes",
                        publishTag: "ethics_approval"
                      },
                      {
                        value: "no",
                        label: "No",
                        publishTag: "ethics_approval"
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      'ethics_describe': {
                        onValueUpdate: [{
                          fieldName: 'ethics_approval:subscribedto:ethics_describe',
                          debug: 'ethics_approval:subscribedto:ethics_describe',
                          action: 'setProp',
                          valueTest: [
                            'human_participant_data', 'ethics_approval_required'
                          ],
                          props: [
                            {key: 'value', val: 'yes', val2: 'no', keepIfYes: true}
                          ]
                        }]
                      }
                    }
                  }
                }
              ]
            }
          },
          // -------------------------------------------------------------------
          // New Data Collection and Storage Tab
          // ---------
          {
            class: "Container",
            definition: {
              id: "dataCollection",
              label: "@dmpt-data-collection-tab",
              fields: [{
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-data-collection-heading',
                    type: 'h3'
                  }
                },
                {
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',
                  definition: {
                    name: 'vivo:Dataset_redbox:DataCollectionMethodology',
                    label: '@dmpt-data-collection-methodology',
                    help: '@dmpt-data-collection-methodology-help',
                    rows: 5,
                    columns: 10,
                    required: true,
                    validationMessages: {
                      required: "@dmpt-data-collection-methodology-required"
                    }
                  }
                },
                {
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',
                  definition: {
                    name: 'vivo:Dataset_dc_format',
                    label: '@dmpt-vivo:Dataset_dc_format',
                    help: '@dmpt-vivo:Dataset_dc_format-help',
                    rows: 5,
                    columns: 10,
                    required: true,
                    validationMessages: {
                      required: "@dmpt-vivo:Dataset_dc_format-required"
                    }
                  }
                },
                {
                  /* hide this field
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',*/
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    name: 'vivo:Dataset_redbox:DataCollectionResources',
                    label: '@dmpt-vivo:Dataset_redbox:DataCollectionResources',
                    help: '@dmpt-vivo:Dataset_redbox:DataCollectionResources-help',
                    rows: 5,
                    columns: 10
                  }
                },
                {
                  /* hide this field
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',*/
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    name: 'vivo:Dataset_redbox:DataAnalysisResources',
                    label: '@dmpt-vivo:Dataset_redbox:DataAnalysisResources',
                    help: '@dmpt-vivo:Dataset_redbox:DataAnalysisResources-help',
                    rows: 5,
                    columns: 10
                  }
                },
                {
                  /* hide this field
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',*/
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    name: 'vivo:Dataset_redbox:MetadataStandard',
                    label: '@dmpt-vivo:Dataset_redbox:MetadataStandard',
                    help: '@dmpt-vivo:Dataset_redbox:MetadataStandard-help',
                    rows: 5,
                    columns: 10
                  }
                },
                {
                  /* hide this field
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',*/
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    name: 'vivo:Dataset_redbox:DataStructureStandard',
                    label: '@dmpt-vivo:Dataset_redbox:DataStructureStandard',
                    help: '@dmpt-vivo:Dataset_redbox:DataStructureStandard-help',
                    rows: 5,
                    columns: 10
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'ethics_identifiable_data',
                      field: 'human_participant_data_identifiable',
                      fieldValue : 'human_participant_data_identifiable'
                    },
                    name: 'ethics_identifiable_data',
                    label: '@dmpt-ethics:identifiable:data',
                    help: '@dmpt-ethics:identifiable:data:help',
                    type: 'text',
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'ethics_identifiable_data',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_collection',
                    label: '@dmpt-ethics:identifiable:collection',
                    help: '@dmpt-ethics:identifiable:informed_consent:collection:help',
                    controlType: 'checkbox',
                    options: [{
                        value: "eresearch_store",
                        label: "eResearch Store"
                      },
                      {
                        value: "onedrive",
                        label: "OneDrive"
                      },
                      {
                        value: "redcap",
                        label: "RedCap"
                      },
                      {
                        value: "qualtrics",
                        label: "Qualtrics"
                      },
                      {
                        value: "others",
                        label: "Others",
                        publishTag: 'ethics_identifiable_collection_others'
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'ethics_identifiable_informed_consent_no_collection',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_collection_other',
                    label: 'Plese specify other means of collection',
                    type: 'text',
                    subscribe: {
                      'ethics_identifiable_collection': {
                        onItemSelect: [{
                          debug: 'onItemSelect:ethics_identifiable_informed_consent_no_collection_other:subscribedto:ethics_identifiable_collection_others',
                          action: 'setProp',
                          valueTest: ['ethics_identifiable_collection_others'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_storage',
                    label: '@dmpt-ethics:identifiable:storage',
                    help: '@dmpt-ethics:identifiable:storage:help',
                    controlType: 'checkbox',
                    options: [{
                        value: "eresearch_store",
                        label: "eResearch Store"
                      },
                      {
                        value: "onedrive",
                        label: "OneDrive"
                      },
                      {
                        value: "redcap",
                        label: "RedCap"
                      },
                      {
                        value: "other",
                        label: "Other",
                        publishTag: 'ethics_identifiable_storage_other'
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'ethics_identifiable_informed_consent_no_collection',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_storage_other',
                    label: 'Plese specify other means of storage',
                    type: 'text',
                    subscribe: {
                      'ethics_identifiable_storage': {
                        onItemSelect: [{
                          debug: 'ethics_identifiable_storage_other',
                          action: 'setProp',
                          valueTest: ['ethics_identifiable_storage_other'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'ethics_identifiable_informed_consent_publish',
                      field: 'human_participant_data_identifiable',
                      fieldValue : 'human_participant_data_identifiable'
                    },
                    name: 'ethics_identifiable_informed_consent_publish',
                    label: '@dmpt-ethics:identifiable:informed_consent:publish',
                    help: '@dmpt-ethics:identifiable:informed_consent:publish:help',
                    controlType: 'radio',
                    options: [{
                        value: "yes",
                        label: "Yes",
                        publishTag: 'human_participant_data_identifiable_open_consent'
                      },
                      {
                        value: "no",
                        label: "No",
                        publishTag: 'human_participant_data_identifiable_informed_consent',
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          debug: 'ethics_identifiable_informed_consent_publish:subscribedto:human_participant_data_identifiable',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'ethics_identifiable_additional_security',
                      field: 'human_participant_data_identifiable_consent',
                      fieldValue : 'human_participant_data_identifiable_informed_consent'
                    },
                    name: 'ethics_identifiable_additional_security',
                    label: '@dmpt-ethics:identifiable:additional_security',
                    help: '@dmpt-ethics:identifiable:additional_security:help',
                    controlType: 'radio',
                    options: [{
                        value: "physical lock",
                        label: "physical lock",
                        publishTag: 'ethics_identifiable_additional_security'
                      },
                      {
                        value: "encryption",
                        label: "encryption"
                      },
                      {
                        value: "additional password (other than authentication)",
                        label: "additional password (other than authentication)"
                      }
                    ],
                    subscribe: {
                      'human_participant_data_identifiable_consent': {
                        onValueUpdate: [{
                          debug: 'onValueUpdate:ethics_identifiable_additional_security:subscribedto:human_participant_data_identifiable_consent',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable_informed_consent'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'ethics_identifiable_transfered',
                      field: 'human_participant_data_identifiable',
                      fieldValue : 'human_participant_data_identifiable'
                    },
                    name: 'ethics_identifiable_transfered_out',
                    label: '@dmpt-ethics:identifiable:transfered_out',
                    help: '@dmpt-ethics:identifiable:transfered_out:help',
                    controlType: 'radio',
                    options: [{
                        value: "yes",
                        label: "Yes",
                        publishTag: 'ethics_identifiable_transfered_yes'
                      },
                      {
                        value: "no",
                        label: "No",
                        publishTag: 'ethics_identifiable_transfered_no'
                      }
                    ],
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'ethics_identifiable_transfered',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'ethics_identifiable_transfered_out',
                      field: 'human_participant_data_identifiable',
                      fieldValue : 'human_participant_data_identifiable'
                    },
                    name: 'ethics_identifiable_transfered_out',
                    label: '@dmpt-ethics:identifiable:transfered_out',
                    help: '@dmpt-ethics:identifiable:transfered_out:help',
                    controlType: 'radio',
                    options: [{
                        value: "yes",
                        label: "Yes",
                        publishTag: 'ethics_identifiable_transfered_out'
                      },
                      {
                        value: "no",
                        label: "No",
                        publishTag: 'ethics_identifiable_transfered_out'
                      },
                      {
                        value: "additional password (other than authentication)",
                        label: "additional password (other than authentication)",
                        publishTag: 'ethics_identifiable_transfered_out'
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'ethics_identifiable_transfered_out',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_transfered_out_yes',
                    label: '@dmpt-ethics:identifiable:transfered_out:yes',
                    type: 'text',
                    subscribe: {
                      'ethics_identifiable_transfered_out': {
                        onItemSelect: [{
                          fieldName: 'ethics_identifiable_transfered_out_yes',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'dmpt_ethics_dc_access_rights_share_data_de_identify',
                      field: 'human_participant_data_identifiable',
                      fieldValue : 'human_participant_data_identifiable'
                    },
                    name: 'dmpt_ethics_dc_access_rights_share_data_de_identify',
                    label: '@dmpt-dc:accessRights:share_data:data_de_identify',
                    type: 'text',
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'dmpt_ethics_dc_access_rights_share_data_de_identify',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true}
                          ]
                        }]
                      }
                    }
                  }
                },
                //Removed it since it is in the same tab// {
                //   class: 'Container',
                //   compClass: 'TextBlockComponent',
                //   visible: true,
                //   visibilityCriteria: {
                //     type: 'function',
                //     action: 'updateVisibility',
                //     debug: 'ethics_identifiable_de_identify_non_personal_stored_on_workspaces',
                //     field: 'human_participant_data',
                //     fieldValue : 'human_participant_data'
                //   },
                //   definition: {
                //     value: '@dmpt-ethics:identifiable:de_identify_non_personal:stored_on_workspaces',
                //     type: 'h5'
                //   }
                // }
              ]
            }
          },
          // -------------------------------------------------------------------
          // New Retention and disposal Tab
          // -------------------------------------------------------------------
          {
            class: "Container",
            definition: {
              id: "retention",
              label: "@dmpt-retention-tab",
              fields: [{
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-retention-heading',
                    type: 'h3'
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'DropdownFieldComponent',
                  definition: {
                    name: 'redbox:retentionPeriod_dc:date',
                    label: '@dmpt-redbox:retentionPeriod_dc:date',
                    help: '@dmpt-redbox:retentionPeriod_dc:date-help',
                    options: [{
                        value: "",
                        label: "@dmpt-select:Empty"
                      },
                      {
                        value: "1year",
                        label: "@dmpt-redbox:retentionPeriod_dc:date-1year"
                      },
                      {
                        value: "5years",
                        label: "@dmpt-redbox:retentionPeriod_dc:date-5years"
                      },
                      {
                        value: "7years",
                        label: "@dmpt-redbox:retentionPeriod_dc:date-7years"
                      },
                      {
                        value: "25years",
                        label: "@dmpt-redbox:retentionPeriod_dc:date-25years"
                      },
                      {
                        value: "permanent",
                        label: "@dmpt-redbox:retentionPeriod_dc:date-permanent"
                      }
                    ],
                    required: true,
                    validationMessages: {
                      required: "@dmpt-redbox:retentionPeriod_dc:date-required"
                    }
                  }
                },
                {
                  /* hide this field
                  class: 'SelectionField',
                  compClass: 'DropdownFieldComponent',*/
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    name: 'redbox:retentionPeriod_dc:date_skos:note',
                    label: '@dmpt-redbox:retentionPeriod_dc:date_skos:note',
                    options: [{
                        value: "",
                        label: "@dmpt-select:Empty"
                      },
                      {
                        value: "heritage",
                        label: "@dmpt-redbox:retentionPeriod_dc:date_skos:note-heritage"
                      },
                      {
                        value: "controversial",
                        label: "@dmpt-redbox:retentionPeriod_dc:date_skos:note-controversial"
                      },
                      {
                        value: "ofinterest",
                        label: "@dmpt-redbox:retentionPeriod_dc:date_skos:note-ofinterest"
                      },
                      {
                        value: "costly_impossible",
                        label: "@dmpt-redbox:retentionPeriod_dc:date_skos:note-costly_impossible"
                      },
                      {
                        value: "commercial",
                        label: "@dmpt-redbox:retentionPeriod_dc:date_skos:note-commercial"
                      }
                    ]
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    name: 'dataowner_name',
                    label: '@dmpt-dataRetention_data_owner',
                    help: '@dmpt-dataRetention_data_owner:help',
                    type: 'text',
                    readOnly: true,
                    subscribe: {
                      'contributor_ci': {
                        onValueUpdate: [{
                          action: 'utilityService.concatenate',
                          fields: ['text_full_name'],
                          delim: ''
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'HiddenValue',
                  compClass: 'HiddenValueComponent',
                  definition: {
                    name: 'dataowner_email',
                    subscribe: {
                      'contributor_ci': {
                        onValueUpdate: [{
                          action: 'utilityService.concatenate',
                          fields: ['email'],
                          delim: ''
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: true,
                    required: true,
                    name: 'ethics_data_destroy_after_retention',
                    label: '@dmpt-ethics:data:destroy_after_retention',
                    help: '@dmpt-ethics:identifiable:destroy_after_retention:help',
                    defaultValue: 'no',
                    controlType: 'radio',
                    options: [{
                        value: "yes",
                        label: "Yes",
                        publishTag: 'ethics_data_destroy_after_retention'
                      },
                      {
                        value: "no",
                        label: "No",
                        publishTag: 'ethics_data_destroy_after_retention',
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_destroy_after_retention_what',
                    label: '@dmpt-ethics:data:destroy_after_retention:what',
                    type: 'text',
                    subscribe: {
                      'ethics_data_destroy_after_retention': {
                        onItemSelect: [{
                          fieldName: 'ethics_data_destroy_after_retention_what',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                            {key: 'required', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_destroy_after_retention_when',
                    label: '@dmpt-ethics:data:destroy_after_retention:when',
                    type: 'text',
                    subscribe: {
                      'ethics_data_destroy_after_retention': {
                        onItemSelect: [{
                          fieldName: 'ethics_data_destroy_after_retention_when',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                            {key: 'required', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'dmpt_ethics_dc_access_rights_share_data',
                      field: 'human_participant_data_identifiable',
                      fieldValue : 'human_participant_data_identifiable'
                    },
                    name: 'dmpt_ethics_dc_access_rights_share_data',
                    label: '@dmpt-dc:accessRights:share_data',
                    type: 'text',
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          debug: 'onValueUpdate:dmpt_ethics_dc_access_rights_share_data:subscribedto:human_participant_data_identifiable',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    required: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'dmpt_ethics_dc_access_rights_share_data',
                      field: 'human_participant_data_identifiable_informed_consent',
                      fieldValue : 'human_participant_data_identifiable_informed_consent'
                    },
                    name: 'dmpt_ethics_dc_access_rights_data_retained_secondary',
                    label: '@dmpt-dc:accessRights:data_retained_secondary',
                    help: '@dmpt-dc:accessRights:data_retained_secondary:help',
                    defaultValue: 'null',
                    controlType: 'radio',
                    options: [{
                        value: "extended_consent",
                        label: "@dmpt-dc:accessRights:data_retained_secondary:extended_consent"
                      },
                      {
                        value: "unspecified_consent",
                        label: "@dmpt-dc:accessRights:data_retained_secondary:unspecified_consent"
                      }
                    ],
                    subscribe: {
                      'human_participant_data_identifiable_consent': {
                        onValueUpdate: [{
                          debug: 'onValueUpdate:human_participant_data_identifiable_consent:subscribedto:dmpt_ethics_dc_access_rights_share_data',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable_informed_consent'],
                          props: [
                            {key: 'value', val: ''},
                            {key: 'visible', val: true}
                          ]
                        }]
                      }
                    }
                  }
                },

                {
                  class: 'TextField',
                  definition: {
                    name: 'dataLicensingAccess_manager',
                    label: '@dmpt-dataLicensingAccess_manager',
                    type: 'text',
                    readOnly: true,
                    subscribe: {
                      'contributor_data_manager': {
                        onValueUpdate: [{
                          action: 'utilityService.concatenate',
                          fields: ['text_full_name'],
                          delim: ''
                        }]
                      }
                    },
                    value: '@user_name'
                  },
                  variableSubstitutionFields: ['value']
                }
              ]
            }
          },
          // -------------------------------------------------------------------
          // New Access And Rights Tab
          // -------------------------------------------------------------------
          {
            class: "Container",
            definition: {
              id: "ownership",
              label: "@dmpt-access-rights-tab",
              fields: [{
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-access-rights-heading',
                    type: 'h3'
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'DropdownFieldComponent',
                  variableSubstitutionFields: ['selectFor'],
                  definition: {
                    selectFor: '@user_edupersonscopedaffiliation',
                    defaultSelect: 'staff@uts.edu.au',
                    name: 'dc:rightsHolder_dc:name',
                    label: '@dmpt-dc:rightsHolder_dc:name',
                    help: [{
                      key: 'staff@uts.edu.au',
                      value: '@dmpt-dc:rightsHolder_dc:name-help'
                    },{
                      key: 'student@uts.edu.au',
                      value: '@dmpt-dc:rightsHolder_dc:name-student-help'
                    }],
                    options: [
                      {
                        key: 'student@uts.edu.au',
                        value:[{
                            value: "", label: "@dmpt-select:Empty"
                          },{
                            value: "myUni", label: "@dmpt-dc:rightsHolder_dc:name-myUni"
                          },{
                            value: "myUnjount", label: "@dmpt-dc:rightsHolder_dc:name-myUnjount"
                          },{
                            value: "student", label: "@dmpt-dc:rightsHolder_dc:name-student"
                          },{
                            value: "studentJoint", label: "@dmpt-dc:rightsHolder_dc:name-studentJoint"
                          },{
                            value: "others", label: "@dmpt-dc:rightsHolder_dc:name-others"
                          }
                        ]
                      },
                      {
                        key: 'staff@uts.edu.au',
                        value:[{
                            value: "", label: "@dmpt-select:Empty"
                          },{
                            value: "myUni", label: "@dmpt-dc:rightsHolder_dc:name-myUni"
                          },{
                            value: "myUnjount", label: "@dmpt-dc:rightsHolder_dc:name-myUnjount"
                          },{
                            value: "student", label: "@dmpt-dc:rightsHolder_dc:name-student"
                          },{
                            value: "others", label: "@dmpt-dc:rightsHolder_dc:name-others"
                          }
                        ]
                      }
                    ],
                    required: true,
                    validationMessages: {
                      required: "@dmpt-dc:rightsHolder_dc:name-required"
                    }
                  }
                },
                {
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',
                  definition: {
                    name: 'dc:rightsHolder_dc:description',
                    label: '@dmpt-dc:rightsHolder_dc:description',
                    help: '@dmpt-dc:rightsHolder_dc:description-help',
                    rows: 5,
                    columns: 10
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'DropdownFieldComponent',
                  definition: {
                    name: 'vivo:Dataset_dc:location_rdf:PlainLiteral',
                    label: '@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral',
                    help: '@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-help',
                    options: [{
                        value: "",
                        label: "@dmpt-select:Empty"
                      },
                      {
                        label: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-eresearch-platforms",
                        value: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-eresearch-platforms"
                      },
                      {
                        label: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-eresearch-store",
                        value: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-eresearch-store"
                      },
                      {
                        label: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-share-drive",
                        value: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-share-drive"
                      },
                      {
                        label: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-survey-platform",
                        value: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-survey-platform"
                      },
                      {
                        label: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-collab-space",
                        value: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-collab-space"
                      },
                      {
                        label: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-other",
                        value: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-other"
                      }
                    ],
                    required: false,
                    validationMessages: {
                      required: "@dmpt-vivo:Dataset_dc:location_rdf:PlainLiteral-required"
                    }
                  }
                },
                {
                  class: 'TextArea',
                  compClass: 'TextAreaComponent',
                  definition: {
                    name: 'vivo:Dataset_dc:location_skos:note',
                    label: '@dmpt-vivo:Dataset_dc:location_skos:note',
                    rows: 5,
                    columns: 10
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    required: true,
                    name: 'dc:accessRights',
                    label: '@dmpt-dc:accessRights',
                    help: '@dmpt-dc:accessRights-help',
                    defaultValue: 'null',
                    controlType: 'radio',
                    options: [{
                        value: "@dmpt-dc:accessRights-manager",
                        label: "@dmpt-dc:accessRights-manager",
                        publishTag: 'dc_access_rights_available'
                      },
                      {
                        value: "@dmpt-dc:accessRights-open",
                        label: "@dmpt-dc:accessRights-open",
                        publishTag: 'dc_access_rights_available'
                      },
                      {
                        value: "@dmpt-dc:accessRights-none-val",
                        label: "@dmpt-dc:accessRights-none",
                        publishTag: 'dc_access_rights_not_available',
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'dmpt_ethics_dc_access_rights_not_available',
                    label: '@dmpt-dc:accessRights:not_available',
                    type: 'text',
                    subscribe: {
                      'dc:accessRights': {
                        onItemSelect: [{
                          fieldName: 'dmpt_ethics_dc_access_rights_not_available',
                          action: 'setProp',
                          valueTest: ['dc_access_rights_not_available'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: {
                      type: 'function',
                      action: 'updateVisibility',
                      debug: 'ethics_identifiable_de_identify',
                      field: 'human_participant_data_identifiable',
                      fieldValue : 'human_participant_data_identifiable'
                    },
                    name: 'ethics_identifiable_de_identify',
                    label: '@dmpt-ethics:identifiable:de_identify',
                    help: '@dmpt-ethics:identifiable:transfered_out:help',
                    controlType: 'radio',
                    options: [{
                        value: "yes",
                        label: "Yes",
                        publishTag: 'ethics_identifiable_de_identify_yes'
                      },
                      {
                        value: "no",
                        label: "No",
                        publishTag: 'ethics_identifiable_de_identify_no'
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    },
                    subscribe: {
                      'human_participant_data_identifiable': {
                        onValueUpdate: [{
                          fieldName: 'ethics_identifiable_de_identify',
                          action: 'setProp',
                          valueTest: ['human_participant_data_identifiable'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_not_de_identify',
                    label: '@dmpt-ethics:identifiable:not_de_identify',
                    type: 'text',
                    subscribe: {
                      'ethics_identifiable_de_identify': {
                        onItemSelect: [{
                          fieldName: 'ethics_identifiable_not_de_identify',
                          action: 'setProp',
                          valueTest: ['no'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_yes_de_identify_how_when',
                    label: '@dmpt-ethics:identifiable:yes_de_identify:how_when',
                    type: 'text',
                    subscribe: {
                      'ethics_identifiable_de_identify': {
                        onItemSelect: [{
                          fieldName: 'ethics_identifiable_not_de_identify',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_yes_de_identify_who_access',
                    label: '@dmpt-ethics:identifiable:yes_de_identify:who_access',
                    type: 'text',
                    subscribe: {
                      'ethics_identifiable_de_identify': {
                        onItemSelect: [{
                          fieldName: 'ethics_identifiable_not_de_identify',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_identifiable_yes_de_identify_link_files',
                    label: '@dmpt-ethics:identifiable:yes_de_identify:link_files',
                    type: 'text',
                    subscribe: {
                      'ethics_identifiable_de_identify': {
                        onItemSelect: [{
                          fieldName: 'ethics_identifiable_not_de_identify',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: true,
                    required: true,
                    name: 'ethics_data_secondary_third_party',
                    label: '@dmpt-ethics:data:secondary_third_party',
                    help: '@dmpt-ethics:identifiable:secondary_third_party:help',
                    defaultValue: 'no',
                    controlType: 'radio',
                    options: [{
                        value: "no",
                        label: "No",
                        publishTag: 'ethics_data_secondary_third_party',
                      },
                      {
                        value: "yes",
                        label: "Yes",
                        publishTag: 'ethics_data_secondary_third_party'
                      }
                    ],
                    publish: {
                      onItemSelect: {
                        modelEventSource: 'valueChanges'
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_secondary_third_party_held',
                    label: '@dmpt-ethics:data:secondary_third_party:held',
                    help: '@dmpt-ethics:data:secondary_third_party:held:help',
                    controlType: 'checkbox',
                    options: [{
                        value: "Privately held data source",
                        label: "Privately held data source"
                      },
                      {
                        value: "Data that is publically available (e.g. webscraping, social media, museums and archives etc)",
                        label: "Data that is publically available (e.g. webscraping, social media, museums and archives etc)"
                      },
                      {
                        value: "Publically held data source (Commonwealth e.g. ABS) ",
                        label: "Publically held data source (Commonwealth e.g. ABS) "
                      },
                      {
                        value: "Publically held data source (State e.g. NSW Ministry of Health) ",
                        label: "Publically held data source (State e.g. NSW Ministry of Health) "
                      },
                      {
                        value: "Publically held data source (International e.g. NIH, NASA, NOAA)",
                        label: "Publically held data source (International e.g. NIH, NASA, NOAA)"
                      }
                    ],
                    subscribe:{
                      'ethics_data_secondary_third_party': {
                        onItemSelect: [{
                          debug: 'ethics_data_secondary_third_party_held',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'SelectionField',
                  compClass: 'SelectionFieldComponent',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_secondary_third_party_ownership_type',
                    label: '@dmpt-ethics:data:secondary_third_party:ownership_type',
                    help: '@dmpt-ethics:data:secondary_third_party:ownership_type:ownership_type',
                    controlType: 'radio',
                    options: [{
                        value: "open_license",
                        label: "Open license"
                      },
                      {
                        value: "commercial_license",
                        label: "Commercial license"
                      },
                      {
                        value: "purchase",
                        label: "Purchase"
                      },
                      {
                        value: "other",
                        label: "Other, please specify"
                      }
                    ],
                    subscribe: {
                      'ethics_data_secondary_third_party': {
                        onItemSelect: [{
                          debug: 'ethics_data_secondary_third_party_ownership_type',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                            {key: 'required', val: true, val2: false}
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                  visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_secondary_third_party_security',
                    label: '@dmpt-ethics:data:secondary_third_party:security',
                    help: '@dmpt-ethics:data:secondary_third_party:security:help',
                    type: 'text',
                    subscribe: {
                      'ethics_data_secondary_third_party': {
                        onItemSelect: [{
                          debug: 'ethics_data_secondary_third_party_security',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                  visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_secondary_third_party_disposal',
                    label: '@dmpt-ethics:data:secondary_third_party:disposal',
                    help: '@dmpt-ethics:data:secondary_third_party:disposal:help',
                    type: 'text',
                    subscribe: {
                      'ethics_data_secondary_third_party': {
                        onItemSelect: [{
                          debug: 'ethics_data_secondary_third_party_disposal',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                  visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_secondary_third_party_attribution',
                    label: '@dmpt-ethics:data:secondary_third_party:attribution',
                    help: '@dmpt-ethics:data:secondary_third_party:attribution:help',
                    type: 'text',
                    subscribe: {
                      'ethics_data_secondary_third_party': {
                        onItemSelect: [{
                          debug: 'ethics_data_secondary_third_party_attribution',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                    visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_secondary_third_party_access_arrangements',
                    label: '@dmpt-ethics:data:secondary_third_party:access_arrangements',
                    help: '@dmpt-ethics:data:secondary_third_party:access_arrangements:help',
                    type: 'text',
                    subscribe: {
                      'ethics_data_secondary_third_party': {
                        onItemSelect: [{
                          debug: 'ethics_data_secondary_third_party_access_arrangements',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'TextField',
                  definition: {
                  visible: false,
                    visibilityCriteria: true,
                    name: 'ethics_data_secondary_third_party_other',
                    label: '@dmpt-ethics:data:secondary_third_party:other',
                    help: '@dmpt-ethics:data:secondary_third_party:other:help',
                    type: 'text',
                    subscribe: {
                      'ethics_data_secondary_third_party': {
                        onItemSelect: [{
                          debug: 'ethics_data_secondary_third_party_other',
                          action: 'setProp',
                          valueTest: ['yes'],
                          props: [
                            {key: 'value', val: '', val2: ''},
                            {key: 'visible', val: true, val2: false},
                          ]
                        }]
                      }
                    }
                  }
                },
                {
                  class: 'HtmlRaw',
                  compClass: 'HtmlRawComponent',
                  definition: {
                    name: "attach-licences-prefix",
                    value: '<h5>If ethics approval required, please attach licences or agreements</h5>'
                  }
                },
                {
                  class: "SaveButton",
                  editOnly: true,
                  definition: {
                    label: 'Attach copy of license or agreement documents (not implemented)',
                    closeOnSave: true,
                    redirectLocation: '/@branding/@portal/dashboard/default',
                    disabledExpression: '<%= _.isEmpty(relatedRecordId) %>'
                  },
                  variableSubstitutionFields: ['redirectLocation']
                }
              ]
            }
          },

          // -------------------------------------------------------------------
          // Workspaces Tab
          // -------------------------------------------------------------------
          {
            class: "Container",
            definition: {
              id: "workspaces",
              label: "@dmpt-workspaces-tab",
              fields: [{
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-workspaces-heading',
                    type: 'h3'
                  }
                },
                {
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  definition: {
                    value: '@dmpt-workspaces-associated-heading',
                    type: 'h4'
                  }
                },
                {
                  class: 'RelatedObjectDataField',
                  showHeader: true,
                  definition: {
                    name: 'workspaces',
                    columns: [{
                        "label": "Name",
                        "property": "title"
                      },
                      {
                        "label": "Description",
                        "property": "description"
                      },
                      {
                        "label": "Location",
                        "property": "location",
                        "link": "absolute"
                      },
                      {
                        "label": "Type",
                        "property": "type"
                      }
                    ]
                  }
                },
                {
                  class: 'Container',
                  compClass: 'TextBlockComponent',
                  editOnly: true,
                  definition: {
                    value: '@dmpt-workspaces-create-title',
                    type: 'h4'
                  }
                },
                {
                  class: 'WorkspaceSelectorField',
                  compClass: 'WorkspaceSelectFieldComponent',
                  definition: {
                    name: 'WorkspaceSelect',
                    label: '@dmpt-workspace-select-type',
                    help: '@dmpt-workspace-select-help',
                    open: '@dmpt-workspace-open',
                    saveFirst: '@dmpt-workspace-saveFirst',
                    defaultSelection: [{
                      name: '',
                      label: '@dmpt-select:Empty'
                    }]
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      class: "ButtonBarContainer",
      compClass: "ButtonBarContainerComponent",
      definition: {
        editOnly: true,
        fields: [{
            class: "TabNavButton",
            definition: {
              id: 'mainTabNav',
              prevLabel: "@tab-nav-previous",
              nextLabel: "@tab-nav-next",
              targetTabContainerId: "mainTab",
              cssClasses: 'btn btn-primary',
              endDisplayMode: 'hidden'
            }
          },
          {
            class: "Spacer",
            definition: {
              width: '50px',
              height: 'inherit'
            }
          },
          {
            class: "SaveButton",
            definition: {
              label: 'Save',
              cssClasses: 'btn-success'
            }
          },
          {
            class: "SaveButton",
            definition: {
              label: 'Save & Close',
              closeOnSave: true,
              redirectLocation: '/@branding/@portal/dashboard/rdmp'
            },
            variableSubstitutionFields: ['redirectLocation']
          },
          {
            class: "CancelButton",
            definition: {
              label: 'Close',
            }
          }
        ]
      }
    },
    {
      class: "Container",
      definition: {
        id: "form-render-complete",
        label: "Test",
        fields: [{
          class: 'Container',
          compClass: 'TextBlockComponent',
          definition: {
            value: 'will be empty',
            type: 'span'
          }
        }]
      }
    }
  ]
};
