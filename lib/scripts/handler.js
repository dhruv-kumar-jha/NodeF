'use strict';

import path from 'path';
import config from '../config';
import response from '../utils/Response';


const parent = ( type, payload ) => {
	process.send({ type, payload });
}

const exitProcess = ( code = 0 ) => {
	process.exit( code );
}




const context = {

	serverResponse: ( data ) => {
		parent( 'serverResponse', data );
	},
	success: ( data = null ) => {
		parent( 'context_success', data );
		exitProcess();
	},
	done: ( error, success ) => {
		parent( 'context_done', { error, success } );
		exitProcess();
	},
	fail: ( data=null ) => {
		parent( 'context_fail', data );
		exitProcess();
	},

	timeout: () => {
		parent( 'context_timeout' );
		exitProcess();
	}

};




// when we receie event from the parent process, start processing...
process.on( 'message', function(data) {
	execute(data);
});




function execute( event ) {

	const resource_path = path.resolve( config.resource_path, event.name );
	let resource = require( resource_path );

	try {
		resource[config.exports_handler]( event, context, context.serverResponse );
	}
	catch( e ) {
		try {
			resource[event.handler]( event, context, context.serverResponse );
		}
		catch(e) {
			context.fail( response.resource_handler_error );
		}
	}

}



if( config.timeout > 0 ) {
	setTimeout(function () {
		context.timeout();
	}, config.timeout );
}


