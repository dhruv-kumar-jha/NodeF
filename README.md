# NodeF

NodeF allows you to run your Node scripts quickly and easily by calling a URL Endpoint, If the name of the endpoint matches any of the file/folder in your resources directory., It will be called and executed.


Your script will run in a **separate process** and will have access to
* The `event` object, the `context` object and the `callback` function.
* You can call the `callback` function anytime, It will return a response back to the client.
* Your code will keep running until you call `context.success()`, `context.fail()` or `context.done()`, If you don't call any of these methods then your script will keep running until it is `timed out`.


<br />
### Installation

For now the best way to use this module is to clone this repository and run `npm install`,
Don't forget to do the same in `examples/jsonapi` folder.

IN FUTURE: you can install this module by running `npm install nodef-app --save`


<br />
### How does this work and What does the code look like?

You create a file and export a **handler** function from it.

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
### Configuration
You can edit the `lib/config/index.js` file and change the configuration according to your needs.

```javascript
{
	'port': 1337, // you can change the port number here.
	'auth': false, // just a placeholder at the moment, doesn't do anything.
	'timeout': 60000, // you can set the timeout here, use 0 if you want to keep the process running forever.
	'auth_token': 'sdjf87096iu4568956ui45yi', // just a placeholder at the moment, doesn't do anything.
	'resource_path': 'examples', // the directory where all the resource files are located
	'exports_handler': 'handler', // name of the handler function that will be called on the resource file.
	'response_object_name': 'response', // name of the response text in the json response sent by the server
}
```


<br />
### The __event__ Object

The event object contains the following data, You can use these data to perform different actions within your scripts and then return the respose accordingly.

```javascript
{
  name: 'resource_name',
  handler: 'handler_name', // only if specified
  req: {
    url: '/helloworld?do=something', // this will contain the value of url path
    method: 'GET', // the method used to make this request
    params: { resource: 'helloworld' }, // route parameters
    query: { do: 'something' }, // all the query parameters
    body: {}, // request body, when a post request is made with data in the request body
  }
}
```



<br />
### The __context__ Object

The context object provides three different methods which you can call to either signify taht the process was completed successfully or if it failed.., or you can just call done.

```javascript
context.success(data)
context.done(error, data)
context.fail(data)
```
> If the response is not already sent to the client when any of these methods are called, A response will be sent back to the client along with the data provided (if any).


<br />
### The **callback** function

You can use this function to send a response back to the client anytime during the execution of your script. This function can be used only once, calling it multiple times won't result in anything.

```javascript
// sample usage
callback({ message: 'success', result: 1234 });
```

<br />
---
<br />

### Exmples folder

The `examples` folder contains three different resources, You can check their source code and see how it works.

### **examples/add.js**

You can access this resource by calling the endpoint http://localhost:1337/add, You can specify the `numbers` parameter either in the url string `?numbers=12,34,56` or in the body `{ numbers: '12,34,56' }` and it will add all these numbers and send the result in the response.

Example usage: http://localhost:1337/add?numbers=2,8,19


### **examples/multiply**

This works similar to `add` resource, except this is a folder and `index.js` file within this folder is called whenever a request is made for this resource.

Example usage: http://localhost:1337/multiply?numbers=10,2,3


### **examples/jsonapi**

This is a node project which has its own `package.json` and `node_modules` folder.

`request` module has been installed as a dependency for this project and whenever this resource is called, It calls the `http://jsonplaceholder.typicode.com/` endpoint and returns the response of this API call back to the client.

Example usage: http://localhost:1337/jsonapi, http://localhost:1337/jsonapi?path=/users

<br />


### Hopefully you have enough details to play around with this module for now., Whenever a new feature is added, this file will be updated.


### Libraries used to make this module:

 * [express-js](https://github.com/expressjs/express) for the API Server
 * [babel](https://github.com/babel/babel) for ES6 syntax throughout the app.
 * [nodemon](https://github.com/remy/nodemon) to Monitor the server and restart automatically.
