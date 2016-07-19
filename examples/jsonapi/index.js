'use strict';

import request from 'request';

const api_endpoint = 'http://jsonplaceholder.typicode.com';


exports.handler = function( event, context, callback ) {

	request( `${api_endpoint}/posts/1`, (error, response, body ) => {
		if ( !error && response.statusCode == 200 ) {
			body = JSON.parse(body);
			context.success({ body });
		}
		context.fail({ request: 'failed' });
	});

};

