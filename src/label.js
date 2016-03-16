import d3 from 'd3';
import dataJoinUtil from './util/dataJoin';
import {include, rebindAll} from 'd3fc-rebind';

export default function(layoutStrategy) {

    var size = d3.functor([0, 0]);
    var position = (d, i) => [d.x, d.y];
    var strategy = layoutStrategy || ((x) => x);
    var component = () => {};

    var dataJoin = dataJoinUtil()
        .selector('g.label')
        .element('g')
        .attr('class', 'label');

    var label = (selection) => {

        selection.each(function(data, index) {

            var g = dataJoin(this, data)
                .call(component);

            // obtain the rectangular bounding boxes for each child
            var childRects = g[0].map((node, i) => {
                var d = d3.select(node).datum();
                var childPos = position.call(node, d, i);
                var childSize = size.call(node, d, i);
                return {
                    hidden: false,
                    x: childPos[0],
                    y: childPos[1],
                    width: childSize[0],
                    height: childSize[1]
                };
            });

            // apply the strategy to derive the layout. The strategy does not change the order
            // or number of label.
            var layout = strategy(childRects);

            g.attr({
                'style': (_, i) => 'display:' + (layout[i].hidden ? 'none' : 'inherit'),
                'transform': (_, i) => 'translate(' + layout[i].x + ', ' + layout[i].y + ')',
                // set the layout width / height so that children can use SVG layout if required
                'layout-width': (_, i) => layout[i].width,
                'layout-height': (_, i) => layout[i].height,
                'anchor-x': (d, i) => position.call(this, d, i)[0] - layout[i].x,
                'anchor-y': (d, i) => position.call(this, d, i)[1] - layout[i].y
            });

            g.call(component);
        });
    };

    rebindAll(label, dataJoin, include('key'));
    rebindAll(label, strategy);

    label.size = function(x) {
        if (!arguments.length) {
            return size;
        }
        size = d3.functor(x);
        return label;
    };

    label.position = function(x) {
        if (!arguments.length) {
            return position;
        }
        position = d3.functor(x);
        return label;
    };

    label.component = function(value) {
        if (!arguments.length) {
            return component;
        }
        component = value;
        return label;
    };

    return label;
}
