'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import resourceRoutes from './scripts/resourceRoutes';
import config from './config';
import response from './utils/Response';


let app = express();
app.set( 'port', process.env.PORT || config.port );
app.use( bodyParser.json() );
app.disable('x-powered-by');



app.get('/', function(req, res) {
	res.json( response.default );
});

// those damn favicon requests....
app.get( '/favicon.ico', function(req, res) { res.sendStatus(200); });


app.use( resourceRoutes );


// lets start the server.
let server = app.listen( app.get('port'), () => {
	const port = server.address().port;
	console.log('NodeF listening at http://localhost:%s', port);
});

