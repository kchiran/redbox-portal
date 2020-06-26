import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SimpleComponent } from './field-simple.component';
import { FieldBase } from './field-base';
import { WorkspaceRegisterField } from './workspace-field.component';
import * as _ from "lodash";
declare var jQuery: any;
import { CompleterService, CompleterData } from 'ng2-completer';

@Component({
  selector: 'workspace-register-parent',
  template: ''
})
export class WorkspaceRegisterComponent extends SimpleComponent {
  static clName = 'WorkspaceRegisterComponent';

  getLabel(val: any): string {
    const opt = _.find(this.field.options, (opt) => {
      return opt.value == val;
    });
    if (opt) {
      return opt.label;
    } else {
      return '';
    }
  }

}

@Component({
  selector: 'workspace-register',
  styleUrls: ['./workspace-register.component.css'],
  templateUrl: './workspace-register.component.html'
})
export class WorkspaceRegisterFieldComponent extends WorkspaceRegisterComponent {
  field: WorkspaceRegisterField
  static clName = 'WorkspaceRegisterFieldComponent';
  disabledType: boolean = false;
  stepHidden = [false,true];
  vstate = 0;
  searchStr: string;
  dataService: CompleterData;
  searchData = [];
  workspaceSelected: any = {};
  workspaceType: WorkspaceType;
  clearSelected: boolean = false;
  workspaceRegisterForm;
  submitted = false;

  ngOnInit() {
    this.field.init();
    this.field.registerEvents();
  }

  saveAndOpenWorkspace() {
    this.fieldMap._rootComp.onSubmit().subscribe(response => {
      this.disabledType = false;
      this.vstate = 0;
      this.stepHidden = [false,true];
      this.workspaceRegisterForm.reset();
      this.clearSelected = true;
      this.submitted = false;
      jQuery('#workspaceRegisterModal').modal({backdrop: 'static', keyboard: false, show: true});
    });
  }

  onSelect(event) {
    this.disabledType = true;
    this.workspaceType = event['originalObject'];
    this.stepHidden = [true,false];
  }

  clearWorkspaceSelected() {
    this.clearSelected = true;
    this.disabledType = false;
    this.stepHidden = [false,true];
  }

  registerWorkspace(value) {
    console.log(`registerWorkspace ${value}`);
    this.workspaceRegisterForm.patchValue({workspaceType: this.workspaceType.value});
    this.submitted = true;

    // stop here if form is invalid
    if (this.workspaceRegisterForm.invalid) {
      return;
    }
  }

  get f() { return this.workspaceRegisterForm.controls; }

  constructor(private completerService: CompleterService,
              private formBuilder: FormBuilder) {
    super();
    this.searchData = [
      {label: "eResearch Store", value: "research-workspace-eresearch-store", description: 'Storage provided by eResearch', image: 'https://stash-uat.research.uts.edu.au/angular/catalog/assets/images/storage.png'},
      {label: "OneDrive", value: "research-workspace-onedrive", keywords:'microsoft storage', description: 'Store and share photos, videos, documents', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Microsoft_Office_OneDrive_%282018%E2%80%93present%29.svg'},
      {label: "Cloudstor", value: "research-workspace-cloudstor", keywords: 'cloudstor storage', description: 'Cloud service for researchers. With CloudStor researchers can easily sync, share and store files using the high-speed AARNet network', image: '/angular/assets/images/cloudstor.png'},
      {label: "University Drive", value: "research-workspace-university-drive", keywords:'uts storage', description: 'G:/ or H:// drive provided by UTS', image: 'https://www.lib.uts.edu.au/sites/all/themes/utslib2011/images/logos/UTS_logo_web.svg'},
      {label: "Qualtrics", value: "research-workspace-eresearch-qualtrics", keywords:'survey', description: 'Build surveys, distribute surveys and analyze responses ', image: 'https://www.qualtrics.com/m/qualtrics-xm-long.svg'},
      {label: "eResearch LimeSurvey", value: "research-workspace-eresearch-limesurvey", keywords:'survey', description: 'Online survey tool that allows one to build surveys, distribute surveys and analyze responses ', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Limesurvey_logo.png'},
      {label: "HPCC", value: "research-workspace-eresearch-hpcc", keywords:'High Performance Computer Cluster', description: 'High Performance Computing Cluster (HPCC) that can be accessed by UTS researchers.', image: 'https://stash-uat.research.uts.edu.au/angular/catalog/assets/images/uts_hpcc.png'},
      {label: "iHPCC", value: "research-workspace-eresearch-ihpc", keywords: 'Interactive High Performance Computer', description: 'The iHPC facility provides an interactive high performance computing resource for all researchers within UTS.', image: 'https://stash-uat.research.uts.edu.au/angular/catalog/assets/images/uts_ihpc.png'},
      {label: "Git Repository", value: "research-workspace-eresearch-git-repository", keywords: 'github gitlab', description: 'Repositories in GIT contain a collection of files of various different versions of a Project', image: 'https://git-scm.com/images/logo@2x.png'}
    ];
    this.dataService = completerService.local(this.searchData, 'label,description,keywords', 'label').imageField("image").descriptionField("description");
    this.workspaceRegisterForm = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      location: new FormControl('', Validators.required),
      details: new FormControl('', Validators.required),
      workspaceType: new FormControl('', Validators.required),
    });
 }

}

class WorkspaceType{
  label: string = '';
  description: string = '';
  image: string = '';
  value: string = '';
}
