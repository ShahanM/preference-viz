import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { useTelemetry } from '@rssa-project/api';
import { LoadingScreen, type Movie } from '@rssa-project/study-template';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useMovieSelection } from '../../hooks/useMovieSelection';
import { useTour } from '../../hooks/useTour';
import { type ConditionViewProps, type PreferenceVizRecommendedItem } from '../../types/preferenceVisualization.types';
import FullScreenConditionModal from './FullScreenConditionModal';
import VisualizerContainer from './VisualizerContainer';

const ConditionView: React.FC<ConditionViewProps> = ({
    Visualizer,
    xCol,
    yCol,
    recommendations,
    rightPanelProps,
    infoPanelLayout = 'overlay',
    isFisheye,
    isLoading,
    onFullScreenChange,
}) => {
    const { setSelectedMovie } = useMovieSelection<PreferenceVizRecommendedItem | Movie>();
    const { trackEvent } = useTelemetry();
    const { startFullscreenTour } = useTour();

    const [isFullScreen, setIsFullScreen] = useState(false);
    const tourStartedRef = useRef(false);

    const visualizerProps = useMemo(
        () => ({
            xCol: xCol || '',
            yCol: yCol || '',
            isFisheye,
            onInteract: (event: string, data?: Record<string, unknown>, id?: string) => trackEvent(event, data, id),
            onHover: (item_id: string) => {
                const selectedMovie = recommendations?.[item_id];
                if (selectedMovie) setSelectedMovie(selectedMovie);
            },
        }),
        [xCol, yCol, isFisheye, trackEvent, recommendations, setSelectedMovie]
    );

    useEffect(() => {
        if (!isLoading && recommendations) {
            const firstMovie = Object.values(recommendations)[0];
            if (firstMovie) setSelectedMovie(firstMovie);
        }
    }, [isLoading, recommendations, setSelectedMovie]);

    useEffect(() => {
        if (onFullScreenChange) onFullScreenChange(isFullScreen);
        if (isFullScreen && !tourStartedRef.current) {
            tourStartedRef.current = true;
            setTimeout(() => startFullscreenTour(), 500);
        }
    }, [isFullScreen, startFullscreenTour, onFullScreenChange]);

    if (isLoading || !recommendations) {
        return <LoadingScreen loading={true} message="Loading your preferences. This can take up to 2 minutes." />;
    }

    return (
        <div className="relative w-full h-full group mt-3" id="condition-view-container">
            <button
                id="viz-enlarge-btn"
                type="button"
                onClick={() => setIsFullScreen(true)}
                className={clsx(
                    'absolute top-2 right-2 p-1.5 z-10 rounded-md shadow-sm transition-all',
                    'text-gray-900 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 in-[.tour-active]:opacity-100'
                )}
                title="Enlarge visualization"
            >
                <ArrowsPointingOutIcon className="h-5 w-5" />
            </button>

            <VisualizerContainer recommendations={recommendations} Visualizer={Visualizer} {...visualizerProps} />

            <FullScreenConditionModal
                isOpen={isFullScreen}
                onClose={() => setIsFullScreen(false)}
                infoPanelLayout={infoPanelLayout}
                rightPanelProps={rightPanelProps}
                recommendations={recommendations}
                Visualizer={Visualizer}
                visualizerProps={visualizerProps}
                setSelectedMovie={setSelectedMovie}
            />
        </div>
    );
};
export default ConditionView;
