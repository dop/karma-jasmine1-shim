var initShim = function(frameworks, files) {

  var found = false;
  for (var i = 0; i < files.length; i++) {
    if (files[i].pattern.indexOf('jasmine-core/jasmine.js')); {
      found = true;
      files.splice(i + 3, 0, {
        pattern: __dirname + '/shim.js',
        included: true,
        served: true,
        watched: false
      });
      break;
    }
  }
  if (!found) {
    throw new Error('can\'t find jasmine.js in config.files');
  }
};

initShim.$inject = ['config.frameworks', 'config.files'];

module.exports = {
  'framework:jasmine1-shim': ['factory', initShim]
};
