var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// See http://mongoosejs.com/docs/schematypes.html

var drinkSchema = new Schema({
	// name: String,
	// name: {type: String, required: true}, // this version requires this field to exist
	// name: {type: String, unique: true}, // this version requires this field to be unique in the db
	location: {
		geo: { type: [Number], index: { type: '2dsphere', sparse: true } },
		name: String
	},	
	drinkLocation : String,
	drinktype: String,
	brandname: String,
	amount: Number,
	unit: String,
	dollarspent: Number,
	timespent: Number,
	occasion: String,
	drinkDate: { type: Date, default: Date.now },
	dateAdded : { type: Date, default: Date.now },
	inebriation : Number
})

// export 'Animal' model so we can interact with it in other files
module.exports = mongoose.model('Drink',drinkSchema);