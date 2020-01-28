//Workspaces Definitions

module.exports.workspaces = {
  available: [
    // {
    //   logo: '/angular/gitlab/assets/images/gitlab.png',
    //   name: 'gitlab',
    //   displayName: 'GITLAB',
    //   title: 'GitLab',
    //   desc: 'Source Code',
    //   app: {
    //     id: 'gitlab'
    //   }
    // },
    // {
    //   logo: '/angular/omero/assets/images/omero.png',
    //   name: 'omero',
    //   displayName: 'OMERO',
    //   title: 'OMERO',
    //   desc: 'Microimaging',
    //   app: {
    //     id: 'omero'
    //   }
    // },
    {
      logo: '/angular/catalog/assets/images/storage.png',
      name: 'storage',
      displayName: 'STORAGE',
      title: 'Storage',
      desc: 'eResearch Storage',
      app: {
        id: 'catalog',
        type: 'storage'
      }
    },
    {
      logo: '/angular/catalog/assets/images/catalog.png',
      name: 'catalog',
      displayName: 'CONSULTATION',
      title: 'eResearch Consultation',
      desc: 'eResearch Consultation',
      app: {
        id: 'catalog',
        type: 'stash_rdmp_help'
      }
    },
    {
      logo: '/angular/catalog/assets/images/uts_ihpc.png',
      name: 'hpc',
      displayName: 'iHPC',
      title: 'eResearch iHPC (Project Volumes)',
      desc: 'The iHPC facility provides an interactive high performance computing resource for all researchers within UTS.',
      app: {
        id: 'catalog',
        type: 'ihpc'
      }
    },
    {
      logo: '/angular/catalog/assets/images/uts_hpcc.png',
      name: 'hpcc',
      displayName: 'HPCC',
      title: 'eResearch HPCC',
      desc: 'High Performance Computing Cluster (HPCC) that can be accessed by UTS researchers.',
      app: {
        id: 'catalog',
        type: 'hpcc'
      }
    },
    {
      logo: '/angular/labarchives/assets/images/la.png',
      name: 'labarchives',
      displayName: 'LABARCHIVES',
      title: 'LabArchives',
      desc: 'eNotebooks',
      app: {
        id: 'labarchives'
      }
    },
    // {
    //   logo: '/angular/redcap/assets/images/logo.png',
    //   name: 'redcap',
    //   displayName: 'REDCAP',
    //   title: 'RedCap',
    //   desc: 'Redcap',
    //   app: {
    //     id: 'redcap'
    //   }
    // }
  ]
}
