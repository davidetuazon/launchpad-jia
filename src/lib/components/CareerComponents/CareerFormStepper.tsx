"use client"

import { useCallback, useEffect, useRef, useState } from "react";
import InterviewQuestionGeneratorV2 from "./InterviewQuestionGeneratorV2";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import { candidateActionToast, errorToast } from "@/lib/Utils";
import { useAppContext } from "@/lib/context/AppContext";
import axios from "axios";
import CareerActionModal from "./CareerActionModal";
import FullScreenLoadingAnimation from "./FullScreenLoadingAnimation";

// imports for implementing stepper/segmented career form
import { useForm, FormProvider } from 'react-hook-form';
import { careerInputSanitation, careerInputData } from "@/lib/utils/helpersV2";
import {  zodResolver } from '@hookform/resolvers/zod';

import CareerFormDetails from "../CareerStepperComponents/CareerFormDetails";

export default function CareerFormStepper({ career, formType, setShowEditModal }: { career?: any, formType: string, setShowEditModal?: (show: boolean) => void }) {
    const { user, orgID } = useAppContext();
    const [isSavingCareer, setIsSavingCareer] = useState(false);
    const [isFormEmpty, setIsFormEmpty] = useState(true);
    const [showSaveModal, setShowSaveModal] = useState<'active' | 'inactive' | ''>('');
    const [step, setStep] = useState(0);
    
    const steps = [
        { title: 'Career Details & Team Access' },
        { title: 'CV Review & Pre-screening' },
        { title: 'AI Interview Setup' },
        { title: 'Review Career' }
    ];

    const stepFields = [
        ['jobTitle', 'employmentType', 'workSetup', 'minimumSalary', 'maximumSalary', 'description'],
    ]

    const methods = useForm({
        resolver: zodResolver(careerInputSanitation),
        defaultValues: {
            ...career,
            requireVideo: career?.requireVideo ?? true,
            salaryNegotiable: career?.salaryNegotiable ?? true,
        },
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
    });

    const { trigger } = methods;
    
    /**
     * Career draft setting-getting functions
     * currently localstorage-based
     * TODO: Improvement: allow partial saving on the db as well to allow persistence across devices
     */
    const getStorageKey = useCallback(() => {
        return career?._id ? `career_${career._id}` : 'career_draft';
    }, [career?._id]);

    // handles draft saving to localstorage
    const saveToLocal = useCallback((data: careerInputData, currentStep: number) => {
        const payload = { version: 1, data, step: currentStep };
        try {
            localStorage.setItem(getStorageKey(), JSON.stringify(payload));
        } catch (e) {
            errorToast("Failed to save draft locally", 1300);
        }
    }, [getStorageKey]);

    const loadFromLocal = useCallback(() => {
        const key = getStorageKey();
        const savedDraft = localStorage.getItem(key);
        if (!savedDraft) return;

        try {
            const parsed = JSON.parse(savedDraft);
            if (parsed?.data) {
                methods.reset(parsed.data);
                if (typeof parsed.step === 'number') setStep(parsed.step);
            } else {
                methods.reset(parsed);
            }
        } catch (e) {
            localStorage.removeItem(key);
        }
    }, [getStorageKey, methods]);

    const clearLocalDraft = useCallback(() => {
        localStorage.removeItem(getStorageKey());
    }, [getStorageKey]);

    /**
     * handles draft autosaving
     */
    useEffect(() => {
        const subscribe = methods.watch((_, { name }) => {
            const timeOut = setTimeout(() => {
                const data = methods.getValues();
                saveToLocal(data, step);
            }, 5000); // autosaves every 5 sec of inactivity
            return () => clearTimeout(timeOut);
        });

        return subscribe.unsubscribe();
    }, [methods, saveToLocal, step]);

    useEffect(() => {
        loadFromLocal();
    }, [loadFromLocal]);

    /**
     * stepper form navigation
     * progressing the form saves each step as a draft to localstorage
     */
    // ensure required form fields are filled for the current step before progressing the form
    const validateStep = async (stepIndex: number) => {
        const fields = stepFields[stepIndex];
        const isValid = await trigger(fields, { shouldFocus: true });
        if (!isValid) {
            setStep(stepIndex);
            errorToast(`Please complete required fields at ${steps[stepIndex].title}.`, 2000);
            return false;
        }
        
        // include check for max > min salary as well for validation
        if (fields.includes("minimumSalary") || fields.includes("maximumSalary")) {
            const { minimumSalary, maximumSalary } = methods.getValues()
            if (Number(minimumSalary) && Number(maximumSalary) && Number(minimumSalary) > Number(maximumSalary)) {
                errorToast("Minimum salary cannot be greater than maximum salary.", 2000);
                setStep(0);
                return false;
            }
        }
        return true;
    };

    // enforces form validity check before allowing to progress
    const handleNext = async () => {
        if (!(await validateStep(step))) return;

        const data = methods.getValues();
        saveToLocal(data, step + 1);
        setStep((prev) => Math.min(prev + 1, steps.length - 1));
    };

    // allows backtracking
    const handlePrev = () => {
        setStep((prev) => Math.max(prev - 1, 0));
    }

    /**
     * form submit handler
     */
    // unified submit handler for both add and edit career
    const onSubmit = async (data: careerInputData, status: 'active' | 'inactive') => {
        let userInfoSlice = {
            image: user.image,
            name: user.name,
            email: user.email,
        };

        const payload = {
            ...data,
            orgID,
            status,
            lastEditedBy: userInfoSlice,
            createdBy: userInfoSlice,
            minimumSalary: isNaN(Number(data.minimumSalary)) ? null : Number(data.minimumSalary),
            maximumSalary: isNaN(Number(data.maximumSalary)) ? null : Number(data.maximumSalary),
            question: data.questions || [],
        }

        try {
            setIsSavingCareer(true);
            const response = formType === "add"
                ? await axios.post('/api/add-career', payload)
                : await axios.post('/api/update-career', payload);

            if (response.status === 200) {
                candidateActionToast(
                    <div
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, marginLeft: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: "#181D27" }}>
                            Career added {career?.status === "active" ? "and published" : ""}
                        </span>
                    </div>,
                    1300, 
                <i className="la la-check-circle" style={{ color: "#039855", fontSize: 32 }}></i>)
                clearLocalDraft();
                setTimeout(() => {
                    window.location.href = `/recruiter-dashboard/careers`;
                }, 1300);
            }
        } catch (error) {
            console.log({ error });
            errorToast("Failed to add career", 1300);
        } finally {
            setIsSavingCareer(false);
        }
    }

    // handle redirect to form field with errors
    // also handles opening action modal for action confirmation
    const handleFinalSubmit = async (status: 'active' | 'inactive') => {
        for (let i = 0; i < stepFields.length; i++) {
            if (!(await validateStep(i))) return;
        }
        setShowSaveModal(status);
    }

    // closes action modal
    // calls onSubmit
    // skips validations for career drafts marked as 'inactive'
    // enforces validations on to be published careers
    const confirmSaveCareer = async (status: 'active' | 'inactive') => {
        setIsSavingCareer(true);
        const data = methods.getValues();
        setShowSaveModal('');
        try {
            // For inactive/draft saves, skip validation
            if (status === 'inactive') {
                await onSubmit(data, status);
                return;
            } else {
                await methods.handleSubmit(async (data) => {
                    await onSubmit(data, status);
                })();
            }
        } finally {
            setIsSavingCareer(false);
        }
    };

    return (
        <div className="col">
            <FormProvider {...methods}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                    }}
                >
                    <div
                        // className="flex justify-between mt-6"
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: 'space-between',
                            gap: "10px",
                            paddingBottom: '10px',
                            borderBottom: '1px solid #D5D7DA'
                        }}
                    >
                        <h1 style={{ fontSize: "24px", fontWeight: 550, color: "#111827" }}>
                            {career?.jobTitle ? `[Draft] ${career.jobTitle}` : 'Add new career'}
                        </h1>
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: 'space-between',
                                gap: "10px",
                            }}
                        >
                        <button
                            type="button"
                            disabled={step === 0 || isFormEmpty}
                            onClick={handlePrev}
                            style={{
                                width: "fit-content",
                                background: step === 0 || isSavingCareer || isFormEmpty ? "#414651" : "black",
                                color: "#fff",
                                border: "1px solid #D5D7DA",
                                padding: "8px 16px",
                                borderRadius: "60px",
                                cursor: step === 0 || isSavingCareer || isFormEmpty ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap"
                            }}
                        >
                            Back
                        </button>
                         <button
                            type="button"
                            onClick={() => handleFinalSubmit('inactive')}
                            disabled={isSavingCareer || isFormEmpty}
                            style={{
                                width: "fit-content",
                                color: "#414651",
                                background: "#fff",
                                border: "1px solid #D5D7DA",
                                padding: "8px 16px",
                                borderRadius: "60px",
                                cursor: isSavingCareer || isFormEmpty  ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap"
                            }}
                        >
                                Save as Unpublished
                        </button>
                        { step < steps.length - 1 ? (
                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={isSavingCareer || isFormEmpty}
                            style={{
                                width: "fit-content",
                                background: isFormEmpty ?  "#414651" : "black",
                                color: "#fff",
                                border: "1px solid #D5D7DA",
                                padding: "8px 16px",
                                borderRadius: "60px",
                                cursor: isSavingCareer || isFormEmpty ? "not-allowed" : "pointer",
                                whiteSpace: "nowrap"
                            }}
                            >
                                Save and Continue&nbsp;
                                <i
                                    className="la la-arrow-right"
                                    style={{
                                        color: "#fff",
                                        fontSize: 20,
                                        marginRight: 8
                                    }}
                                ></i>
                            </button>  
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleFinalSubmit('active')}
                                disabled={isSavingCareer}
                                style={{
                                    width: "fit-content",
                                    background: "black",
                                    color: "#fff",
                                    border: "1px solid #D5D7DA",
                                    padding: "8px 16px",
                                    borderRadius: "60px",
                                    cursor: isSavingCareer ? "not-allowed" : "pointer",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                Publish&nbsp;
                                <i className="la la-check-circle" style={{ color: "#fff", fontSize: 20, marginRight: 8 }}></i>
                            </button>
                        )}
                        </div>
                    </div>
                    {step === 0 && <CareerFormDetails career={career} onFormStateChange={(empty) => setIsFormEmpty(empty)} />}
                    {/* {step === 1 && <CareerFormCVScreening />}
                    {step === 2 && <CareerFormAiInterviewSetup />}
                    {step === 3 && <CareerFormReview />} */}
                </form>
                {showSaveModal && (
                    <CareerActionModal 
                        action={showSaveModal} 
                        onAction={(action) => confirmSaveCareer(action as 'active' | 'inactive')} 
                    />
                )}
                {isSavingCareer && (
                    <FullScreenLoadingAnimation
                        title={formType === "add" ? "Saving career..." : "Updating career..."}
                        subtext={`Please wait while we are ${formType === "add" ? "saving" : "updating"} the career`}
                    />
                )}
            </FormProvider>
        </div>
    )
}