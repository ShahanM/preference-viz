import * as d3 from 'd3';
import { useEffect, useRef, useMemo } from 'react';
import type {
    DataAugmentedItem,
    PreferenceVizComponentProps,
    PreferenceVizRecommendedItem,
} from '../../types/preferenceVisualization.types';
import {
    appendStyledPoster,
    attachFisheyeBehavior,
    attachNodeInteractions,
    renderVizGrid,
    X_AXIS_LABEL_ONE,
    Y_AXIS_LABEL_ONE,
} from '../../utils/vizUtils';

const posterWidth = 54;
const posterHeight = 81;

const ContinuousDecoupled: React.FC<PreferenceVizComponentProps<PreferenceVizRecommendedItem>> = ({
    width,
    height,
    data,
    onHover,
    onInteract,
    isFisheye = false,
    showCommunity = true,
}) => {
    const svgRefs = useRef<(SVGSVGElement | null)[]>([]);

    const simNodeData = useMemo(() => {
        if (!data) return data;
        const myPrefOrder: DataAugmentedItem[] = [];
        const commPrefOrder: DataAugmentedItem[] = [];
        Object.values(data).forEach((d) => {
            myPrefOrder.push({ ...d, x: d.user_score });
            if (showCommunity) {
                commPrefOrder.push({ ...d, x: d.community_score });
            }
        });
        return { myPrefs: myPrefOrder, commPrefs: commPrefOrder };
    }, [data, showCommunity]);

    const onHoverRef = useRef(onHover);
    const onInteractRef = useRef(onInteract);

    useEffect(() => {
        onHoverRef.current = onHover;
        onInteractRef.current = onInteract;
    }, [onHover, onInteract]);
    useEffect(() => {
        onHoverRef.current = onHover;
    }, [onHover]);

    const stickyIdRef = useRef<string | null>(null);
    useEffect(() => {
        if (!simNodeData || width === 0 || height === 0) return;

        // const numCharts = showCommunity ? 2 : 1;
        // const svgHeight = height / numCharts;
        const svgHeight = posterHeight * 4;

        const margin = { top: 20, right: 15, bottom: 60, left: 10 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = svgHeight - margin.top - margin.bottom;

        const xRangePadding = posterWidth / 2;
        const xScale = d3
            .scaleLinear()
            .domain([1, 5])
            .range([xRangePadding, innerWidth - xRangePadding]);

        const yScale = d3.scaleLinear().domain([0, 5]).range([innerHeight, 0]);

        const dataArrays = showCommunity ? [simNodeData.myPrefs, simNodeData.commPrefs] : [simNodeData.myPrefs];

        svgRefs.current.forEach((svgRef, i) => {
            if (!svgRef || i >= dataArrays.length) return;

            const svg = d3.select(svgRef).attr('width', width).attr('height', svgHeight);
            svg.selectAll('*').remove();

            const bg = svg.append('rect').attr('width', width).attr('height', svgHeight).attr('fill', 'transparent');

            bg.on('click', () => {
                if (stickyIdRef.current) {
                    d3.selectAll<SVGGElement, DataAugmentedItem>('.movie-node').each(function () {
                        const content = d3.select(this).select('.node-content');
                        content.transition().duration(200).attr('transform', 'translate(0,0) scale(1)');
                        content.select('rect').style('filter', 'drop-shadow(0px 2px 4px rgba(0,0,0,0.3))');
                    });

                    stickyIdRef.current = null;
                    if (onHoverRef.current) onHoverRef.current('');
                    if (onInteractRef.current) onInteractRef.current('viz_bg_clear');
                }
            });

            const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
            const label = i === 0 ? X_AXIS_LABEL_ONE : Y_AXIS_LABEL_ONE;

            g.append('style').text(
                `.grid line { stroke: #ccccccff; stroke-opacity: 0.7; shape-rendering: crispEdges; }`
            );

            g.append('line')
                .attr('x1', innerWidth)
                .attr('y1', 0)
                .attr('x2', innerWidth)
                .attr('y2', innerHeight)
                .attr('stroke', '#000000')
                .attr('shape-rendering', 'crispEdges');

            const { xLines, xTicks } = renderVizGrid(
                g,
                { xScale, yScale },
                { innerWidth, innerHeight },
                {
                    drawYGridLines: true,
                    drawYAxis: true,
                    hideYAxisLabels: true,
                    yTickValues: d3.ticks(0, 5, 25),
                }
            );

            svg.append('text')
                .attr('class', 'text-lg')
                .attr('x', innerWidth / 2 + margin.left)
                .attr('y', svgHeight - 5)
                .style('text-anchor', 'middle')
                .style('font-weight', 'bold')
                .text(label);

            const nodes = g
                .selectAll<SVGGElement, DataAugmentedItem>('.movie-node')
                .data(dataArrays[i], (d: DataAugmentedItem) => d.id)
                .join('g')
                .attr('class', (d) => `movie-node node-id-${d.id}`)
                .attr('data-ox', (d) => xScale(d.x!))
                .attr('data-oy', innerHeight / 2)
                .attr('transform', (d) => `translate(${xScale(d.x!)}, ${innerHeight / 2})`)
                .style('cursor', 'pointer');

            attachNodeInteractions(nodes, {
                onHoverRef,
                onInteractRef,
                stickyIdRef,
                posterWidth: posterWidth,
                posterHeight: posterHeight,
                innerWidth,
                innerHeight,
                scaleFactor: 1.5,
            });

            const contentGroups = nodes.append('g').attr('class', 'node-content');

            const { image } = appendStyledPoster(contentGroups, posterWidth, posterHeight);
            image.attr('xlink:href', (d: DataAugmentedItem) => d.tmdb_poster);

            if (isFisheye) {
                attachFisheyeBehavior(
                    svg,
                    { xLines, xTicks, nodes },
                    {
                        scales: { xScale, yScale },
                        dimensions: { innerWidth, innerHeight, margin },
                        isFisheye,
                        getX: (d: DataAugmentedItem) => d.x!,
                        getY: () => innerHeight / 2,
                        mode: '1D',
                    }
                );
            }
        });
    }, [simNodeData, width, height, showCommunity, isFisheye]);

    const setSvgRef = (index: number) => (element: SVGSVGElement | null) => {
        svgRefs.current[index] = element;
    };

    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="pb-3 mb-5 bg-amber-50 rounded-lg">
                <svg ref={setSvgRef(0)} style={{ display: 'block' }}></svg>
            </div>
            {showCommunity && (
                <div className="pb-3 mt-5 bg-purple-50 rounded-lg">
                    <svg ref={setSvgRef(1)} style={{ display: 'block' }} className="mt-5"></svg>
                </div>
            )}
        </div>
    );
};

export default ContinuousDecoupled;
