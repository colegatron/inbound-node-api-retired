/**
 * Middleware designed to communicate with client updater classes'
 * @author Hudson Atwell
 */

var EventEmitter = require('events').EventEmitter
    , vcsurl = require('vcsurl')
    , request = require('request')
    , path = require('path')
    , fs = require('fs-extra')
    , util = require('util')
    , cwd = process.cwd()
    , sortBy = require('sort-by')
    , express = require('express')
    , transient = new require('./../middleware/transients');


/**
 *
 * @param params
 * @param dir
 * @returns {*}
 * @constructor
 */
inboundProInfo = {
    /**
     * get releases from github & build
     * @param callback
     */
    loadInboundPro: function( callback ) {
        this.setupStaticVars();

        /* announce task */
        console.log('[middlewear/plugin-updater] retrieving release data from ' + 'https://api.github.com/repos/'+this.user+'/'+ this.repo +'/releases');


        /* get releases from github */
        inboundProInfo.makeRequest('https://api.github.com/repos/'+this.user+'/'+ this.repo +'/releases' , function( data ) {

            /* sort releases decending */
            inboundProInfo.releases =  JSON.parse(data);
            inboundProInfo.releases.sort(sortBy('-tag_name'));
            //console.log(inboundProInfo.releases);

            /* get latest tag */
            inboundProInfo.latestTag = inboundProInfo.releases[0].tag_name;

            /* generate zip file url */
            inboundProInfo.zipBallURL = inboundProInfo.releases[0].zipball_url;

            /* generate content description from release notes */
            inboundProInfo.sections = {
                description: inboundProInfo.releases[0].body
            }

            /* get tag's commit reference from github - this is used by WordPress's PCLZip for modifying the zip file */
            inboundProInfo.makeRequest('https://api.github.com/repos/'+inboundProInfo.user+'/'+ inboundProInfo.repo +'/git/refs/tags/' + inboundProInfo.latestTag  , function( data ) {
                inboundProInfo.tags =  JSON.parse(data);
                inboundProInfo.releaseReference = inboundProInfo.tags.object.sha;

                /* notify console of the latest release */
                console.log('[middlewear/plugin-updater] serving ' +inboundProInfo.latestTag + ' ('+inboundProInfo.releaseReference+') of inbound-pro.zip' );

                /* download and store zipfile locally */
                console.log('[middlewear/plugin-updater] downloading ' +inboundProInfo.zipBallURL );
                inboundProInfo.makeRequest.call( this, inboundProInfo.zipBallURL , function( file ) {
                    inboundProInfo.processZipFile( file , function() {

                        /* all work is done, perform callback */
                        callback();

                    });
                });

            });





        });
    },

    setupStaticVars: function() {
        inboundProInfo.apiurl =  (require('os').platform() == ( 'win32' || 'darwin' ) ) ? 'http://localhost:3001/api/' : 'http://api.inboundnow.com/api/'
        inboundProInfo.name = 'Inbound Pro'
        inboundProInfo.author = 'Inbound Now'
        inboundProInfo.user = 'inboundnow'
        inboundProInfo.repo = 'inbound-pro'
        inboundProInfo.ref = 'master'
        inboundProInfo.dir = ''
        inboundProInfo._log = []
        inboundProInfo._getZip = false
        inboundProInfo.token = '6a7ef913af068988ccefaef59487ffdb76218d6e'
        inboundProInfo.download_url = inboundProInfo.apiurl + 'pro/zip'
        inboundProInfo.membership_url = 'http://www.inboundnow.com'

    },

    /**
     *  generate json object containing information about pro plugin and create a tranient cache
     * @returns {{name: *, version: *, author: *, download_url: *, sections: *}|*}
     */
    getJsonObject:  function() {

        json =  {
            name: inboundProInfo.name,
            new_version: inboundProInfo.latestTag ,
            author: inboundProInfo.author,
            package: inboundProInfo.download_url ,
            update: inboundProInfo.download_url ,
            url: inboundProInfo.membership_url ,
            sections : inboundProInfo.sections,
            commit_reference : inboundProInfo.releaseReference
        }

        return json;

    },


    /**
     * get the latest tag from tags returned
     * @returns {exports}
     */
    getLatestRelease: function() {

    },

    getSections: function( ) {

    },

    getZipFile: function() {
        inboundProInfo.makeRequest.call( this, inboundProInfo.zipBallURL , inboundProInfo.processZipFile )
        return this;
    },

    processZipFile: function( file , callback ) {

        console.log('[middlewear/plugin-updater] building inbound-pro.zip');

        fs.writeFile("./server/files/inbound-pro.zip", file, function(err) {
            console.log('[middlewear/plugin-updater] inbound-pro.zip created!');
            callback();
        });

    },

    /**
     * Makre request to URL and return response body
     * @param url
     * @param callback
     */
    makeRequest: function( url, callback ) {
        request(
            {
                url: url,
                encoding: null,
                headers: {
                    'user-agent': 'node.js',
                    'Authorization' : 'token ' + inboundProInfo.token
                }
            }, function(err, resp, body) {
                if(err) throw err;
                callback( body );
            }
        )
    }


}

module.exports = inboundProInfo;

/****************************
 * PRIVATE METHODS
 ****************************/



/**
 * Create server loop to rebuild plugin information every 30 minutes
 */
setInterval( function() {
    rebuildPluginData();
} , 1000 * 60 * 30  );

/**
 * Generate first instance of plugin data on server start
 */

rebuildPluginData();


/**
 * method to generate plugin data
 */
function rebuildPluginData() {
    /* announce task */
    console.log('[middlewear/plugin-updater] generating inbound-pro');
    inboundProInfo.loadInboundPro( function() { });
}