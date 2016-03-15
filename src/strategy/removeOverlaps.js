import minimum from '../util/minimum';
import {rebindAll} from '../util/rebind';
import {collisionArea} from '../util/collision';
import {identity} from '../util/fn';

// iteratively remove the rectangle with the greatest area of collision
export default function(adaptedStrategy) {

    adaptedStrategy = adaptedStrategy || identity;

    // minimises the given scoring function, returning the best score and the item
    // that this corresponds to
    function minimum(data, score) {
        return data.map(function(dataPoint, index) {
            return [score(dataPoint, index), dataPoint];
        }).reduce(function(accumulator, dataPoint) {
            return accumulator[0] > dataPoint[0] ? dataPoint : accumulator;
        }, [Number.MAX_VALUE, null]);
    }

    var removeOverlaps = function(layout) {

        layout = adaptedStrategy(layout);

        // returns a function that computes the area of overlap for rectangles
        // in the given layout array
        function scorerForLayout(l) {
            return function scorer(d, i) {
                return -collisionArea(l, i);
            };
        }

        var iterate = true;
        do {
            // apply the overlap calculation to visible rectangles
            var filteredLayout = layout.filter(function(d) { return !d.hidden; });
            var min = minimum(filteredLayout, scorerForLayout(filteredLayout));
            if (min[0] < 0) {
                // hide the rectangle with the greatest collision area
                min[1].hidden = true;
            } else {
                iterate = false;
            }
        } while (iterate);

        return layout;
    };

    rebindAll(removeOverlaps, adaptedStrategy);

    return removeOverlaps;
}
