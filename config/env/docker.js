/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the development       *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  // models: {
  //   connection: 'someMongodbServer'
  // }
  bootstrapTimeout: 480000,
  pubsub: {
    _hookTimeout: 480000,
  },
  log: {
    level: 'debug'
  },
  appUrl:'http://localhost:1500',
  record:{
    baseUrl: {
      redbox: "http://redbox:9000/redbox",
      mint: "https://dev-redbox.research.uts.edu.au/mint"
    }
  },
  redbox: {
    apiKey: 'c8e844fc-8550-497f-b970-7900ec8741ca'
  },
  mint: {
    apiKey: '123123',
    api: {
      search: {
        method: 'get',
        url: '/api/v1/search'
      }
    }
  },
  // added for TUS server, only set if there's a reverse proxy infront, otherwise, TUS needs this so it can return the correct host name and port
  //appPort: 1500,
  db: {
    waitRetries: 5,
    waitSleep: 10000
  },
  auth: {
    // Default brand...
    default: {
      active: ["aaf", "local"],
      aaf: {
        loginUrl: "https://rapid.test.aaf.edu.au/jwt/authnrequest/research/OTG8tPdB2H_aT0yZ4s63zQ",
        opts: {
          secretOrKey: 'Y30wY4xv1*6I7yUX%6v*Tzce8OEbVO&@R4hVb%2@Gehtx^xgOqQ97Slv!ZOkfHHmox&x0zAt*0o&4^8$9oW8WTf&r@&d31EFbQZr',
          jsonWebTokenOptions: {
            issuer: 'https://rapid.test.aaf.edu.au',
            audience: 'http://localhost:1500/default/rdmp/',
            ignoreNotBefore: true
          }
        }
      }
    }
  },
  datastores:{
    mongodb: {
      adapter: require('sails-mongo'),
      url: 'mongodb://mongodb:27017/redbox-portal'
    }
  },
  workspaces: {
    portal: {
      authorization: 'Bearer 1f720605-cf59-4377-87f2-3a94bfa11945'
    },
    provisionerUser: 'admin',
    parentRecord: 'rdmp',
    labarchives: {
      parentRecord: 'rdmp',
      formName: 'labarchives-1.0-draft',
      workflowStage: 'draft',
      appName: 'labarchives',
      appId: 'labarchives',
      recordType: 'labarchives',
      workspaceFileName: 'README.md',
      key: {"akid": "***REMOVED***", "password": "***REMOVED***", "baseurl": "https://ohtest.labarchives.com",
  "api": "/api"},
      location: 'https://ohtest.labarchives.com',
      description: 'eNotebook Workspace'
    },
    catalog: {
      parentRecord: 'rdmp',
      formName: 'catalog-1.0-draft',
      workflowStage: 'draft',
      appName: 'catalog',
      appId: 'catalog',
      recordType: 'catalog',
      description: 'eResearch Service',
      domain: 'https://utstest.service-now.com',
      taskURL: '/task.do?sys_id=',
      requestTable: 'sc_request',
      user: '***REMOVED***',
      password: '***REMOVED***',
      assignedToEmail: 'Moises.Sacal@uts.edu.au',
      testRequestorId: null,
      items: [
        {name: 'ihpc', id: 'xxx'},
        {name: 'hpcc', id: 'xxx'},
        {name: 'storage', id: 'xxx'},
        {name: 'stash_rdmp_help', id: 'xxx'}
      ]
    }
  }
};
