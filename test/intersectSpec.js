const d3 = require('d3');
const label = require('../build/d3fc-label-layout');

var intersect = label.intersect;

describe('intersect', function() {

    it('should return zero for non intersecting rectangles', function() {
        var a = {
            x: 0, y: 0, width: 10, height: 10
        };
        var b = {
            x: 10, y: 0, width: 10, height: 10
        };
        var c = {
            x: 0, y: 10, width: 10, height: 10
        };
        var d = {
            x: 10, y: 10, width: 10, height: 10
        };

        expect(intersect(a, b)).toEqual(0);
        expect(intersect(a, c)).toEqual(0);
        expect(intersect(a, d)).toEqual(0);
        expect(intersect(b, d)).toEqual(0);
    });

    it('should return the intersection area', function() {
        var a = {
            x: 0, y: 0, width: 10, height: 10
        };
        var b = {
            x: 5, y: 0, width: 10, height: 10
        };
        var c = {
            x: 0, y: 5, width: 10, height: 10
        };
        var d = {
            x: 5, y: 5, width: 10, height: 10
        };

        expect(intersect(a, b)).toEqual(50);
        expect(intersect(a, c)).toEqual(50);
        expect(intersect(a, d)).toEqual(25);
    });

});
