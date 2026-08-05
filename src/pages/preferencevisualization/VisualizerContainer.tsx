import type { PreferenceVizResponseObject, VisualizerContainerProps } from '../../types/preferenceVisualization.types';
import ResponsiveContainer from './ResponsiveContainer';

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({
    recommendations,
    Visualizer,
    ...props
}: {
    recommendations: PreferenceVizResponseObject;
    Visualizer: unknown;
}) => (
    <ResponsiveContainer>
        {(width, height) => {
            if (!recommendations) return null;
            const Component = Visualizer as React.ElementType;
            return <Component width={width} height={height} data={recommendations} {...props} />;
        }}
    </ResponsiveContainer>
);

export default VisualizerContainer;
