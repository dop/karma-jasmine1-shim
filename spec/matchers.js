// FIXME: I don't know how to test exception messages as they are not simple
// exceptions :(

xdescribe('Old Matchers', function () {
  beforeEach(function () {
    var matchers = {
      toBeSomething: function () {
        this.message = function () {
          return 'Expected you to' + (this.isNot ? ' not' : '') +
            ' give me something';
        };
        return this.actual.toLowerCase() === 'something';
      },

      toBeSpecificThing: function () {
        return this.actual.toLowerCase() === 'specific thing';
      },

      toBeOther: function () {
        this.message = function () {
          return [
            'Expected ' + this.actual + ' to be OTHER THING',
            'Expected ' + this.actual + ' not to be OTHER THING'
          ];
        };
        return this.actual === 'other';
      }
    };

    jasmine.addMatchers(matchers);
  });

  it('should migrate simple matcher without custom message', function () {
    expect('specific thing').toBeSpecificThing();
  });

  it('should handle custom message depending on this.isNot', function () {
    expect('something').not.toBeSomething();
  });

  it('should handle custom message returning array', function () {
    expect('this').toBeOther();
  });
});
