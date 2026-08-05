import { useFetchParticipant, useStudy } from '@rssa-project/api';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MovieSelectionProvider } from '../../contexts/movieSelectionProvider';
import type { EssayResponse } from '../../types/preferenceVisualization.types';
import { DISLIKE_CUTOFF, LIKE_CUTOFF } from '../../utils/constants';
import ConditionView from './ConditionView';
import ParticipantResponsePanel from './ParticipantResponsePanel';
import RightInfoPanel from './RightInfoPanel';
import { conditionMap } from './conditionMap';

import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { LoadingScreen, type StudyLayoutContextType } from '@rssa-project/study-template';
import clsx from 'clsx';
import useRecommendationsFetch from '../../hooks/useRecommendationsFetch';
import { useTour } from '../../hooks/useTour';

const PreferenceVisualizationContent: React.FC = () => {
    const { studyApi } = useStudy();
    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const { startMainTour } = useTour();
    const { data: participant } = useFetchParticipant();

    const externalCode = participant?.study_condition?.short_code;
    const viewLinkKey = participant?.study_condition?.view_link_key;
    const conditionIdentifier = viewLinkKey && conditionMap[viewLinkKey] ? viewLinkKey : externalCode;

    const conditionName = participant?.study_condition?.name;
    const conditionId = participant?.study_condition?.id;

    const conditionConfig = conditionIdentifier ? conditionMap[conditionIdentifier] : undefined;
    const ConditionalVisualizer = conditionConfig?.Visualizer;
    const showLikeDislikeLines = useMemo(() => {
        if (!conditionIdentifier) return true;
        const lowerName = conditionIdentifier.toLowerCase();
        return !lowerName.includes('baseline') && !lowerName.includes('self');
    }, [conditionIdentifier]);

    const { data: essayResponseData } = useQuery({
        queryKey: ['participantResponse'],
        queryFn: async () => await studyApi.get<EssayResponse>(`responses/interactions/${studyStep.id}`),
        enabled: !!studyApi,
    });

    const { data: recommendations, isLoading } = useRecommendationsFetch(studyStep.id);

    const essayResponse = useMemo(() => {
        if (!essayResponseData) return undefined;
        if (essayResponseData instanceof Array) {
            return essayResponseData[0];
        }
    }, [essayResponseData]);

    const handleFullScreenChange = useCallback(
        (isFull: boolean) => {
            if (!isFull) {
                // User exited full screen. Check if we should resume tour.
                // Step index 2 is "Maximize View". If we were there, resume at 3.
                const lastStepIndex = sessionStorage.getItem('current_tour_index');
                if (lastStepIndex === '2') {
                    // 2 is the index of the Enlarge Button step
                    setTimeout(() => {
                        startMainTour(3); // Resume at next step
                    }, 500);
                }
            }
        },
        [startMainTour]
    );

    if (!participant) {
        return <div className="p-10 text-center">Loading participant data...</div>;
    }

    if (!ConditionalVisualizer) {
        return (
            <div className="p-10 text-center text-red-600">
                <h3 className="text-lg font-bold">Configuration Error</h3>
                <p>
                    No visualization found for condition:{' '}
                    <strong>
                        {conditionName || 'Unknown'} (Code: {conditionIdentifier})
                    </strong>
                    .
                </p>
                <p>Please contact the study administrator to verify the condition mapping.</p>
                {/* Developer Hint: Ensure backend condition name matches keys in conditionMap.tsx */}
            </div>
        );
    }

    const conditionForPanel = {
        id: conditionId || '',
        name: conditionName || '',
    };

    if (!isLoading && recommendations) {
        const studyId = import.meta.env.VITE_RSSA_STUDY_ID;
        const tourKey = `${studyId}_tour-seen-${studyStep.id}`;
        const tourSeen = localStorage.getItem(tourKey);
        if (!tourSeen) {
            setTimeout(() => {
                startMainTour(0);
                localStorage.setItem(tourKey, 'true');
            }, 1000);
        }
    }

    if (isLoading || !recommendations) {
        return (
            <LoadingScreen
                loading={true}
                message="Loading your preferences and generating the view. This can take up to 2 minutes."
            />
        );
    }
    return (
        <div className="w-full justify-items-center">
            <div className="flex flex-between text-2xl mb-3 max-w-270">
                <button
                    onClick={() => startMainTour(0)}
                    className={clsx(
                        'fixed right-4 top-4 p-1 z-50 bg-amber-500 hover:bg-amber-600 text-white',
                        'rounded-full p-1 shadow-lg transition-transform hover:scale-110'
                    )}
                    title="Start Guided Tour"
                >
                    <QuestionMarkCircleIcon className="h-5 w-5" />
                </button>
                <div className="w-full flex flex-between gap-1">
                    <div className="w-1/5">
                        <ParticipantResponsePanel condition={conditionForPanel} participantResponse={essayResponse} />
                    </div>
                    <div className="w-3/5">
                        <ConditionView
                            Visualizer={ConditionalVisualizer}
                            xCol={conditionConfig?.xCol}
                            yCol={conditionConfig?.yCol}
                            recommendations={recommendations}
                            isLoading={isLoading}
                            onFullScreenChange={handleFullScreenChange}
                            rightPanelProps={{
                                likeCutoff: LIKE_CUTOFF,
                                dislikeCutoff: DISLIKE_CUTOFF,
                                showLikeDislikeByLine: showLikeDislikeLines,
                            }}
                            infoPanelLayout={conditionConfig?.layout || 'overlay'}
                        />
                    </div>
                    <div className="w-1/5">
                        <RightInfoPanel
                            likeCutoff={LIKE_CUTOFF}
                            showLikeDislikeByLine={showLikeDislikeLines}
                            dislikeCutoff={DISLIKE_CUTOFF}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

const PreferenceVisualization = () => {
    return (
        <MovieSelectionProvider>
            <PreferenceVisualizationContent />
        </MovieSelectionProvider>
    );
};

export default PreferenceVisualization;
