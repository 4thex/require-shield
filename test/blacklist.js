var assert = require('assert');

describe('require-shield({mode: \'black-list\'})', function() {
  var shield = require('../index.js')({mode: 'black-list'});
  describe('#except(\'^stream|string_decoder$\')', function() {
    shield.except('^stream|string_decoder$');
    it('should prevent loading the \'stream\' module', function() {
      assert.throws(() => {
          require('stream');
      });
    });
    it('should prevent loading the \'string_decoder\' module', function() {
      assert.throws(() => {
          require('string_decoder');
      });
    });
    it('should allow loading the \'fs\' module', function() {
      assert.doesNotThrow(() => {
          require('fs');
      });
    });
    
  });
  describe('#except(\'^chalk|async$\', \'^sax$\')', function() {
    shield.except('^chalk|async$', '^sax$');
    it('should prevent loading the \'chalk\' module from the \'sax\' module', function() {
      assert.throws(() => {
          require.apply({
            filename: 'sax'
          }, 'chalk');
      });
    });
    it('should prevent loading the \'async\' module from the \'sax\' module', function() {
      assert.throws(() => {
          require.apply({
            filename: 'sax'
          }, 'async');
      });
    });
  });
});