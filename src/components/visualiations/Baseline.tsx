import { useEffect, useRef } from 'react';
import type { PreferenceVizComponentProps } from '../../types/preferenceVisualization.types';
import type { Movie } from '@rssa-project/study-template';
import clsx from 'clsx';

// const posterHeight = 81;

const BaselineMovieItem: React.FC<{
    item: Movie;
    onHover: (item: string) => void;
    onInteract?: PreferenceVizComponentProps<Movie>['onInteract'];
}> = ({ item, onHover, onInteract }) => {
    const hoverStartTimeRef = useRef<number | null>(null);
    const handleMouseEnter = () => {
        hoverStartTimeRef.current = performance.now();
        onHover(item.id);
    };

    const handleMouseLeave = () => {
        if (hoverStartTimeRef.current !== null) {
            const durationMs = Math.round(performance.now() - hoverStartTimeRef.current);
            if (durationMs > 500 && onInteract) {
                onInteract('item_hover_duration', { duration_ms: durationMs }, item.id);
            }
            hoverStartTimeRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            if (hoverStartTimeRef.current !== null) {
                const durationMs = Math.round(performance.now() - hoverStartTimeRef.current);
                if (durationMs > 500 && onInteract) {
                    onInteract('item_hover_duration', { duration_ms: durationMs, unmounted: true }, item.id);
                }
            }
        };
    }, [onInteract, item.id]);

    return (
        <div
            className="flex gap-3 shadow-sm m-1 border border-amber-400 rounded-md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img className="h-54 border-stone-900 rounded-md" src={item.tmdb_poster} alt={item.title} />
            {/* <div>
                <div className="flex gap-1">
                    <p className="text-base">{item.title}</p>
                    <p className="text-base">({item.year})</p>
                </div>
                <p className="mt-3 text-sm text-left">{item.description}</p>
            </div> */}
        </div>
    );
};

const Baseline: React.FC<PreferenceVizComponentProps<Movie>> = ({ data, onHover, onInteract }) => {
    return (
        <div
            className={clsx(
                'justify-items-center',
                'm-3 gap-1 max-h-225 overflow-y-auto',
                '[&::-webkit-scrollbar]:w-1.5',
                '[&::-webkit-scrollbar-track]:bg-transparent',
                '[&::-webkit-scrollbar-thumb]:bg-gray-300',
                '[&::-webkit-scrollbar-thumb]:rounded-full',
                'hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'
            )}
        >
            {Object.entries(data).map(([k, item]) => (
                <BaselineMovieItem key={`rec-movies-${k}`} item={item} onHover={onHover} onInteract={onInteract} />
            ))}
        </div>
    );
};

export default Baseline;
