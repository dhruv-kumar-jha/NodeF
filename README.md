# NodeF

NodeF allows you to run your Node scripts quickly and easily by calling a URL Endpoint, If the name of the endpoint matches any of the file/folder in your resources directory., It will be called and executed.


Your script will run in a **separate process** and will have access to
* The `event` object, the `context` object and the `callback` function.
* You can call the `callback` function anytime, It will return a response back to the client.
* Your code will keep running until you call `context.success()`, `context.fail()` or `context.done()`, If you don't call any of these methods then your script will keep running until it `times out`.


### How does this work and What does the code look like?

You create a file and export a handler function from it.

In this example we will create a file named `addnumbers.js`, This file will add all the numbers it receives and return the result as a response to the client.
This file will be accessible at `http://localhost:1337/addnumbers`

```javascript
exports.handler = function( event, context, callback ) {
	let numbers = event.req.body.numbers || event.req.query.numbers || 0;

	if( ! numbers ) {
        // this returns a response back to the client
		callback({ message: 'you must provide atleast one number.' });
		
        // this actually stops the scripts execution. if you don't use callback, the messge specified here
        // will be returned to the client.
        context.fail('numbers not provided.');
	}

	let total = 0;
	let split = numbers.split(',');
	for ( var i = 0; i < split.length; i++) {
		total = total + parseInt( split[i] );
	}

	// we have performed the operation successfully, now we send the response back to the client.
	callback({ resource: event.name, execution: 'success', result: total });


	// Even though the response has already been sent and the client has received the response
    // the process is still running and we can do further processing.
    
    // after everything is done, we call this method, this will stop the process
    // and also return a response back to the client if not already sent.
    context.success();

};
```

<br />
### Documentation.
More documentation and other details will be added soon.
<br />



### Libraries used to make this module:

 * [express-js](https://github.com/expressjs/express) for the API Server
 * [babel](https://github.com/babel/babel) for ES6 syntax throughout the app.
 * [nodemon](https://github.com/remy/nodemon) to Monitor the server and restart automatically.
