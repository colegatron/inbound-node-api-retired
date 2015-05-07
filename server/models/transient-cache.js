var mongoose = require('mongoose');
var moment = require('moment');
var timestamps = require('mongoose-timestamp');


var transientSchema = new mongoose.Schema({

    key: String,
    value: String,
    expire: Date

});

module.exports = mongoose.model('Transient', transientSchema);

/* clear expired transients every hour */
setInterval( function() {

    module.exports.find({
        "expire" :  { $lt: moment().format() }
    }, function( err,  transients ) {

        if (err) {
            console.log({'error': 'db error'});
            console.log(err);
        }

        transients.forEach( function( transient ) {
            console.log('[transients] cleared expired transient: '+transient.key+' ');
            transient.remove();
        });
    });

}, 1000 * 60 * 60);

/* private functions */

function deleteAllTransients() {
    module.exports.find({}).remove().exec();
}

/**/
deleteAllTransients();
/**/