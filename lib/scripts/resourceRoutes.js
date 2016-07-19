'use strict';
import express from 'express';
import child_process from 'child_process';
import * as Helper from '../utils/Helper';
import response from '../utils/Response';
import config from '../config';

const fork = child_process.fork;
const router = express.Router();



router.all( '/:resource', function( req, res ) {

	const resource = req.params.resource;

	let event = Helper.createEventsObject( req );

	let executeFunction = () => {
		let http_response_sent = false;

		let child = fork('./lib/scripts/childprocess.js')

		// send the event to the child.
		child.send( event );

		child.on('message', function( action ) {

			// console.log( action );

			if( !action || typeof action !== 'object' ) {
				// console.log('didnt receive an object');
				return;
			}

			if( action.type === 'serverResponse' ) {
				if( ! http_response_sent ) {
					http_response_sent = true;
					res.json( response.custom(action.payload) );
				}
			}


			let contextResponse = ( content, data ) => {
				if ( ! http_response_sent ) {
					http_response_sent = true;
					res.json( response.context( content, data ) );
				}
			}

			if( action.type === 'context_success' ) {
				contextResponse( 'success', action.payload );
			}

			if( action.type === 'context_fail' ) {
				contextResponse( 'failed', action.payload );
			}

			if( action.type === 'context_done' ) {
				contextResponse( 'done', action.payload );
			}


		});



		child.on('exit', function (exitCode) {
			// console.log("Child exited with code: " + exitCode);
		});


	}



	Helper.resourceExists( resource, ( status ) => {
		if( status ) {
			executeFunction();
		} else {
			res.json( response.resource_not_found );
		}
	});


});


module.exports = router;

