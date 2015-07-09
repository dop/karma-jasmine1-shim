// jshint node:false, browser:true

(function (global) {
  'use strict';

  var messages = {};

  var jasmine = global.jasmine;

  if (!/^2\./.test(jasmine.version)) {
    console.warn('jasmine 1 shim is meant for jasmine 2');
    return;
  }

  jasmine.getEnv().afterAll(function () {
    var errors = Object.keys(messages);
    if (errors.length) {
      errors.forEach(function (line) {
        window.__karma__.log('JASMINE v2', [line]);
      });
      [
        'Your test code uses functions, methods, and properties that are no ',
        'longer available in Jasmine version 2:',
        '',
        '   See http://jasmine.github.io/2.3/upgrading.html for upgrade guide.',
        ''
      ].forEach(function (line) {
        window.__karma__.log('Jasmine v2', [line]);
      });
    }
  });

  function deprecated (message, f) {
    return function () {
      messages[message] = true;
      return f.apply(this, arguments);
    };
  }

  function breaking (message) {
    return function () {
      messages['BREAKING: ' + message] = true;
      throw new Error(message);
    };
  }

  var fit = global.fit;
  var fdescribe = global.fdescribe;

  global.iit = deprecated('use fit() (focused it) instead of iit()', fit);
  global.ddescribe = deprecated('use fdescribe() (focused describe) instead of ddescribe()', fdescribe);

  var addMatchers = jasmine.addMatchers;
  jasmine.addMatchers = function (matchers) {
    Object.keys(matchers).forEach(function (name) {
      var original = matchers[name];
      matchers[name] = function () {
        return {
          compare: function (actual, expected) {
            var thisObj = { actual: actual };
            var result = {
              pass: original.call(thisObj, expected)
            };
            if (thisObj.message) {
              thisObj.isNot = result.pass;
              original.call(thisObj, expected);
              result.message = thisObj.message();
              if (result.message.constructor === Array) {
                result.message = result.message[Number(result.pass)];
              }
            }
            return result;
          }
        };
      };
    });
    addMatchers.call(jasmine, matchers);
  };

  function spyShim (spy) {
    spy.reset = deprecated('use spy.calls.reset() instead of spy.reset()', function () {
      return spy.calls.reset();
    });

    Object.defineProperty(spy, 'mostRecentCall', {
      get: deprecated('use spy.calls.mostRecent() instead of spy.mostRecentCall', function () {
        return spy.calls.mostRecent();
      })
    });

    Object.defineProperty(spy, 'identity', {
      get: deprecated('use spy.and.identity() instead of spy.identity', function () {
        return spy.and.identity();
      })
    });

    spy.andCallThrough = deprecated('use spy.and.callThrough() instead of spy.andCallThrough()', function () {
      return spy.and.callThrough.apply(spy.and, arguments);
    });

    spy.andReturn = deprecated('use spy.and.returnValue() instead of spy.andReturn()', function () {
      return spy.and.returnValue.apply(spy.and, arguments);
    });

    spy.andCallFake = deprecated('use spy.and.callFake() instead of spy.andCallFake()', function () {
      return spy.and.callFake.apply(spy.and, arguments);
    });

    var calls = spy.calls;

    Object.defineProperty(spy, 'callCount', {
      get: deprecated('use spy.calls.count() instead of spy.callCount', function () {
        return calls.count();
      })
    });

    Object.defineProperty(calls, '0', {
      get: deprecated('use spy.calls.first() instead of spy.calls[0]', function () {
        return calls.first();
      })
    });

    ['1','2','3','4','5','6','7','8','9'].forEach(function (n) {
      Object.defineProperty(calls, n, {
        get: deprecated(
          'use spy.calls.all() instead of spy.calls; to access call count or' +
            ' arguments see count() or argsFor() methods',
          function () {
            return calls.all()[n];
          }
        )
      });
    });

    Object.defineProperty(spy, 'argsForCall', {
      get: deprecated('use calls.argsFor() or calls.allArgs() instead of argsForCall', function () {
        return calls.allArgs();
      })
    });

    Object.defineProperty(calls, 'length', {
      get: deprecated('use spy.calls.count() instead of spy.calls.length', function () {
        return calls.count();
      })
    });

    return spy;
  }

  var createSpy = jasmine.createSpy;
  jasmine.createSpy = function () {
    return spyShim(createSpy.apply(this, arguments));
  };

  jasmine.Clock.useMock = breaking(
    'use jasmine.clock().install() instead of jasmine.Clock.useMock(),' +
      ' you must uninstall clock when not needed with jasmine.clock().uninstall()'
  );

  jasmine.Clock.tick = deprecated('use jasmine.clock().tick() instead of jasmine.Clock.tick()', function (t) {
    return jasmine.clock().tick(t);
  });

  global.runs = breaking(
    'runs() is no longer available, use done callbacks passed to it(), beforeEach(), and afterEach():'
  );

  global.waitsFor = breaking(
    'waitsFor() is no longer available, use done callbacks passed to it(), beforeEach(), and afterEach():'
  );

}(window));
