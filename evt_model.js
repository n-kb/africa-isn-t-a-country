var mongoose = require('mongoose');


// Schema for the data in the API
var Schema = mongoose.Schema;  

var evtSchema = new Schema({  
    brand: { type: String, required: true },
    startdate: { type: Date, required: true },
    amount_Africa: { type: Number, required: true },
    proportion_Africa: { type: Number, required: true },
    amount_Asia: { type: Number, required: true },
    proportion_Asia: { type: Number, required: true }
});

evtSchema.index( { "brand": 1, "startdate": 1 },  { unique: true } );

module.exports = mongoose.model('evts', evtSchema);