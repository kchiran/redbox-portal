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
import ofcl = require('ofcl');


import { Index, jsonld } from 'calcyte';
const datacrate = require('datacrate').catalog;

declare var sails: Sails;
declare var RecordsService;
declare var BrandingService;
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

  	public exportDataset(oid, record, options): Observable<any> {
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

				sails.log.debug("Got data record: " + drid);

				// start an Observable to get/initialise the repository, then call createNewObjectContent
				// content on it with a callback which will actually write out the attachments and
				// make a datacrate. Once that's done, updates the URL in the data record.

				// the interplay between Promises and Observables here is too convoluted and needs
				// refactoring.

				return this.getRepository(options['site'])
					.flatMap((repository) => {
						return Observable.fromPromise(repository.createNewObjectContent(oid, async (dir) => {
							await this.writeDataCrate(md, dir)
						}
					}).flatMap(() => {
						return this.updateUrl(oid, record, site['url']);
					});

    	} else {
//     		sails.log.info(`Not sending for: ${oid}, condition not met: ${_.get(options, "triggerCondition", "")}`);
    		return Observable.of(null);
   		}
  	}


  	// this initialises the repository if it can't load it, which
  	// is a bit rough and ready. FIXME - this should be done in 
  	// deployment or at least bootstrapping the server

  	public getRepository(site): Observable<any> {
  		return Observable.fromPromise(new Promise<any>((resolve, reject) => {
  			if(! sails.config.datapubs.sites[site] ) {
					sails.log.error(`unknown site ${site}`);
					reject();
  			} else {
  				const dir = sails.config.datapubs.sites[site].dir;
 					const repository = new ocfl.repository();
  				try {
  					repository.load(dir);
  					resolve(repository);
  				} catch(e) {
  					try { 
  						repository.create(dir);
  						resolve(repository);
  					}
  				}
  			}
  		})).catch(err => {
				sails.log.error("Error initialising repository for " + site);
				sails.log.error(err.name);
				sails.log.error(err.message);
        return new Observable();
			});
  	} 


  	// async function which takes a data publication and destination directory
  	// and writes out the attachments and datacrate files to it

    private async writeDataCrate(metadata: Object, dir: string): Promise<any> {


    }




		private async writeAttachments(drid: string, dir: string; attachments: Object[]): Promise<any> {
				sails.log.debug("Going to write attachments");

				// build a list of observables, each of which loads and writes out an
				// attachment


				const attachments = md['dataLocations'].filter(
					(a) => a['type'] === 'attachment'
				);

				const attach_obs = attachments.map((a) => {
					sails.log.debug("building attachment observable " + a['name']);
					return RecordsService.getDatastream(drid, a['fileId']).
						flatMap(ds => {
							const filename = path.join(dir, a['name']);
							sails.log.debug("about to write " + filename);
							return Observable.fromPromise(this.writeData(ds.body, filename))
								.catch(err => {
									sails.log.error("Error writing attachment " + a['fileId']);
									sails.log.error(err.name);
									sails.log.error(err.message);
                  return new Observable();
								});
						});
				});

				


				obs.push(this.makeDataCrate(oid, dir, md));



			for( const a of attachments ) {
				const buffer = await this.getDatastream(drid, a['fileId']);
				await fse.writeFile()
			}	
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

		private async writeData(buffer: Buffer, fn: string): Promise<boolean> {
			return new Promise<boolean>( ( resolve, reject ) => {
				try {
					fs.writeFile(fn, buffer, () => {
						sails.log.debug("wrote to " + fn);
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




		private updateUrl(oid: string, record: Object, baseUrl: string): Observable<any> {
			const branding = sails.config.auth.defaultBrand; // fix me
			// Note: the trailing slash on the URL is here to stop nginx auto-redirecting
			// it, which on localhost:8080 breaks the link in some browsers - see 
			// https://serverfault.com/questions/759762/how-to-stop-nginx-301-auto-redirect-when-trailing-slash-is-not-in-uri/812461#812461
			record['metadata']['citation_url'] = baseUrl + '/' + oid + '/';
			return RecordsService.updateMeta(branding, oid, record);
		}


		private async writeCatalogHTML(outdir: string, indexfile: string, html: string): Promise<any> {
			sails.log.debug(`Writing HTML to ${outdir} / ${indexfile}`);
			await fse.ensureDir(outdir);
			await fse.writeFile(path.join(outdir, indexfile), html);
		}


		private makeDataCrate(oid: string, dir: string, metadata: Object): Observable<any> {

			const owner = 'TODO@shouldnt.the.owner.come.from.the.datapub';
			const approver = 'TODO@get.the.logged-in.user';
			const index = new Index();

			return Observable.of({})
				.flatMap(() => {
					return Observable.fromPromise(datacrate.datapub2catalog({
						'id': oid,
						'datapub': metadata,
						'organisation': sails.config.datapubs.datacrate.organization,
						'owner': owner,
						'approver': approver
					}))
				}).flatMap(async (catalog) => {

					const catalog_json = path.join(dir, sails.config.datapubs.datacrate.catalog_json);
					await fs.writeFile(catalog_json, JSON.stringify(catalog, null, 2));

					index.init_pure({
						catalog_json: catalog,
						multiple_files: true
					});

					const template_ejs = await index.load_template();

					sails.log.debug(`Writing CATALOG.html`);
					
					return index.make_index_pure("text_citation", "zip_path");
				}).flatMap(async (pages) => {
					const html_filename = index.html_file_name;
					return Observable.merge(pages.map((p) => {
						const outdir = path.join(dir, p.path);
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
	}
}

module.exports = new Services.DataPublication().exports();
