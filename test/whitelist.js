var assert = require('assert');

describe('require-shield({mode: \'white-list\'})', function() {
  var shield = require('../index.js')({mode: 'white-list'});
  // describe('#except(\'^stream|string_decoder$\')', function() {
  //   shield.except('^stream|string_decoder$');
  //   it('should allow loading the \'stream\' module', function(done) {
  //     assert.doesNotThrow(() => {
  //         require('stream');
  //     });
  //   });
  //   it('should allow loading the \'string_decoder\' module', function(done) {
  //     assert.doesNotThrow(() => {
  //         require('string_decoder');
  //     });
  //   });
  //   it('should prevent loading the \'fs\' module', function(done) {
  //     assert.throws(() => {
  //         require('fs');
  //     });
  //   });
  // });
  describe('#except(\'^glob|diff$\', \'^sax$\')', function() {
    shield.except('^glob|diff$', '^sax$');
    it('should allow loading the \'glob\' module from the \'sax\' module', function() {
      assert.doesNotThrow(() => {
          // This does not work because the core require method is redefined as self.require
          require.call({
            filename: 'sax'
          }, 'chalk');
      });
    });
    it('should allow loading the \'diff\' module from the \'sax\' module', function() {
      assert.doesNotThrow(() => {
          require.call({
            filename: 'sax'
          }, 'diff');
      });
    });
  });
  
});