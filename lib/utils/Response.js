'use strict';

import config from '../config';

const response_object_name = config.response_object_name;


export default {

	default: {
		code: 200,
		message: 'server says hi',
	},

	custom: ( data ) => {
		let response = {
			code: 200
		};
		response[response_object_name] = data;

		return response;
	},


	context: ( context,  data ) => {
		let response = {
			code: 200,
			context: context,
		};
		response[response_object_name] = data;

		return response;
	},


	timeout: {
		code: 200,
		message: 'failed',
		description: 'this request was timedout.',
	},


	error: {
		code: 500,
		message: 'error',
	},

	resource_not_found: {
		code: 404,
		message: 'the resource you called doesn\'t exist or you don\'t have permission(s) to access it.',
	},


	resource_handler_error: {
		code: 400,
		message: 'resource execution failed',
		description: 'the provided handler doesn\'t exist'
	},


};

