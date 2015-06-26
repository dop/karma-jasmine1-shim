// jshint node:false, browser:true

(function (global) {
  'use strict';

  var jasmine = global.jasmine;

  if (!/^2\./.test(jasmine.version)) {
    console.warn('jasmine 1 shim is meant for jasmine 2');
    return;
  }

  function deprecated (message, f) {
    return function () {
      console.warn('DEPRECATED: ' + message);
      return f.apply(this, arguments);
    };
  }

  function breaking (message) {
    return function () {
      console.error('BREAKING: ' + message);
      throw new Error(message);
    };
  }

  var fit = global.fit;
  var fdescribe = global.fdescribe;

  global.iit = deprecated('use fit() (focused it) instead of iit()', fit);
  global.ddescribe = deprecated('use fdescribe() (focused describe) instead of ddescribe()', fdescribe);

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

  global.runs = breaking([
    'runs() is no longer available, use done callbacks passed to it(), beforeEach(), and afterEach():',
    '\t- it(function (done) { ... })',
    '\t- beforeEach(function (done) { ... })',
    '\t- afterEach(function (done) { ... })'
  ].join('\n'));

  global.waitsFor = breaking([
    'waitsFor() is no longer available, use done callbacks passed to it(), beforeEach(), and afterEach():',
    '\t- it(function (done) { ... })',
    '\t- beforeEach(function (done) { ... })',
    '\t- afterEach(function (done) { ... })'
  ].join('\n'));

}(window));
