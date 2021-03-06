'use strict';


exports.handler = function( event, context, callback ) {

	let numbers = event.req.body.numbers || event.req.query.numbers || 0;
	let num = [];

	if( ! numbers ) {
		callback({ message: 'you must specify numbers.' });
		context.fail('numbers not provided.');
	}

	let total = 1;

	let split = numbers.split(',');
	for ( var i = 0; i < split.length; i++) {
		let number = parseInt( split[i].replace(/\s/g, "") );
		num.push(number);
		total = total * number;
	}

	context.success({
		resource: event.name,
		numbers: num,
		result: total
	});

};

