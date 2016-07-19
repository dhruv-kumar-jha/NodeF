'use strict';
import fs from 'fs';
import path from 'path';
import config from '../config';


export function resourceExists( resource, callback ) {
	const resource_location_file = path.resolve( config.resource_path, resource + '.js' );
	const resource_location_dir = path.resolve( config.resource_path, resource );

	let checkIfFileExists = ( err, data ) => {
		if( err ) {
			callback( false );
		} else {
			callback( true );
		}
	}

	fs.stat( resource_location_file, ( err, data ) => {
		if( err ) {
			fs.stat( resource_location_dir, checkIfFileExists );
		} else {
			callback( true );
		}
	});

}





export function createEventsObject( req ) {

	return {
		name: req.params.resource,
		handler: req.query.handler,
		req: {
			url: req.url,
			method: req.method,
			params: req.params,
			query: req.query,
			body: req.body,
		}
	};

}








