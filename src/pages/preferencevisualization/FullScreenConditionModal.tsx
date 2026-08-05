import { Dialog, DialogPanel } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useCallback, useState } from 'react';
import type { FullScreenConditionModalProps } from '../../types/preferenceVisualization.types';
import RightInfoPanel from './RightInfoPanel';
import VisualizerContainer from './VisualizerContainer';

const FullScreenConditionModal: React.FC<FullScreenConditionModalProps> = ({
    isOpen,
    onClose,
    infoPanelLayout,
    rightPanelProps,
    recommendations,
    Visualizer,
    visualizerProps,
    setSelectedMovie,
}) => {
    const [panelPosition, setPanelPosition] = useState<'left' | 'right'>('right');

    const handleMouseMove = useCallback(
        (e: React.MouseEvent) => {
            if (infoPanelLayout !== 'overlay') return;
            const newPos = e.clientX > window.innerWidth / 2 ? 'left' : 'right';
            setPanelPosition((prev) => (prev !== newPos ? newPos : prev));
        },
        [infoPanelLayout]
    );

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel
                    className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden flex flex-col"
                    onClick={() => setSelectedMovie(undefined)}
                    onMouseMove={handleMouseMove}
                >
                    <div
                        className={`flex-1 relative w-full overflow-hidden ${infoPanelLayout === 'sidebar' ? 'flex flex-row' : 'flex flex-col'}`}
                    >
                        <div className={`relative ${infoPanelLayout === 'sidebar' ? 'w-3/4 h-full' : 'w-full h-full'}`}>
                            {rightPanelProps && infoPanelLayout === 'overlay' && (
                                <div
                                    className={`absolute top-4 z-20 w-96 max-h-[90vh] overflow-y-auto shadow-2xl rounded-xl border border-gray-200 group/panel transition-all duration-200 ${panelPosition === 'right' ? 'right-4' : 'left-4'}`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedMovie(undefined)}
                                        className="absolute top-2 right-2 p-1 text-gray-400 bg-white/50 hover:bg-white hover:text-gray-900 rounded-full z-30 opacity-0 group-hover/panel:opacity-100 transition-opacity"
                                    >
                                        <XMarkIcon className="h-5 w-5" />
                                    </button>
                                    <div className="bg-white rounded-xl p-1">
                                        <RightInfoPanel {...rightPanelProps} />
                                    </div>
                                </div>
                            )}

                            <VisualizerContainer
                                recommendations={recommendations}
                                Visualizer={Visualizer}
                                {...visualizerProps}
                            />
                        </div>

                        {rightPanelProps && infoPanelLayout === 'sidebar' && (
                            <div
                                className="w-1/4 h-full border-l border-gray-200 bg-gray-50 flex flex-col overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex-1 overflow-y-auto p-4">
                                    <RightInfoPanel {...rightPanelProps} />
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className="h-14 border-t border-gray-200 bg-gray-50 flex justify-end items-center px-4 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Exit Full Screen
                        </button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    );
};

export default FullScreenConditionModal;
