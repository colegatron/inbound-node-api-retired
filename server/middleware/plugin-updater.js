/**
 * Middleware designed to communicate with client updater classes'
 * @author Hudson Atwell
 */

var EventEmitter = require('events').EventEmitter
  , vcsurl = require('vcsurl')
  , request = require('request')
  , path = require('path')
  , fs = require('fs-extra')
  , moment = require('moment')
  , AdmZip = require('adm-zip')
  , util = require('util')
  , cwd = process.cwd()
  , Transient = require('./../models/transient-cache');


/**
 *
 * @param params
 * @param dir
 * @returns {*}
 * @constructor
 */
module.exports = function()  {

    this.setupStaticVars = function() {
        this.name = 'Inbound Pro',
        this.author = 'Inbound Now',
        this.user = 'inboundnow'
        this.repo = 'inbound-pro'
        this.ref = 'master'
        this.dir = ''
        this._log = []
        this._getZip = false
        this.token = '6a7ef913af068988ccefaef59487ffdb76218d6e'

        return this;
    };

    /**
     *  generate json object containing information about pro plugin and create a tranient cache
     * @returns {{name: *, version: *, author: *, download_url: *, sections: *}|*}
     */
    this.getJSON = function() {

        json =  {
            name: this.name,
            version: this.version ,
            author: this.author,
            download_url: this.download_url ,
            sections : this.sections
        }

        this.createTransient( json );

        return json;


    };

    /**
     * Get cached json file
     * @returns {*}
     */
    this.getTransient = function( callback ) {

        var transient = Transient.findOne({
            "key": 'proPluginJson',
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

        return this;
    };

    /**
     * create cached json file
     * @param json
     */
    this.createTransient = function( json) {

        console.log('[transients] creating transient of json data for Inbound Pro\'s updater class. expires in 30 minutes.');
        var transient = new Transient({
            'key' : 'proPluginJson',
            'expire' : moment().add( 30 , 'minute' ).format(),
            'value' : JSON.stringify(json)
        });

        transient.save(function(err) {
            if (err) {
                console.log('{ error: \'Cannot save the transient\'}');
            }
        });
    };

    /**
     * get tags from inbound-pro
     * @returns {exports}
     */
    this.getTags = function() {
        makeRequest.call( this, 'https://api.github.com/repos/'+this.user+'/'+ this.repo +'/releases' , function( data ) {
            console.log( data )
        });
        return this;
    };

    /**
     * get the latest tag from tags returned
     * @returns {exports}
     */
    this.getLatestTag = function() {
       this.version = '1.0.1'
       return this;
    };

    this.getDownloadURL = function() {
       this.download_url = 'http://example.com/plugins/my-cool-plugin.zip'
       return this;
    };

    this.getSections = function() {
        this.sections =  {
            sections: {
                description: 'Description about Inbound Pro Here!'
            }
        }
        return this;
    };

    this.getZip = function() {

        dir = dir || process.cwd()
        /* get zip file */
        makeRequest.call( this, 'https://api.github.com/repos/'+this.user+'/'+ this.repo +'/zipball', processZipFile )

    };

    this.processZipFile = function( file ) {
        console.log('https://api.github.com/repos/'+this.user+'/'+this.repo+'/zipball');
        console.log(file);
    };

    this.makeRequest = function( url, callback ) {
        request(
            {
                url: url,
                headers: {
                    'user-agent': 'node.js',
                    'Authorization' : 'token ' + this.token
                }
            }, function(err, resp, body) {
                console.log(err);
                console.log(resp);
                console.log(body);
            }
        )
    };

}


/****************************
 * PRIVATE METHODS
 ****************************/



function downloadZip() {
  var _this = this;
  if (_this._getZip) return;
  _this._getZip = true

  _this._log.forEach(function(file) {
    fs.remove(file)
  })

  var tmpdir = generateTempDir()
    , zipBaseDir = _this.repo + '-' + _this.ref
    , zipFile = path.join(tmpdir, zipBaseDir + '.zip')

  var zipUrl = "https://nodeload.github.com/" + _this.user + "/" + _this.repo + "/zip/" + _this.ref
  _this.emit('zip', zipUrl)

  //console.log(zipUrl)
  fs.mkdir(tmpdir, function (err) {
    if (err) _this.emit('error', err)
    request.get(zipUrl).pipe(fs.createWriteStream(zipFile)).on('close', function() {
      //fs.createReadStream(zipFile).pipe(unzip.Extract({path: tmpdir})).on('close', function() {
      extractZip.call(_this, zipFile, tmpdir, function() {
        var oldPath = path.join(tmpdir, zipBaseDir)
        //console.log(oldPath)
        fs.rename(oldPath, _this.dir, function(err) {
          if (err) _this.emit('error', err)
          fs.remove(tmpdir, function(err) {
            if (err) _this.emit('error', err)
            _this.emit('end')
          })
        })
      })
    })
  })

}

function generateTempDir () {
  return path.join(cwd, Date.now().toString() + '-' + Math.random().toString().substring(2))
}

function extractZip (zipFile, outputDir, callback) {
  var zip = new AdmZip(zipFile)
    , entries = zip.getEntries()
    , pending = entries.length
    , _this = this

  function checkDone (err) {
    if (err) _this.emit('error', err)
    pending -= 1
    if (pending === 0) callback()
  }

  entries.forEach(function(entry) {
    if (entry.isDirectory) return checkDone()

    var file = path.resolve(outputDir, entry.entryName)
    fs.outputFile(file, entry.getData(), checkDone)
  })
}





