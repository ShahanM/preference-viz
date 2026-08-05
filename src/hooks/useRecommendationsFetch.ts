import { useStudy } from '@rssa-project/api';
import type { Movie } from '@rssa-project/study-template';
import { useQuery } from '@tanstack/react-query';
import type {
    EnrichedCommunityScoreItem,
    EnrichedResponseWrapper,
    PreferenceVizResponseObject,
    RecommendationRequestPayload,
} from '../types/preferenceVisualization.types';

type FlexibleMovie = Movie & {
    movielens_id?: string | number;
    item_id?: string | number;
};

const extractValidId = (item?: FlexibleMovie): string | undefined => {
    if (!item) return undefined;
    const id = item.id ?? item.movielens_id ?? item.item_id;
    return id !== undefined ? String(id) : undefined;
};

export default function useRecommendationsFetch(studyStepId: string) {
    const { studyApi } = useStudy();

    return useQuery({
        queryKey: ['recommendations', studyStepId],
        queryFn: async () => {
            const payload: RecommendationRequestPayload = {
                step_id: studyStepId,
                context_tag: 'preference visualization recommendations',
                schema_type: 'community_comparison',
            };

            const response = await studyApi.post<RecommendationRequestPayload, EnrichedResponseWrapper<unknown>>(
                'recommendations/',
                payload
            );

            if (!response) throw new Error('Failed to fetch recommendations');

            const adaptedResponse: PreferenceVizResponseObject = {};

            if (response.response_type === 'standard') {
                const items = response.items as FlexibleMovie[];

                items.forEach((movie) => {
                    const validId = extractValidId(movie);
                    if (validId) {
                        adaptedResponse[validId] = movie as Movie;
                    } else {
                        console.warn('Skipped Standard item missing valid ID:', movie);
                    }
                });
            }

            if (response.response_type === 'community_comparison') {
                const items = response.items as EnrichedCommunityScoreItem<FlexibleMovie>[];

                items.forEach((payloadItem) => {
                    const { item, score, label, ...rest } = payloadItem;
                    const validId = extractValidId(item);

                    if (item && validId) {
                        adaptedResponse[validId] = {
                            ...item,
                            ...rest,
                            item_id: validId,
                            user_score: score,
                            user_label: label,
                        };
                    } else {
                        console.warn('Skipped Community Comparison item missing valid ID:', payloadItem);
                    }
                });
            }

            return adaptedResponse;
        },
    });
}
