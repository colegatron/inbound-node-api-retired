/**
 * Middleware designed to communicate with client updater classes'
 * @author Hudson Atwell
 */

var moment = require('moment');
var Transient = require('./../models/transient-cache');


/**
 *
 * @param params
 * @param dir
 * @returns {*}
 * @constructor
 */
module.exports = function()  {

    /**
     * Get cached json file
     * @returns {*}
     */
    this.getTransient = function( key,  callback ) {

        var transient = Transient.findOne({
            "key": key,
            "expire" :  { $gt: moment().format() }
        }, function(err, transient) {

            if (err) {
                console.log({'error': 'db error'});
                console.log(err);
            }

            if (transient) {
                this.transient = transient;
            } else {
                this.transient = false;
            }

            callback(this.transient);
        })

    };

    /**
     * create cached json file
     * @param OBJECT data
     */
    this.createTransient = function( key ,  value) {

        console.log('[transients]['+key+'][expires:'+moment().add( 30 , 'minute' ).format()+']' + JSON.stringify(value) );
        var transient = new Transient({
            'key' : key ,
            'expire' : moment().add( 30 , 'minute' ).format(),
            'value' : JSON.stringify(value)
        });

        transient.save(function(err) {
            if (err) {
                console.log('{ error: \'Cannot save the transient\'}');
            }
        });
    };


}


/****************************
 * PRIVATE METHODS
 ****************************/

