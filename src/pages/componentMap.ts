import { MovieRatingPage, SurveyPage, FeedbackPage, FinalPage } from '@rssa-project/study-template';
import InformedConsent from './ConsentPage';
import PreferenceVisualization from './preferencevisualization/PreferenceVisualization';
import ScenarioPage from './ScenarioPage';
import StudyOverviewPage from './StudyOverviewPage';
import DemographicsPage from './DemographicsPage';
import React from 'react';

export const componentMap: { [key: string]: React.FC } = {
    ConsentStep: InformedConsent,
    StudyOverviewStep: StudyOverviewPage,
    InstructionStep: ScenarioPage,
    SurveyStep: SurveyPage,
    PreferenceElicitationStep: (props) =>
        React.createElement(MovieRatingPage, { ...props, minRatingCount: 15, itemsPerPage: 18 }),
    TaskStep: PreferenceVisualization,
    ExtraStep: FeedbackPage,
    DemographicsStep: DemographicsPage,
    CompletionStep: FinalPage,
};
