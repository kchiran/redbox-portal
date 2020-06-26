import { Component } from '@angular/core';
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
  stepHidden = [false,true,true,true,true];
  vstate = 0;
  searchStr: string;
  dataService: CompleterData;
  searchData = [];
  workspaceSelected: any = {};
  workspaceRegister: WorkspaceRegister;
  clearSelected: boolean = false;

  ngOnInit() {
    this.field.init();
    this.field.registerEvents();
  }

  saveAndOpenWorkspace() {
    this.fieldMap._rootComp.onSubmit().subscribe(response => {
      this.disabledType = false;
      this.vstate = 0;
      this.stepHidden = [false,true,true,true,true];
      this.workspaceRegister = new WorkspaceRegister();
      this.clearSelected = true;
      jQuery('#workspaceRegisterModal').modal('show');
    });
  }

  onSelect(event) {
    this.disabledType = true;
    this.workspaceRegister.workspaceType = event['originalObject']
  }

  clearWorkspaceSelected() {
    this.clearSelected = true;
    this.disabledType = false;
  }

  step(w) {
    if(w === 'next') {
      if(this.vstate > 3){
        this.vstate = 4;
      } else {
        this.vstate++;
      }
    } else {
      if(this.vstate < 1) {
        this.vstate = 0;
      } else {
        this.vstate--;
      }
    }
    _.each(this.stepHidden, (t, i) => {
      this.stepHidden[i] = this.vstate != i;
    });
  }

  registerWorkspace() {
    console.log('registerWorkspace');
    console.log(this.workspaceRegister);
  }

  constructor(private completerService: CompleterService) {
    super();
    console.log(this.field);
    this.searchData = [
      {label: "eResearch Store", value: "research-workspace-eresearch-store", description: 'Storage provided by eResearch', image: 'https://stash-uat.research.uts.edu.au/angular/catalog/assets/images/storage.png'},
      {label: "OneDrive", value: "research-workspace-onedrive", keywords:'microsoft storage', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Microsoft_Office_OneDrive_%282018%E2%80%93present%29.svg'},
      {label: "Cloudstor", value: "research-workspace-cloudstor", keywords: 'cloudstor storage',image: '/angular/assets/images/cloudstor.png'},
      {label: "University Drive", value: "research-workspace-university-drive", keywords:'uts storage', image: 'https://www.lib.uts.edu.au/sites/all/themes/utslib2011/images/logos/UTS_logo_web.svg'},
      {label: "Qualtrics", value: "research-workspace-eresearch-qualtrics", keywords:'survey', image: 'https://www.qualtrics.com/m/qualtrics-xm-long.svg'},
      {label: "eResearch LimeSurvey", value: "research-workspace-eresearch-limesurvey", keywords:'survey', image: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Limesurvey_logo.png'},
      {label: "HPCC", value: "research-workspace-eresearch-hpcc", keywords:'High Performance Computer Cluster', image: 'https://stash-uat.research.uts.edu.au/angular/catalog/assets/images/uts_hpcc.png'},
      {label: "iHPCC", value: "research-workspace-eresearch-ihpc", keywords: 'Interactive High Performance Computer', image: 'https://stash-uat.research.uts.edu.au/angular/catalog/assets/images/uts_ihpc.png'},
      {label: "Git Repository", value: "research-workspace-eresearch-git-repository", keywords: 'github gitlab', image: 'https://git-scm.com/images/logo@2x.png'}
    ];
    this.workspaceRegister = {
      name: '',
      workspaceType: new WorkspaceType(),
      location: '',
      details: ''
    }
    this.dataService = completerService.local(this.searchData, 'label,description,keywords', 'label').imageField("image").descriptionField("description");
 }

}

class WorkspaceRegister {
  workspaceType: WorkspaceType = new WorkspaceType();
  name: string = '';
  location: string = '';
  details: string = '';
}
class WorkspaceType{
  label: string = '';
  description: string = '';
  image: string = '';
  value: string = '';
}
