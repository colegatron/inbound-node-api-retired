var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  async = require('async'),
  Article = mongoose.model('Article'),
  request = require('request'),
  oust = require('oust'),
  phantom = require('phantom'),
  htmlparser = require("htmlparser2");

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {

    var format = req.params.format,
        type = req.params.type;
        url = req.query.url,
        dom = '';
        async.waterfall([
            function(callback){
                 console.log('run step 1');

                 requestLookupData(url, callback);
                 //phantomLookupData(url, callback);
                 //callback(null, links);
            },
            function(dom, callback){
                // arg1 now equals 'one' and arg2 now equals 'two'
                console.log('run step 2');

                parseDom(dom, callback);

                /* Parse Data Here */

                //callback(null, links);
            },
        ], function (err, result) {
            console.log(result);
            if (err) {
              console.log(err);
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  status: 'error',
                  message: err
                })
              );
            } else {
              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  title: 'Hey',
                  message: 'Hello there! looking for : ' + url,
                  result :  result
                })
              );
            }

        });

});

function requestLookupData(url, callback) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('parse dom via require');
        callback(null, body);
      } else {
        callback(error, "ERROR");
      }
    });
}

function phantomLookupData(url, callback) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(url, function (status) {
        console.log("opened " + url, status);

        var dom_to_parse = page.evaluate(function () { return document.body; }, function (result) {
          console.log('parse dom via phantomJS');
          callback(null, result.outerHTML);
        });
      });
    });
  });

}

function parseDom(html, callback){
    social_links = [];
    all_urls = [];
    email = [];
    contact_links = [];
    team_links = [];

    console.log('run oust for stylesheets');
    var hrefs = oust(html, 'stylesheets');
    console.log(hrefs);

    var handler = new htmlparser.DomHandler(function (error, dom) {
            console.log(dom);
    });

    var parser = new htmlparser.Parser({
        onopentag: function(name, attribs) {
            if(name === "a"){
                //console.log('Link');
                //console.log(attribs.href);
                all_urls.push(attribs.href);
                // parse for: twitter.com
                // facebook.com
                // linkedin.com
                // feeds.feedburner
                /* TODO how do I get this out of here */
                var contact_match = /contact/g;
                if (contact_match.test(attribs.href)){
                  contact_links.push(attribs.href);
                }
                var team_match = /team|about/g;
                if (team_match.test(attribs.href)){
                  team_links.push(attribs.href);
                }
                var twitter = /twitter/g;
                if (twitter.test(attribs.href) && attribs.href.toLowerCase().indexOf('twitter.com/share') == -1){
                  social_links.push(attribs.href);
                }
                var fb = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[\w\-]*\/)*?(\/)?([\w\-\.]*)/;
                if( fb.test(attribs.href) ) {
                  social_links.push(attribs.href);
                }

            }
        },
        ontext: function(text){
          if( text === "Developer Friendly"){
            console.log("-->", text);
          }
          is_email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}/;
          if(is_email.test(text)) {
            email.push(text);
          }

        },
        onclosetag: function(tagname){
            if(tagname === "script"){
                //console.log("That's it?!");
            }
        },
        onend: function(){
          //console.log(all_urls);
          console.log('socail');
          console.log(social_links);
          console.log('emails');
          console.log(email);
          console.log(contact_links);
          console.log(team_links);
        },
    });
    //console.log(result.outerHTML);

    //var parser = new htmlparser.Parser(handler);
    //parser.write();
    //parser.done();
    parser.write(html);
    parser.end();
    console.log(team_links);
    console.log('end parse');
    var data = {
      'social_links' : social_links,
      'email' : email,
      'contact_links' : contact_links,
      'team_links' : team_links,
    };

    callback(null, data);
}