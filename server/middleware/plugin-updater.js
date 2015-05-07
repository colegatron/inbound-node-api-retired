/**
 * Middleware designed to communicate with client updater classes'
 * @author Hudson Atwell
 */

var EventEmitter = require('events').EventEmitter
  , vcsurl = require('vcsurl')
  , request = require('request')
  , path = require('path')
  , fs = require('fs-extra')
  , AdmZip = require('adm-zip')
  , util = require('util')
  , cwd = process.cwd()
  , sortBy = require('sort-by')
  , transient = new require('./../middleware/transients');

/* instanstiate */
Transient = new transient;

/**
 *
 * @param params
 * @param dir
 * @returns {*}
 * @constructor
 */
inboundProInfo = {

    loadReleases: function( callback ) {
        this.setupStaticVars();
        this.makeRequest('https://api.github.com/repos/'+this.user+'/'+ this.repo +'/releases' , function( data ) {
            inboundProInfo.releases =  JSON.parse(data);
            inboundProInfo.getLatestRelease();
            inboundProInfo.getSections();
            callback();
        });
    },

    setupStaticVars: function() {
        inboundProInfo.name = 'Inbound Pro',
        inboundProInfo.author = 'Inbound Now',
        inboundProInfo.user = 'inboundnow'
        inboundProInfo.repo = 'inbound-pro'
        inboundProInfo.ref = 'master'
        inboundProInfo.dir = ''
        inboundProInfo._log = []
        inboundProInfo._getZip = false
        inboundProInfo.token = '6a7ef913af068988ccefaef59487ffdb76218d6e'
        inboundProInfo.download_url = 'http://api.inboundnow.com/api/pro/get'

    },

    /**
     *  generate json object containing information about pro plugin and create a tranient cache
     * @returns {{name: *, version: *, author: *, download_url: *, sections: *}|*}
     */
    getJsonObject:  function() {

        json =  {
            name: inboundProInfo.name,
            version: inboundProInfo.latestTag ,
            author: inboundProInfo.author,
            download_url: inboundProInfo.download_url ,
            sections : inboundProInfo.sections
        }

        Transient.createTransient( 'proInfo' , json );

        return json;


    },


    /**
     * get the latest tag from tags returned
     * @returns {exports}
     */
    getLatestRelease: function() {
        inboundProInfo.releases.sort(sortBy('-tag_name'));
        inboundProInfo.latestTag = inboundProInfo.releases[0].tag_name;
        inboundProInfo.zipBallURL = inboundProInfo.releases[0].zipball_url;
    },

    getSections: function( ) {
        inboundProInfo.sections =  {
            sections: {
                description: 'Description about Inbound Pro Here!'
            }
        }
    },

    getZipFile: function() {
        inboundProInfo.makeRequest.call( this, inboundProInfo.zipBallURL , inboundProInfo.processZipFile )
        return this;
    },

    processZipFile: function( file ) {
        var zip = new AdmZip();
        console.log(file);
        // zip.addFile("./../files/inbound-pro.zip", new Buffer( file ), "comment here");

    },

    makeRequest: function( url, callback ) {
        request(
            {
                url: url,
                headers: {
                    'user-agent': 'node.js',
                    'Authorization' : 'token ' + inboundProInfo.token
                }
            }, function(err, resp, body) {
                callback( body );
            }
        )
    },

    downloadZip: function() {


        fs.mkdir(tmpdir, function (err) {

            if (err) _inboundProInfo.emit('error', err)

            request.get( inboundProInfo.zipBallURL ).pipe(fs.createWriteStream(zipFile)).on('close', function() {

                inboundProInfo.extractZip.call(_this, inboundProInfo.zipBallURL, tmpdir, function() {

                    var oldPath = path.join(tmpdir, zipBaseDir)

                    fs.rename(oldPath, 'files', function(err) {
                        if (err) _inboundProInfo.emit('error', err)
                        fs.remove(tmpdir, function(err) {
                            if (err) _inboundProInfo.emit('error', err)
                            _inboundProInfo.emit('end')
                        })
                    })

                })
            })
        })
    },

    extractZip: function(zipFile, outputDir, callback) {
        var zip = new AdmZip(zipFile)
            , entries = zip.getEntries()
            , pending = entries.length
            , _this = this

        function checkDone (err) {
            if (err) _inboundProInfo.emit('error', err)
            pending -= 1
            if (pending === 0) callback()
        }

        entries.forEach(function(entry) {
            if (entry.isDirectory) return checkDone()

            var file = path.resolve(outputDir, entry.entryName)
            fs.outputFile(file, entry.getData(), checkDone)
        })
    },



}

module.exports = inboundProInfo;

/****************************
 * PRIVATE METHODS
 ****************************/



/**
 * Testing grounds
 */

inboundProInfo.loadReleases( function() {
    //console.log(inboundProInfo.getJsonObject())

});
