import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { useStudy } from '@rssa-project/api';
import { useDebounce, useStepCompletion, type StudyLayoutContextType } from '@rssa-project/study-template';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import Parse from 'html-react-parser';
import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type {
    EssayResponse,
    EssayResponseObject,
    ParticipantResponsePayload,
} from '../../types/preferenceVisualization.types';

interface MutationResult {
    type: 'POST' | 'PATCH';
    id: string;
    familiarity: string;
    exploration: string;
    explanation: string;
    version: number;
}

const PROMPTS = {
    familiarity: '<p>Use your answers above to reflect upon your current movie preferences.</p>',
    exploration: `<p>Reflect upon the movies in the visualization that may help you:
				<ol type="a" style="margin: 0.5rem" className="list-disc">
					<li style="margin: 0 0.25em 0.5em 1em;">
						Explore a new interest (e.g. an unfamiliar genre or topic)?
					</li>
					<li style="margin: 0 0.25em 0.5em 1em;">
						Widen an existing interest (e.g. an unfamiliar direction within a familiar genre)
					</li>
					<li style="margin: 0 0.25em 0.5em 1em;">
						Deepen an existing interest (e.g. a specialization of a familiar genre)
					</li>
				</ol>
			</p>`,
    explanation: `<p style="font-weight: 500">
			Use your answers above to outline the concrete steps you would take to expand your movie preferences.
		</p>`,
};

const ParticipantResponsePanel = ({
    participantResponse,
    condition,
}: {
    participantResponse: EssayResponse | undefined;
    condition: { id: string; name: string };
}) => {
    const { studyApi } = useStudy();
    const { studyStep } = useOutletContext<StudyLayoutContextType>();
    const { setIsStepComplete } = useStepCompletion();

    const [localResponseDraft, setLocalResponseDraft] = useState<EssayResponseObject>({
        familiarity: '',
        exploration: '',
        explanation: '',
    });
    const debouncedDraft = useDebounce(localResponseDraft, 1500);

    const [expandedField, setExpandedField] = useState<keyof EssayResponseObject | null>(null);
    const [savedResponse, setSavedResponse] = useState<EssayResponseObject>({
        familiarity: '',
        exploration: '',
        explanation: '',
    });

    const startTime = useRef<number>(0);
    useEffect(() => {
        const storageKey = `${studyStep.study_id}_step_start_time_${studyStep.id}`;
        let storedStart = sessionStorage.getItem(storageKey);

        if (!storedStart) {
            storedStart = Date.now().toString();
            sessionStorage.setItem(storageKey, storedStart);
        }

        startTime.current = parseInt(storedStart, 10);
    }, [studyStep]);

    const queryClient = useQueryClient();
    const essayMutation = useMutation({
        mutationKey: ['essayResponse'],
        mutationFn: async (newResponse: EssayResponseObject): Promise<MutationResult> => {
            const currentResponse = queryClient.getQueryData<EssayResponse>(['essayResponse']);
            const recordId = currentResponse?.id;
            const recordVersion = currentResponse?.version;
            if (recordId && recordVersion) {
                const patchPayload: EssayResponse = {
                    id: recordId,
                    payload_json: { ...newResponse },
                    version: recordVersion,
                };
                await studyApi.patch<EssayResponse, void>(`responses/interactions/${recordId}`, patchPayload);
                return {
                    type: 'PATCH',
                    id: recordId,
                    exploration: newResponse.exploration,
                    familiarity: newResponse.familiarity,
                    explanation: newResponse.explanation,
                    version: recordVersion + 1,
                };
            } else {
                const postPayload: ParticipantResponsePayload = {
                    study_step_id: studyStep.id,
                    study_step_page_id: null,
                    context_tag: `pref_viz-${condition.id}-${condition.name}`,
                    payload_json: {
                        exploration: newResponse.exploration,
                        familiarity: newResponse.familiarity,
                        explanation: newResponse.explanation,
                    },
                };
                const response = await studyApi.post<ParticipantResponsePayload, EssayResponse>(
                    'responses/interactions/',
                    postPayload
                );
                return {
                    type: 'POST',
                    id: response.id!,
                    exploration: response.payload_json.exploration,
                    familiarity: response.payload_json.familiarity,
                    explanation: response.payload_json.explanation,
                    version: response.version || 1,
                };
            }
        },
        onSuccess: (result) => {
            const newPayload = {
                familiarity: result.familiarity,
                exploration: result.exploration,
                explanation: result.explanation,
            };
            setSavedResponse(newPayload);

            queryClient.setQueryData(['essayResponse'], (oldData: EssayResponse | undefined) => ({
                ...(oldData || {}),
                id: result.id,
                version: result.version,
                payload_json: newPayload,
            }));
        },
    });

    useEffect(() => {
        if (participantResponse?.payload_json) {
            setLocalResponseDraft(participantResponse.payload_json);
            setSavedResponse(participantResponse.payload_json);
        }
    }, [participantResponse]);

    const hasUnsavedChanges =
        localResponseDraft.familiarity !== savedResponse.familiarity ||
        localResponseDraft.exploration !== savedResponse.exploration ||
        localResponseDraft.explanation !== savedResponse.explanation;

    useEffect(() => {
        const autoSave = async () => {
            if (hasUnsavedChanges && !essayMutation.isPending) {
                essayMutation.mutate(debouncedDraft);
            }
        };
        autoSave();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedDraft]);

    useEffect(() => {
        const evaluateCompletion = () => {
            const durationMs = Date.now() - startTime.current;
            const exploration = localResponseDraft.exploration.trim();
            const familiarity = localResponseDraft.familiarity.trim();
            const explanation = localResponseDraft.explanation.trim();
            const allFieldsFilled = exploration !== '' && familiarity !== '' && explanation !== '';
            const allFieldsMinLen = exploration.length > 15 && familiarity.length > 15 && explanation.length > 15;

            const isSafeToProceed = !hasUnsavedChanges && !essayMutation.isPending;
            setIsStepComplete(durationMs > 30000 && allFieldsFilled && isSafeToProceed && allFieldsMinLen);
        };
        evaluateCompletion();

        const intervalId = setInterval(evaluateCompletion, 1000);

        return () => clearInterval(intervalId);
    }, [localResponseDraft, setIsStepComplete, essayMutation.isPending, hasUnsavedChanges]);

    const handleTextChange = (field: keyof EssayResponseObject, value: string) => {
        setLocalResponseDraft((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSaveClick = async () => {
        await essayMutation.mutateAsync(localResponseDraft);
        setExpandedField(null);
    };

    return (
        <div className="bg-slate-100 py-3 px-2 my-1 rounded-md text-left" id="participant-response-panel">
            <div className="my-1" id="response-instructions">
                <p className="text-sm">
                    Please use the preference visualization on the right to collect notes for your class essay. Use the
                    boxes below to write your notes.
                </p>
            </div>
            {essayMutation.isPending && <p>Saving...</p>}

            {(['exploration', 'familiarity', 'explanation'] as const).map((field) => (
                <ResponseForm
                    key={field}
                    promptTag={field}
                    promptText={PROMPTS[field]}
                    text={localResponseDraft[field]}
                    onTextChange={(value) => handleTextChange(field, value)}
                    onExpand={() => setExpandedField(field)}
                />
            ))}

            <div className="text-left mt-5 flex justify-start items-center h-10">
                {essayMutation.isPending ? (
                    <span className="text-sm font-light text-amber-600 animate-pulse flex items-center gap-2">
                        <svg
                            className="animate-spin h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                            <path
                                d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        Saving draft...
                    </span>
                ) : hasUnsavedChanges ? (
                    <span className="text-sm font-light text-gray-400">Typing...</span>
                ) : (
                    <span className="text-sm font-light text-green-600">✓ All progress saved</span>
                )}
            </div>

            <Dialog open={expandedField !== null} onClose={() => setExpandedField(null)} className="relative z-50">
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel
                        className={clsx(
                            'w-full max-w-4xl transform overflow-hidden rounded-2xl',
                            'bg-white p-6 text-left align-middle shadow-xl transition-all'
                        )}
                    >
                        <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 border-b pb-2 mb-4">
                            {expandedField && Parse(PROMPTS[expandedField])}
                        </DialogTitle>

                        <div className="mt-2">
                            <textarea
                                value={expandedField ? localResponseDraft[expandedField] : ''}
                                onChange={(e) => expandedField && handleTextChange(expandedField, e.target.value)}
                                className={clsx(
                                    'w-full h-[60vh] p-4 text-base rounded-md border-gray-300',
                                    'focus:border-amber-500 focus:ring-amber-500 font-mono'
                                )}
                                placeholder="Enter your detailed response here..."
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                className={clsx(
                                    'inline-flex justify-center rounded-md border border-transparent',
                                    'bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200',
                                    'focus:outline-none focus-visible:ring-2',
                                    'focus-visible:ring-gray-500 focus-visible:ring-offset-2'
                                )}
                                onClick={() => setExpandedField(null)}
                            >
                                Close
                            </button>
                            <button
                                type="button"
                                className={clsx(
                                    'inline-flex justify-center rounded-md border border-transparent',
                                    'bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600',
                                    'focus:outline-none focus-visible:ring-2',
                                    'focus-visible:ring-amber-500 focus-visible:ring-offset-2 disabled:opacity-50'
                                )}
                                onClick={handleSaveClick}
                                disabled={!hasUnsavedChanges || essayMutation.isPending}
                            >
                                {essayMutation.isPending ? 'Saving...' : 'Save & Close'}
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

const ResponseForm = ({
    promptTag,
    promptText,
    text,
    onTextChange,
    onExpand,
}: {
    promptTag: string;
    promptText: string;
    text: string;
    onTextChange: (text: string) => void;
    onExpand: () => void;
}) => {
    return (
        <div className="mt-5 relative group" id={`response-group-${promptTag}`}>
            <label htmlFor={promptTag} className="block mb-1 text-sm">
                {Parse(promptText)}
            </label>
            <div className="relative">
                <textarea
                    id={promptTag}
                    value={text}
                    name={promptTag}
                    placeholder="Enter your response..."
                    onChange={(evt) => onTextChange(evt.target.value)}
                    className={clsx(
                        'rounded-md',
                        'p-3 mt-1',
                        'block w-full rounded-md border-amber-400',
                        'shadow-sm focus:border-yellow-500 focus:ring-yellow-500',
                        'sm:text-sm font-mono',
                        '[&::-webkit-scrollbar]:w-1.5',
                        '[&::-webkit-scrollbar-track]:bg-transparent',
                        '[&::-webkit-scrollbar-thumb]:bg-gray-300',
                        '[&::-webkit-scrollbar-thumb]:rounded-full',
                        'hover:[&::-webkit-scrollbar-thumb]:bg-gray-400'
                    )}
                />
                <button
                    type="button"
                    onClick={onExpand}
                    className={clsx(
                        'absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600',
                        'bg-white/50 hover:bg-white rounded-md transition-colors enlarge-text-btn'
                    )}
                    title="Enlarge text area"
                    id={`enlarge-btn-${promptTag}`}
                >
                    <ArrowsPointingOutIcon className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

export default ParticipantResponsePanel;
