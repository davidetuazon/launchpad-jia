"use client"

import { useEffect, useState } from "react";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import AiInterviewQuestionGenerator from "./AiInterviewQuestionGenerator";
import { useFormContext, Controller } from "react-hook-form";
import { errorToast, guid } from "@/lib/Utils";
import CareerFormTipsContainer from "./CareerFormTipsContainer";

type Props = {
    career: any,
    onFormStateChange?: (isEmpty: boolean) => void,
}

const aiScreeningSettingList = [
    {
        name: "Good Fit and above",
        icon: "la la-check",
    },
    {
        name: "Only Strong Fit",
        icon: "la la-check-double",
    },
    {
        name: "No Automatic Promotion",
        icon: "la la-times",
    },
];

const defaultCategories = [
    { id: 1, category: "CV Validation / Experience", questionCountToAsk: null, questions: [] },
    { id: 2, category: "Technical", questionCountToAsk: null, questions: [] },
    { id: 3, category: "Behavioral", questionCountToAsk: null, questions: [] },
    { id: 4, category: "Analytical", questionCountToAsk: null, questions: [] },
    { id: 5, category: "Others", questionCountToAsk: null, questions: [] },
]

const aiScreeningTips = [
    {
        title: 'Use "Generate Questions"',
        description: `to quickly create tailored interview questions, then refine or mix them with your own for balanced results.`
    }
]

export default function CareerFormAiInterviewSetup({ career, onFormStateChange }: Props) {
    const { control, watch, setValue } = useFormContext();
    const requireVideo = watch('requireVideo');

    /**
     * get questions from career or saved draft
     * makes sure question groups and individual questions has a unique id
     */
    const initQuestions = (career: any) => {
        try {
            const savedDraft = localStorage.getItem('career_draft');
            const parsed = savedDraft ? JSON.parse(savedDraft) : null;
            const qs = parsed.data.aiQuestions || career?.aiQuestions|| defaultCategories
            return qs.map((cat) => ({
                ...cat,
                id: cat.id || guid(),
                questions: (cat.questions || []).map(q => ({ ...q, id: q.id || guid() })),
            }))
        } catch (e) {
            console.warn('Error parsing draft from localStorage: ', e);
            errorToast('Error fetching locally saved draft.', 1300);
        }
        return career?.aiQuestions || defaultCategories;
    }

    // initialize questions and syncs form on mount
    const [questions, setQuestions] = useState(() => initQuestions(career) || []);

    useEffect(() => {
        setValue('aiQuestions', questions);
    }, [questions, setValue]);


    // update questions and form together
    const handleQuestions = (newQuestions) => {
        setQuestions(newQuestions);
        setValue('aiQuestions', newQuestions);
    }

    // syncs questions and the form state
    useEffect(() => {
        const normalized = questions.map(cat => ({ ...cat, questions: cat.questions || [] }));
        setValue('aiQuestions', normalized);
    }, [questions, setValue]);

    const watchedFields = watch([
        "aiScreeningSetting",
        "aiQuestions"
    ]);

    useEffect(() => {
        const isEmpty = (() => {
            const baseEmpty = watchedFields
                .filter(f => f !== questions)
                .every(f => (typeof f === 'string' ? !f.trim() : !f));

            const questionField = watchedFields.find(f => Array.isArray(f) && f.every(cat => 'questions' in cat));
            const totalQuestions = questionField ? questionField.reduce((sum, cat) => sum + (cat.questions?.length || 0), 0) : 0;

            return baseEmpty || totalQuestions < 5;
        })();

        onFormStateChange?.(isEmpty);
    }, [watchedFields, onFormStateChange]);

    useEffect(() => {
        if (career?.requireVideo !== undefined) {
            setValue("requireVideo", career.requireVideo);
        }
    }, [career, setValue]);

    return (
        <div style={{ overflowY: 'auto', maxHeight: '100dvh', scrollBehavior: 'smooth', scrollbarWidth: 'none', display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 26 }}>
            <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="layered-card-middle">

                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, padding: '0px 5px' }}>
                    <span style={{fontSize: 19, color: "#181D27", fontWeight: 700}}>1. AI Interview Settings</span>
                    </div>
                    <div className="layered-card-content">

                        {/* CV SCREENING */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10, borderBottom: '1px solid #D5D7DA', paddingBottom: '30px'}}>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>AI Interview Screening</span>
                            <span>Jia automatically endorses candidates who meet the chosen criteria.</span>
                            <Controller
                                name="aiScreeningSetting"
                                control={control}
                                defaultValue={career?.cvScreeningSetting || aiScreeningSettingList[0].name}
                                render={({ field: { onChange, value}, fieldState }) => (
                                    <>
                                        <CustomDropdown
                                        onSelectSetting={onChange}
                                        screeningSetting={value || aiScreeningSettingList[0].name}
                                        settingList={aiScreeningSettingList}
                                        />
                                        { fieldState.error && (
                                            <p style={{ color: '#e53935', fontSize: 16, fontWeight: 350, paddingTop: '5px' }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700, paddingTop: '20px'}}>Require Video Interview</span>
                        <span>
                            Require candidates to keep their camera on. Recordings will appear on their analysis page.
                        </span>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", padding: '5px 0px' }}>
                            <div>
                                <i className="la la-video" style={{ padding: '0px 10px', transform: 'scale(1.5)' }}></i>
                                <span>Require Video Interview</span>
                            </div>
                            <Controller
                                name="requireVideo"
                                control={control}
                                defaultValue={career?.requireVideo ?? true}
                                render={({ field: { onChange, value }}) => (
                                    <div style={{ display: "flex", flexDirection: "row", justifyContent: 'center', justifyItems: 'center', gap: 8, minWidth: "130px" }}>
                                        <label className="switch">
                                            <input type="checkbox" checked={requireVideo} onChange={(e) => onChange(e.target.checked)} />
                                            <span className="slider round"></span>
                                        </label>
                                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 400}}>
                                            {requireVideo ? 'Yes' : 'No'}
                                        </span>
                                    </div>
                                )}
                            />
                        </div>
                    </div>
                </div>
                <div className="layered-card-middle">

                    {/* AI INTERVIEW QUESTIONS */}
                    <div>
                        <Controller
                            name="aiQuestions"
                            control={control}
                            render={({ field: { onChange }, fieldState }) => (
                                <>
                                    { fieldState.error && (
                                        <p style={{ color: '#e53935', fontSize: 16, fontWeight: 400, paddingLeft: '5px' }}>
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                    <AiInterviewQuestionGenerator
                                        questions={questions}
                                        setQuestions={handleQuestions}
                                        jobTitle={career?.jobTitle}
                                        description={career?.description}
                                    />
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
            <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 24, position: 'sticky', top: 0, }}>
                <CareerFormTipsContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24,  padding: '10px' }}>
                    {aiScreeningTips.map((tip, idx) => (
                        <div key={idx}>
                            <span style={{ fontSize: 16, color: "#181D27", fontWeight: 700 }}>
                                {tip.title}
                            </span>
                            &nbsp;{tip.description}
                        </div>
                    ))}
                </div>
                </CareerFormTipsContainer>
            </div>
        </div>
    )
}