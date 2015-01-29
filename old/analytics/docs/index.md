
# Jax Analytics

## API endpoints 

### POST /api/license_key

Before you can start sending and querying events, you have to add {license key => [domains]} pair into system.
This key-value pair will be used to authenticate all incoming events. To demonstrate how authentication works
we need to files: `event.json` (event example) and `license.json` (body for POST request)

File `event.json` should contain event like this:

     {
         "license_key" : "6ee7f16ef224e0ba13a22de8e2be2bb8",
         "wordpress_url" : "http://inboundsoon.dev",
         "content_id" : "95897",
         "lead_id" : "95901",
         "lead_uid" : "Z6ATMIGrPooZ0nWT2hoxS1MqA12XqPDCdSg",
         "event_type" : "form_submission"
     }

File `license.json`:

    {
        "access_token": "gE216KPqDIjGxu6uSTpO",
        "license_key": "6ee7f16ef224e0ba13a22de8e2be2bb8",
        "domains": ["http://inboundsoon.dev"]
    }

`access_token` should be equal to **master token**(superuser access level), `license_key` is random string and
`domains` is array of string. As you can see, they correspond  to what we wrote in `events.json`.

Event creation will be described in next section, this is just example of how authentication looks like.
If we try to add new event with unregistered license key or domain we will get an error:

    $ curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST http://127.0.0.1:8080/api/events -d @event.json
    < HTTP/1.1 401 Unauthorized
    < Content-Type: text/html; charset=utf-8
    Authentication error

That how we can create new license key in Jax:

    $ curl -v -H "Content-type: application/json" -X POST  http://127.0.0.1:8080/api/license_key -d @license.json
    < HTTP/1.1 200 OK
    < Content-Type: text/html; charset=utf-8
    OK

The same request should succeed now:

    $ curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST http://127.0.0.1:8080/api/events -d @event.json
    < HTTP/1.1 200 OK
    < Content-Type: text/html; charset=utf-8
    OK


### GET/POST /api/events

New event can be sent with POST or GET requests. Events should be JSON-encoded in body in case of POST, and 
url-encoded in case of GET request. See example below:
 
    (POST)$ curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST http://127.0.0.1:8080/api/events -d @event.json
    (GET) http://127.0.0.1:8080/api/events?license_key=6ee7f16ef224e0ba13a22de8e2be2bb8&wordpress_url=http%3D%2F%2Finboundsoon.dev&content_id=95897&lead_id=95901&lead_uid=Z6ATMIGrPooZ0nWT2hoxS1MqA12XqPDCdSg&event_type=form_submission

File `event.json` was introduced in previous section. API should respond with `200` status code.

Note that you don't have to attach date to events before sending them to the server. Field `dt` will be added to all events 
before saving them to database. `dt` will contain current server time in UTC.

#### Event validation

Each event is validated against predefined schema before saving in database. If event doesn't match the schema
API will return you an array of errors, like this:

    $ curl -v -H "Accept: application/json" -H "Content-type: application/json" -X POST  http://127.0.0.1:8080/api/events -d '{}'
    < HTTP/1.1 400 Bad Request
    < X-Powered-By: Express
    < Content-Type: application/json; charset=utf-8
    < Content-Length: 433
    < Date: Sun, 13 Jul 2014 15:38:45 GMT
    < Connection: keep-alive
    <
    [
      {
        "instanceContext": "#",
        "resolutionScope": "anon-schema://f50104f4f42e90266d57423d4849e309d0b72106/#",
        "constraintName": "required",
        "constraintValue": [
          "license_key",
          "wordpress_url",
          "content_id",
          "lead_id",
          "lead_uid",
          "event_type",
          "dt"
        ],
        "desc": "missing: license_key,wordpress_url,content_id,lead_id,lead_uid,event_type",
        "kind": "ObjectValidationError"
      }


### GET /api/count_events

This is simple aggregation request which will only return you total number of all events for particular license key and date range.
Here is request params that is available for this endpoint:

  * license_key - (required) filter events by license key
  * skip - (optional) skip first N days, positive number > 0, default is 0
  * per_days - (optional) return data of that N days, positive number > 0, default is 7
  * lead_id -  (optional) additional filtering by lead ID
  * content_id -  (optional) additional filtering by content ID

Examples:

    GET http://127.0.0.1:8080/api/count_events?license_key=6ee7f16ef224e0ba13a22de8e2be2bb8
    {count_events: 11}

    GET http://127.0.0.1:8080/api/list_events?license_key=6ee7f16ef224e0ba13a22de8e2be2bb8&skip=1&content_id=95897&lead_id=95901
    {count_events: 3}

**UPD.** `license_key` is not required for requests with *master token*:

    curl  http://127.0.0.1:8080/api/count_events?access_token=gE216KPqDIjGxu6uSTpO
    curl  http://127.0.0.1:8080/api/list_events?access_token=gE216KPqDIjGxu6uSTpO

In this case all other params are optional.

### GET /api/list_events

Using this endpoint you can list events. Request params are similar to `GET /api/count_events`, but this API call return
array of objects instead of single number. Events will be returned in reverse order of their creation. Newer events will come first.

Examples:

    GET http://127.0.0.1:8080/api/list_events?license_key=6ee7f16ef224e0ba13a22de8e2be2bb8
    GET http://127.0.0.1:8080/api/list_events?license_key=6ee7f16ef224e0ba13a22de8e2be2bb8&skip=1&content_id=95897&lead_id=95901

## Database schema

Here is couple examples of events, that will be stored in MongoDB's `events` collection:

    {
        "_id" : ObjectId("53b379d90df839abcdbe3a7c"),
        "license_key" : "6ee7f16ef224e0ba13a22de8e2be2bb8",
        "wordpress_url" : "http://inboundsoon.dev",
        "content_id" : "95897",
        "lead_id" : "95901",
        "lead_uid" : "Z6ATMIGrPooZ0nWT2hoxS1MqA12XqPDCdSg",
        "event_type" : "form_submission",
        "dt" : ISODate("2014-07-02T07:00:00Z")
    }
    {
        "_id" : ObjectId("53b379e60df839abcdbe3a7d"),
        "license_key" : "6ee7f16ef224e0ba13a22de8e2be2bb8",
        "wordpress_url" : "http://inboundsoon.dev",
        "content_id" : "95897",
        "lead_id" : "95901",
        "lead_uid" : "Z6ATMIGrPooZ0nWT2hoxS1MqA12XqPDCdSg",
        "event_type" : "page_view",
        "dt" : ISODate("2014-07-02T08:00:00Z")
    }


There is an index on `license_key` and `dt` to optimize queries:

    > db.events.getIndexes()
    [
        {
            "v" : 1,
            "key" : {
                "_id" : 1
            },
            "name" : "_id_",
            "ns" : "jax.events"
        },
        {
            "v" : 1,
            "key" : {
                "license_key" : 1,
                "dt" : 1
            },
            "name" : "license_key_1_dt_1",
            "ns" : "jax.events"
        }
    ]

During startup, application will ensure that this index is presented.


## Authentication with JSON Web Tokens

For testing purpose there is only one valid user with username `admin` and password `123`.

Obtaining token with incorrect credentials:

    $ curl -v -H "username: admin" -H "password: qwerty" -X POST http://127.0.0.1:8080/token
    < HTTP/1.1 401 Unauthorized
    < Content-Type: text/html; charset=utf-8
    Authentication error

Obtaining token with correct credentials:

    $ curl -v -H "username: admin" -H "password: 123" -X POST http://127.0.0.1:8080/token
    < HTTP/1.1 200 OK
    < Content-Type: application/json; charset=utf-8
    {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhZG1pbiIsImV4cCI6MTQwNjA1OTE1NDM2OH0.PTv-pDDfdZlw4LuH_62ey62qi7z1mfqOvbj_kg7MO3U",
      "expires": 1406059154368
    }

Authentication is required for `/ping/jwt`:

    $ curl -v http://127.0.0.1:8080/ping/jwt
    < HTTP/1.1 401 Unauthorized
    < Content-Type: text/html; charset=utf-8
    Not authorized

Send token as a query string paramete:

    $ curl -v http://127.0.0.1:8080/ping/jwt?access_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhZG1pbiIsImV4cCI6MTQwNjA1OTE1NDM2OH0.PTv-pDDfdZlw4LuH_62ey62qi7z1mfqOvbj_kg7MO3U
    < HTTP/1.1 200 OK
    < Content-Type: text/html; charset=utf-8
    Hello admin

Send token in an HTTP header:

    $ curl -v -H "x-access-token: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhZG1pbiIsImV4cCI6MTQwNjA1OTE1NDM2OH0.PTv-pDDfdZlw4LuH_62ey62qi7z1mfqOvbj_kg7MO3U"  http:/8080/ping/jwt
    < HTTP/1.1 200 OK
    < Content-Type: text/html; charset=utf-8
    Hello admin

Send token in form body parameter:

    $ curl -v -H "Content-type: application/json" -X POST  http://127.0.0.1:8080/ping/jwt -d '{"access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhZG1pbiIsImV4cCI6MTQwNjA1OTE1NDM2OH0.PTv-pDDfdZlw4LuH_62ey62qi7z1mfqOvbj_kg7MO3U"}'
    < HTTP/1.1 200 OK
    < Content-Type: text/html; charset=utf-8
    Hello admin

## CORS headers

`OPTIONS` request example:

    $ curl -H "Origin: http://example.com"   -H "Access-Control-Request-Method: POST"   -H "Access-Control-Request-Headers: X-Requested-With"   -H "Accept: application/json" -H "Cont: application/json"   -X OPTIONS http://127.0.0.1:8080/api/events -d @event.json -v
    * Hostname was NOT found in DNS cache
    *   Trying 127.0.0.1...
    * Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
    > OPTIONS /api/events HTTP/1.1
    > User-Agent: curl/7.35.0
    > Host: 127.0.0.1:8080
    > Origin: http://example.com
    > Access-Control-Request-Method: POST
    > Access-Control-Request-Headers: X-Requested-With
    > Accept: application/json
    > Content-type: application/json
    > Content-Length: 246
    >
    * upload completely sent off: 246 out of 246 bytes
    < HTTP/1.1 204 No Content
    < X-Powered-By: Express
    < Access-Control-Allow-Origin: *
    < Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
    < Access-Control-Allow-Headers: X-Requested-With
    < Date: Mon, 21 Jul 2014 18:27:41 GMT
    < Connection: keep-alive
    <
    * Connection #0 to host 127.0.0.1 left intact

`POST` request example:

    $ curl -H "Origin: http://example.com"   -H "Access-Control-Request-Method: POST"   -H "Access-Control-Request-Headers: X-Requested-With"   -H "Accept: application/json" -H "Content-type: application/json"   -X POST http://127.0.0.1:8080/api/events -d @event.json -v
    * Hostname was NOT found in DNS cache
    *   Trying 127.0.0.1...
    * Connected to 127.0.0.1 (127.0.0.1) port 8080 (#0)
    > POST /api/events HTTP/1.1
    > User-Agent: curl/7.35.0
    > Host: 127.0.0.1:8080
    > Origin: http://example.com
    > Access-Control-Request-Method: POST
    > Access-Control-Request-Headers: X-Requested-With
    > Accept: application/json
    > Content-type: application/json
    > Content-Length: 246
    >
    * upload completely sent off: 246 out of 246 bytes
    < HTTP/1.1 200 OK
    < X-Powered-By: Express
    < Access-Control-Allow-Origin: *
    < Content-Type: text/html; charset=utf-8
    < Content-Length: 2
    < Date: Mon, 21 Jul 2014 18:29:06 GMT
    < Connection: keep-alive
    <
    * Connection #0 to host 127.0.0.1 left intact
    OK

Here is the same request with JQuery:

    var request = $.ajax({
        "type": "POST",
            "url": "http://127.0.0.1:8080/api/events",
            "headers": {
            "Accept": "application/json",
                "Content-type": "application/json"
        },
            "data": JSON.stringify({
            "license_key": "6ee7f16ef224e0ba13a22de8e2be2bb8",
                "wordpress_url": "http://inboundsoon.dev",
                "content_id": "95897",
                "lead_id": "95901",
                "lead_uid": "Z6ATMIGrPooZ0nWT2hoxS1MqA12XqPDCdSg",
                "event_type": "form_submission"
        })
    });
    request.success(function (data) {
        console.log(data);
    });

## Reports

Simple HTML report can be seen here:

    http://127.0.0.1:8080/reports/example.html
    http://jax-analytics.jit.su/reports/example.html

It contains information about last events in tabular format.
