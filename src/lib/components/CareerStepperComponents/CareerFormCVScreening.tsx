"use client"

import { useEffect, useState } from "react";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import { useFormContext, Controller } from "react-hook-form";
import CareerFormTipsContainer from "./CareerFormTipsContainer";

type Props = {
    career: any,
    onFormStateChange?: (isEmpty: boolean) => void,
}

const cvScreeningSettingList = [
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

const cvScreeningTips = [
    {
        title: "Add Pre-Screening questions",
        description: `to collect key details such as notice period, work setup or salary expectations to guide your review and candidate discussions.`
    }
]

export default function CareerFormCVScreening({ career, onFormStateChange }: Props) {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();

    const watchedFields = watch([
        "cvScreeningSetting",
    ]);

    useEffect(() => {
        const isEmpty = watchedFields.every((field) => {
            if (typeof field === 'string') return field.trim() === "";
            if (typeof field === 'number') return field === 0 || field === null || field === undefined;
            return !field;
        });

        onFormStateChange?.(isEmpty);
    }, [watchedFields, onFormStateChange]);

    return (
            <div style={{ border: '1px solid red', overflowY: 'auto', display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 16, alignItems: "flex-start", marginTop: 16 }}>
                <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 24 }}>
                    <div className="layered-card-middle">

                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, padding: '0px 5px' }}>
                        <span style={{fontSize: 19, color: "#181D27", fontWeight: 700}}>1. CV Review Settings</span>
                        </div>
                        <div className="layered-card-content">

                            {/* CV SCREENING */}
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>CV Screening</span>
                            <span>Jia automatically endorses candidates who meet the chosen criteria.</span>
                            <Controller
                                name="cvScreeningSetting"
                                control={control}
                                defaultValue={career?.cvScreeningSetting || cvScreeningSettingList[0].name}
                                render={({ field: { onChange, value}, fieldState }) => (
                                    <>
                                        <CustomDropdown
                                        onSelectSetting={onChange}
                                        screeningSetting={value || cvScreeningSettingList[0].name}
                                        settingList={cvScreeningSettingList}
                                        />
                                        { fieldState.error && (
                                            <p style={{ color: '#e53935', fontSize: 16, fontWeight: 400, paddingTop: '5px' }}>
                                                {fieldState.error.message}
                                            </p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                    <div className="layered-card-middle">

                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, padding: '0px 5px' }}>
                        <span style={{fontSize: 19, color: "#181D27", fontWeight: 700}}>2. Pre-Screening Questions</span>
                        </div>
                        <div className="layered-card-content">

                           {/* TODO: Create a question generator for pre-screeing questions  */}
                        {/* <InterviewQuestionGeneratorV2
                            questions={questions}
                            setQuestions={(questions) => setQuestions(questions)}
                            jobTitle={jobTitle}
                            description={description}
                        /> */}
                        </div>
                    </div>
                </div>
                 <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 24 }}>
                    <CareerFormTipsContainer>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 24,  padding: '10px' }}>
                        {cvScreeningTips.map((tip, idx) => (
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