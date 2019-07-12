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

// NOTE: the publication isn't being triggered if you go straight to review
// from a new data pub



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

   			sails.log.debug("Called exportDataset on update");
      	sails.log.debug("oid: " + oid);
      	sails.log.debug("options: " + JSON.stringify(options));
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
					sails.log.debug(JSON.stringify(record));
					return Observable.of(null)
				}

				// start an Observable to get/initialise the repository, then call createNewObjectContent
				// content on it with a callback which will actually write out the attachments and
				// make a datacrate. Once that's done, updates the URL in the data record.

				// the interplay between Promises and Observables here is too convoluted and needs
				// refactoring.

				//sails.log.debug("Bailing out before actually writing data pub");
				//return Observable.of(null);

				const creator = { email: "Place.Holder@uts.edu.au" };

				sails.log.debug("Got user: " + JSON.stringify(user));

				if( ! user || user['email'] ) {
					user = { 'email': 'User.not.found@uts.edu.au' };
				}

				return Observable.fromPromise(this.getRepository(options['site']))
					.flatMap((repository) => {
						return Observable.fromPromise(repository.createNewObjectContent(oid, async (dir) => {
							sails.log.debug(`Writing dataset for ${oid} in ${dir}`);
							await this.writeDataset(creator, user, oid, drid, md, dir);
							sails.log.debug("Finished writing dataset");
						})).flatMap(() => {
							return this.updateUrl(oid, record, site['url']);
						});
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
 			sails.log.debug(`getRepository for ${site}`)
  		if(! sails.config.datapubs.sites[site] ) {
				sails.log.error(`unknown site ${site}`);
				throw(new Error("unknown repostitory site " + site));
  		} else {
  			const dir = sails.config.datapubs.sites[site].dir;
 				const repository = new ocfl.Repository();
  		  sails.log.debug(`Newly created repositor = ${JSON.stringify(repository)}`);
  			try {
  		    sails.log.debug(`Trying to load existing repository from ${dir}`);
  		    sails.log.debug(`repo = ${JSON.stringify(repository)}`);
  				await repository.load(dir);
  		    sails.log.debug(`load was successful`);
  				return repository;
  			} catch(e) {
  			  sails.log.debug(`Couldn't load existing repository from ${dir}`);
  		    sails.log.debug(`repo = ${JSON.stringify(repository)}`);
  				try {
  					const newrepo = new ocfl.Repository();
  			    sails.log.debug(`Trying to creating new repository at ${dir}`);
  			    await fse.ensureDir(dir);
  					await newrepo.create(dir);
  			    sails.log.debug(`Repository created at ${dir}`);
  					return newrepo;
  				} catch(e) {
  					sails.log.error("Could neither load nor initialise repo at " + dir);
  		    	sails.log.debug(`repo = ${JSON.stringify(repository)}`);
  					throw(e);
  				}
  			}
  		}
  	}

  	// returns an Observable which looks up the record's creator

  	private getRecordCreator(record): Observable<any> {
  		return UsersService.getUserWithUsername(record['metaMetadata']['createdBy'])
  			.flatMap((user) => {
  				sails.log.debug("Got user: " + JSON.stringify(user));
  				return user;
  			});
  	}


  	// async function which takes a data publication and destination directory
  	// and writes out the attachments and datacrate files to it

    // based on the original exportDataset - takes the existing Observable chain
    // and converts it to a promise so that it can work with the ocfl library

		private async writeDataset(creator: Object, approver: Object, oid: string, drid: string, metadata: Object, dir: string): Promise<any> {

			const mdOnly = metadata['accessRightsToggle'];

			const attachments = metadata['dataLocations'].filter(
				(a) => ( a['type'] === 'attachment' )
			);

			const obs = attachments.map((a) => {
				sails.log.debug("Building attachment observable " + a['name']);
				return RecordsService.getDatastream(drid, a['fileId']).
					flatMap(ds => {
						if( a['selected'] && !mdOnly ) {
							const filename = path.join(dir, a['name']);
							sails.log.debug("Made promise to write attachment " + filename);
							return Observable.fromPromise(this.writeAttachment(ds.body, filename));
						} else {
							sails.log.debug("Made Observable that returns true to skip attachment " + a['name]']);
							return Observable.of(true);
						}
					});
			});
	
			obs.push(this.makeDataCrate(creator, approver, oid, dir, metadata));
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
		// doesnt' work.

		private async writeAttachment(buffer: Buffer, fn: string): Promise<boolean> {
			return new Promise<boolean>( ( resolve, reject ) => {
				try {
					fs.writeFile(fn, buffer, () => {
						sails.log.debug("Just wrote attachment to " + fn);
						resolve(true)
					});
				} catch(e) {
					sails.log.error("attachment write error");
					sails.log.error(e.name);
					sails.log.error(e.message);
					reject;
				}
			});
		}


		private makeDataCrate(creator: Object, approver: Object, oid: string, dir: string, metadata: Object): Observable<any> {

			const index = new Index();

			return Observable.of({})
				.flatMap(() => {
					return Observable.fromPromise(datacrate.datapub2catalog({
						'id': oid,
						'datapub': metadata,
						'organisation': sails.config.datapubs.datacrate.organization,
						'owner': creator['email'],
						'approver': approver['email']
					}))
				}).flatMap(async (catalog) => {

					const catalog_json = path.join(dir, sails.config.datapubs.datacrate.catalog_json);
					await fs.writeFile(catalog_json, JSON.stringify(catalog, null, 2));

					index.init_pure({
						catalog_json: catalog,
						multiple_files: true
					});

					const template_ejs = await index.load_template();

					
					return index.make_index_pure("text_citation", "zip_path");
				}).flatMap(async (pages) => {
					const html_filename = index.html_file_name;
					return Observable.merge(pages.map((p) => {
						const outdir = path.join(dir, p.path);
						sails.log.debug(`Writing catalog file to ${outdir}/${html_filename}`);
						return Observable.fromPromise(this.writeCatalogHTML(outdir, html_filename, p.html))
					}))
				}).catch(error => {
					sails.log.error("Error (outside) while creating DataCrate");
					sails.log.error(error.name);
					sails.log.error(error.message);
					sails.log.error(error.stack);
					return Observable.of({});
				});
		}

		private async writeCatalogHTML(outdir: string, indexfile: string, html: string): Promise<any> {
			await fse.ensureDir(outdir);
			await fse.writeFile(path.join(outdir, indexfile), html);
		}


		private updateUrl(oid: string, record: Object, baseUrl: string): Observable<any> {
			const branding = sails.config.auth.defaultBrand; 
			record['metadata']['citation_url'] = baseUrl + '/' + oid + '/';
			// turn off postsave triggers
			sails.log.debug(`Updating citation_url to ${record['metadata']['citation_url']}`);
			return RecordsService.updateMeta(branding, oid, record, null, true, false);
		}

		private recordPublicationError(oid: string, record: Object, err: Error): Observable<any> {
			const branding = sails.config.auth.defaultBrand; 
			// turn off postsave triggers
			sails.log.debug(`recording publication error in record metadata`);
			record['metadata']['publication_error'] = "Data publication failed with error: " + err.name + " " + err.message;
			return RecordsService.updateMeta(branding, oid, record, null, true, false);
		}




	}

}

module.exports = new Services.DataPublication().exports();
