// Copyright (c) 2017 Queensland Cyber Infrastructure Foundation (http://www.qcif.edu.au/)
//
// GNU GENERAL PUBLIC LICENSE
//    Version 2, June 1991
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License along
// with this program; if not, write to the Free Software Foundation, Inc.,
// 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

import { Observable } from 'rxjs/Rx';
import services = require('../core/CoreService.js');
import { Sails, Model } from "sails";
import 'rxjs/add/operator/toPromise';
import * as request from "request-promise";
import * as ejs from 'ejs';
import * as fs from 'graceful-fs';
import fse = require('fs-extra');
import path = require('path');
import ocfl = require('ocfl');


import { Index, jsonld } from 'calcyte';
const datacrate = require('datacrate').catalog;

declare var sails: Sails;
declare var RecordsService, UsersService, BrandingService;
declare var _;

const URL_PLACEHOLDER = '{ID_WILL_BE_HERE}'; // config


export module Services {
  /**
   *
   * a Service to extract a DataPub and put it in a DataCrate with the
   * metadata crosswalked into the right JSON-LD
   *
   * @author <a target='_' href='https://github.com/spikelynch'>Mike Lynch</a>
   *
   */
  export class DataPublication extends services.Services.Core.Service {

  	protected _exportedMethods: any = [
  		'exportDataset'
  	];



    // exportDataset is the main point of entry. It returns an Observable
    // which writes out the record's attachments, creates a DataCrate for
    // them and imports them into the required repository (staging or
    // public)

    // in the current version, if the target directory has not yet been 
    // initialised, it initalised an ocfl repository there. A future
    // release should leave this to boostrap or deployment.

    // the 'user' in the args is whoever triggered the export by clicking the
    // publication submit button

  	public exportDataset(oid, record, options, user): Observable<any> {
   		if( this.metTriggerCondition(oid, record, options) === "true") {

				const site = sails.config.datapubs.sites[options['site']];
				if( ! site ) {
					sails.log.error("Unknown publication site " + options['site']);
					return Observable.of(null);
				}

				const md = record['metadata'];

				const drec = md['dataRecord'];
				const drid = drec ? drec['oid'] : undefined;

				if( ! drid ) {
					sails.log.error("Couldn't find dataRecord or id for data pub " + oid);
					return Observable.of(null)
				}

				// start an Observable to get/initialise the repository, then call createNewObjectContent
				// content on it with a callback which will actually write out the attachments and
				// make a datacrate. Once that's done, updates the URL in the data record.

				// the interplay between Promises and Observables here is too convoluted and needs
				// refactoring.

				//sails.log.debug("Bailing out before actually writing data pub");
				//return Observable.of(null);

				if( ! user || ! user['email'] ) {
					user = { 'email': '' };
					sails.log.error("Empty user or no email found");
				}

				const datasetUrl = site['url'] + '/' + oid + '/';
				md['citation_url'] = datasetUrl;
				md['citation_doi'] = md['citation_doi'].replace(URL_PLACEHOLDER, datasetUrl);

				return Observable.fromPromise(this.getRepository(options['site']))
					.flatMap((repository) => {
						return UsersService.getUserWithUsername(record['metaMetadata']['createdBy'])
							.flatMap((creator) => { 
  							return Observable.fromPromise(repository.createNewObjectContent(oid, async (dir) => {
									await this.writeDataset(creator, user, oid, drid, md, dir);
								}))
  						})
						}).flatMap(() => {
							// updateMeta to save the citation_url and citation_doi back to the
							// data publication record
							return RecordsService.updateMeta(sails.config.auth.defaultBrand, oid, record, null, true, false);
						}).catch(err => {
						sails.log.error(`Error publishing dataset ${oid} to ocfl repo st ${options['site']}`);
						sails.log.error(err.name);
						sails.log.error(err.message);
						sails.log.error(err.stack);
           	return this.recordPublicationError(oid, record, err);
					});

    	} else {
     		sails.log.debug(`Not publishing: ${oid}, condition not met: ${_.get(options, "triggerCondition", "")}`);
    		return Observable.of(null);
   		}
  	}


  	// this initialises the repository if it can't load it, which
  	// is a bit rough and ready. FIXME - this should be done in 
  	// deployment or at least bootstrapping the server

  	private async getRepository(site): Promise<any> {
  		if(! sails.config.datapubs.sites[site] ) {
				sails.log.error(`unknown site ${site}`);
				throw(new Error("unknown repostitory site " + site));
  		} else {
  			const dir = sails.config.datapubs.sites[site].dir;
 				const repository = new ocfl.Repository();
  			try {
  				await repository.load(dir);
  				return repository;
  			} catch(e) {
  				try {
  					const newrepo = new ocfl.Repository();
  			    await fse.ensureDir(dir);
  					await newrepo.create(dir);
  			    sails.log.info(`New ofcl repository created at ${dir}`);
  					return newrepo;
  				} catch(e) {
  					sails.log.error("Could neither load nor initialise repo at " + dir);
  		    	sails.log.debug(`repo = ${JSON.stringify(repository)}`);
  					throw(e);
  				}
  			}
  		}
  	}

  	// async function which takes a data publication and destination directory
  	// and writes out the attachments and datacrate files to it

    // based on the original exportDataset - takes the existing Observable chain
    // and converts it to a promise so that it can work with the ocfl library

		private async writeDataset(creator: Object, approver: Object, oid: string, drid: string, metadata: Object, dir: string): Promise<any> {

			const mdOnly = metadata['accessRightsToggle'];

			const attachments = metadata['dataLocations'].filter(
				(a) => ( !mdOnly && a['type'] === 'attachment' && a['selected'] )
			);

			// make sure attachments have a unique filepath 

			attachments.map((a) => {
				attachments['path'] = path.join(a['fileId'], a['name']);
			});

			const obs = attachments.map((a) => {
				return RecordsService.getDatastream(drid, a['fileId']).
					flatMap(ds => {
						const filedir = path.join(dir, a['fileId']);
						return Observable.fromPromise(this.writeAttachment(ds.body, filedir, a['name']));
					});
			});
	
			obs.push(Observable.fromPromise(this.makeDataCrate(creator, approver, oid, dir, metadata)));
			return Observable.merge(...obs).toPromise();
		}


		// This is the first attempt, but it doesn't work - the files it
		// writes out are always empty. I think it's because the API call
		// to get the attachment isn't requesting a stream, so it's coming
		// back as a buffer.

		private writeDatastream(stream: any, fn: string): Promise<boolean> {
			return new Promise<boolean>( (resolve, reject) => {
  			var wstream = fs.createWriteStream(fn);
  			sails.log.debug("start writeDatastream " + fn);
  			stream.pipe(wstream);
  			stream.end();
				wstream.on('finish', () => {
					sails.log.debug("finished writeDatastream " + fn);
					resolve(true);
				});
				wstream.on('error', (e) => {
					sails.log.error("File write error");
					reject
    		});
			});
		}

		// this version works, but I'm worried that it will put the whole of
		// the buffer in RAM. See writeDatastream for my first attempt, which
		// doesn't work.

		private async writeAttachment(buffer: Buffer, dir: string, fn: string): Promise<boolean> {
			return new Promise<boolean>( ( resolve, reject ) => {
				try {
					fse.ensureDir(dir, err => {
						if( ! err ) {
							fs.writeFile(path.join(dir, fn), buffer, () => {
								resolve(true)
							});
						} else {
							throw(err);
						}
					});
				} catch(e) {
					sails.log.error("attachment write error");
					sails.log.error(e.name);
					sails.log.error(e.message);
					reject;
				}
			});
		}



		private async makeDataCrate(creator: Object, approver: Object, oid: string, dir: string, metadata: Object): Promise<any> {

			const index = new Index();

			const catalog = await datacrate.datapub2catalog({
				'id': oid,
				'datapub': metadata,
				'organisation': sails.config.datapubs.datacrate.organization,
				'owner': creator['email'],
				'approver': approver['email']
			});

			const catalog_json = path.join(dir, sails.config.datapubs.datacrate.catalog_json);
			await fs.writeFile(catalog_json, JSON.stringify(catalog, null, 2));

			index.init_pure({
				catalog_json: catalog,
				multiple_files: true
			});

			const template_ejs = await index.load_template();

			const pages = index.make_index_pure(metadata['citation_doi'], null);
			const html_filename = index.html_file_name;

			await Promise.all(pages.map((p) => {
					return this.writeCatalogHTML(path.join(dir, p.path), html_filename, p.html)
			}));
		}


		private async writeCatalogHTML(outdir: string, indexfile: string, html: string): Promise<any> {
			await fse.ensureDir(outdir);
			await fse.writeFile(path.join(outdir, indexfile), html);
		}



		private recordPublicationError(oid: string, record: Object, err: Error): Observable<any> {
			const branding = sails.config.auth.defaultBrand; 
			// turn off postsave triggers
			sails.log.info(`recording publication error in record metadata`);
			record['metadata']['publication_error'] = "Data publication failed with error: " + err.name + " " + err.message;
			return RecordsService.updateMeta(branding, oid, record, null, true, false);
		}

	}

}

module.exports = new Services.DataPublication().exports();
