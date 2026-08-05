import type { Movie } from '@rssa-project/study-template';

export type RecommendationType = 'baseline' | 'diverse' | 'reference';
export type VizTelemetryEvent = 'item_hover_duration' | 'click_sticky' | 'click_unsticky' | 'viz_bg_clear';

// ============================================================================
// ALGORITHM & FEATURE SCHEMAS
// ============================================================================
export interface PreferenceVizAlgoSetting {
    algorithm: string;
    randomize: boolean;
    initial_sample_size: number;
    min_rating_count: number;
    recommendation_count: number;
}

export interface CommunityPreferenceFeature {
    community_label: number;
    community_score: number;
}

export interface UserPreferenceFeature {
    user_score: number;
    user_label: number;
}

export interface PreferenceVizRecommendationFeature extends UserPreferenceFeature, CommunityPreferenceFeature {
    item_id: string;
    cluster: number;
}

// ============================================================================
// FRONTEND COMPONENT DATA MODELS
// ============================================================================
// Combines the Movie metadata with the algorithm's scoring features
export interface PreferenceVizRecommendedItem extends Movie, PreferenceVizRecommendationFeature {}

// The dictionary structure used by the visualizers
export interface PreferenceVizResponseObject {
    [key: string]: PreferenceVizRecommendedItem | Movie;
}

// D3 Physics & Grid Mixin
export interface PreferenceVizDataMixin {
    x?: number;
    y?: number;
    vx?: number;
    vy?: number;
    index?: number;
    scoreValue?: number;
}

export interface DataAugmentedItem extends PreferenceVizRecommendedItem, PreferenceVizDataMixin {}

// ============================================================================
// COMPONENT PROPS
// ============================================================================
export interface PreferenceVizComponentProps<T = PreferenceVizRecommendedItem | Movie> {
    width: number;
    height: number;
    data: { [key: string]: T };
    xCol: string;
    yCol: string;
    onHover: (item_id: string) => void;
    isFisheye?: boolean;
    showCommunity?: boolean;
    onInteract?: (eventType: VizTelemetryEvent, eventData?: Record<string, unknown>, itemId?: string) => void;
}

export interface VisualizerContainerProps {
    recommendations: PreferenceVizResponseObject;
    Visualizer:
        | React.FC<PreferenceVizComponentProps<PreferenceVizRecommendedItem>>
        | React.FC<PreferenceVizComponentProps<Movie>>;
    xCol?: string;
    yCol?: string;
    onHover: (id: string) => void;
    onInteract: (event: string, data?: Record<string, unknown>, id?: string) => void;
    isFisheye?: boolean;
}

export interface ConditionViewProps {
    Visualizer:
        | React.FC<PreferenceVizComponentProps<PreferenceVizRecommendedItem>>
        | React.FC<PreferenceVizComponentProps<Movie>>;
    xCol?: string;
    yCol?: string;
    // recommendationType?: RecommendationType;
    recommendations: PreferenceVizResponseObject;
    rightPanelProps?: { likeCutoff: number; dislikeCutoff: number; showLikeDislikeByLine: boolean };
    infoPanelLayout?: 'overlay' | 'sidebar';
    isFisheye?: boolean;
    isLoading: boolean;
    // onDataLoaded?: () => void;
    onFullScreenChange?: (isFullScreen: boolean) => void;
}

export interface FullScreenConditionModalProps {
    isOpen: boolean;
    onClose: () => void;
    infoPanelLayout: 'overlay' | 'sidebar';
    rightPanelProps?: {
        likeCutoff: number;
        dislikeCutoff: number;
        showLikeDislikeByLine: boolean;
    };
    recommendations: PreferenceVizResponseObject;
    Visualizer:
        | React.FC<PreferenceVizComponentProps<PreferenceVizRecommendedItem>>
        | React.FC<PreferenceVizComponentProps<Movie>>;
    visualizerProps: {
        xCol: string;
        yCol: string;
        isFisheye?: boolean;
        onInteract: (event: string, data?: Record<string, unknown>, id?: string) => void;
        onHover: (item_id: string) => void;
    };
    setSelectedMovie: (movie: PreferenceVizRecommendedItem | Movie | undefined) => void;
}
// ============================================================================
// BACKEND RESPONSE SCHEMAS (Generic & Ready for rssa-api)
// ============================================================================

export interface RecommendationRequestPayload {
    step_id: string;
    step_page_id?: string;
    context_tag: string;
    // Exactly matches Python's StandardRecContext and EmotionRecContext
    schema_type?: 'standard' | 'standard_emotion' | 'community_comparison' | 'community_advisors';
    algorithm_key?: string;
    emotion_input?: Record<string, number | string>;
}

export interface EnrichedResponseWrapper<T> {
    response_type: 'standard' | 'community_comparison' | 'community_advisors' | string;
    items: T[];
}

export interface EnrichedCommunityScoreItem<T = any> {
    item: T;
    community_score: number;
    community_label: number;
    score: number;
    label: number;
    cluster: number;
}
// ============================================================================
// ESSAY / INTERACTION SCHEMAS
// ============================================================================
export interface EssayResponseObject {
    familiarity: string;
    exploration: string;
    explanation: string;
}

export interface EssayResponse {
    id?: string;
    payload_json: EssayResponseObject;
    version?: number;
}

export interface ParticipantResponsePayload {
    study_step_id: string;
    study_step_page_id: string | null;
    context_tag: string;
    payload_json: EssayResponseObject;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================
export function isPreferenceVizRecommendedItem(
    item: PreferenceVizRecommendedItem | Movie
): item is PreferenceVizRecommendedItem {
    return (item as PreferenceVizRecommendedItem).user_score !== undefined;
}
