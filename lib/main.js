/**
 * Created by Chris on 08/12/13.
 *
 * meaningful.js helps you build unique meaningful urls associated with IDs
 *
 * meaningful('a long name','id01234') === 'a-long-name'
 * meaningful('another long name','id56789') === 'another-long-name'
 * meaningful('another long name','id22222') === 'another-long-name-2'
 *
 * idOfMeaningful('a-long-name') === 'id01234'
 */

var redis = require("redis");

var client = null;
var redis_prefix = process.env.npm_package_config_redisprefix || 'mf';

exports.getClient = function () {
    if (client == null) client = redis.createClient();
    return client;
};

exports.meaningful_replace = function (longString) {
    return longString.
        replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a').replace(/[îï]/g, 'i').replace(/[ôö]/g, 'o').replace(/[ûü]/g, 'u').replace(/ç/g, 'c').
        replace(/[,;.\/!]/g, '-').replace(/[ -]+/g, '-');
};

exports.meaningful = function (longString, id, callback) {
    var client = exports.getClient();
    var mf = exports.meaningful_replace(longString);

    var keyedValue = redis_prefix + '.val/' + mf;

    function store(id, sanitized, callback) {

        // lookup by value first
        client.get(keyedValue, function (err, foundId) { // check if value already stored before for another id
            if (foundId == null || foundId == id) { // it did not exist before, or WE stored it
                client.set(keyedValue, id, function () { // so store value->key
                    callback(sanitized);
                });
            } else { // problem, we have a collision, so get counter
                var keyedCounter = redis_prefix + '.c/' + sanitized;
                client.incr(keyedCounter, function (err, counter) {
                    client.set(keyedValue + "-" + counter, id, function () { // now store value-xx->key
                        callback(sanitized + "-" + counter);
                    });

                });
            }
        });
    }

    client.get(keyedValue, function (err, foundId) { // is it mine
        if (id != foundId) { // nonexistent or sanitized changed
            store(id, mf, function (result) { // store new content
                callback(result);
            });
        } else { // contents still the same
            callback(mf);
        }
    });

};

exports.idOfMeaningful = function (sanitizedName, callback) {
    var client = exports.getClient();

    client.on("error", function (err) {
        console.log("Error " + err);
    });

    client.get(redis_prefix + '.val/' + sanitizedName, function (err, value) {
        callback(value);
    });
};