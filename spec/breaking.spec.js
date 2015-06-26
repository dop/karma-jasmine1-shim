describe('Jasmine Mock clock', function () {
  it('should throw', function () {
    expect(jasmine.Clock.useMock).toThrow();
  });
});

describe('Asynchronous specs', function() {
  it('should throw when using runs()', function() {
    expect(runs).toThrow();
  });

  it('should throw when using waitsFor()', function () {
    expect(waitsFor).toThrow();
  });
});
