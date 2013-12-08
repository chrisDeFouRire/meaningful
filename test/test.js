/**
 * Created by chris on 08/12/13.
 */

var assert = require('assert');
var should = require('should');

var mf = require('../lib/main');

describe('meaningful', function () {
    describe('meaningful_replace()', function () {
        it('should replace spaces with dash', function () {
            mf.meaningful_replace('hello world').should.eql('hello-world');
            mf.meaningful_replace('hello world of thrones').should.eql('hello-world-of-thrones');
        });
        it('should replace punctuation with dash', function () {
            mf.meaningful_replace('hello, world').should.eql('hello-world');
            mf.meaningful_replace('hello, world of thrones!').should.eql('hello-world-of-thrones-');
        });
        it('should replace accents with normal letters', function () {
            mf.meaningful_replace('éàüîô').should.eql('eauio');
            mf.meaningful_replace('à très bientôt les amis !!!').should.eql('a-tres-bientot-les-amis-');
        });
        it('should replace multiple spaces and dashes with a single dash', function () {
            mf.meaningful_replace('this   is---an  example').should.eql('this-is-an-example');
        });
    });

    describe('meaningful()', function () {
        it('should replace spaces with dash', function (done) {
            mf.meaningful('hello world', 'id0', function (result) {
                result.should.eql('hello-world');
                mf.meaningful('hello world of thrones', 'id1', function (result) {
                    result.should.eql('hello-world-of-thrones');
                    done();
                });
            });

        });
        it('should allow replacing contents', function (done) {
            mf.meaningful('hello world of darkness', 'id2', function (result) {
                result.should.eql('hello-world-of-darkness');
                mf.meaningful('hello world of brightness', 'id2', function (result) {
                    result.should.eql('hello-world-of-brightness');
                    done();
                });

            });

        });
    });

    describe('idOfMeaningful()', function () {
        it('should return null for nonexistent key', function (done) {
            mf.idOfMeaningful('nonexistent-key', function (result) {
                assert.equal(result, null);
                done();
            })

        });
        it('should return the correct value for existent key', function (done) {
            mf.meaningful('existent key', 'IFoundTheId', function (sanitized) {
                sanitized.should.eql('existent-key');
                mf.idOfMeaningful(sanitized, function (result) {
                    result.should.eql('IFoundTheId');
                    done();
                })

            });

        });
        it('should cope with duplicate values for different keys', function(done) {
            mf.meaningful('a value','firstId', function(sanitized1) {
                mf.meaningful('a value','secondId', function(sanitized2) {
                    sanitized2.should.not.eql(sanitized1);
                    done();
                })
            }) ;
        });
    });
});