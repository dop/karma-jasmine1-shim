
describe('Jasmine Mock clock', function () {

  it('should throw', function () {
    expect(jasmine.Clock.useMock).toThrow();
  });

});

describe('Object equality', function () {

  it('should not ignore undefined keys', function () {
    expect({ a: undefined }).not.toEqual({});
  });

});
