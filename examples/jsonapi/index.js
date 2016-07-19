'use strict';

import request from 'request';

const api_endpoint = 'http://jsonplaceholder.typicode.com';


exports.handler = function( event, context, callback ) {
	let path = ( event.req.query.path ) ? event.req.query.path : '/posts/1';

	request( `${api_endpoint}${path}`, (error, response, body ) => {
		if ( !error && response.statusCode == 200 ) {
			body = JSON.parse(body);
			context.success({ body });
		}
		context.fail({ request: 'failed' });
	});

};

