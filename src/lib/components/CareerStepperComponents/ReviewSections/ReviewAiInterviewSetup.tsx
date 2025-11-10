'use client'

import React, { useEffect } from "react";
import { map } from "zod";
import ReviewQuestionsContainer from "./ReviewQuestionsContainer";

type Props = {
    formData: any,
}

export default function ReviewAiInterviewSetup({ formData }: Props) {

    // helper for applying bottom border :D
    const containerStyleHelper = (type: 'flex' | 'grid', isLast: boolean) => ({
        ...(type === 'flex' ? styles.flexContainer : styles.gridContainer),
        borderBottom: isLast ? 'none' : '2px solid #e4e6e9ff',
    });

    // helper for applying style to screening settings :D
    const getStatusStyle = (status) => {
        switch (status) {
            case 'Good Fit and above':
                return {
                    border: '1px solid #1E90FF',
                    backgroundColor: '#E6F7FF',
                    color: '#0000FF',
                };
            case 'Only Strong Fit':
                return {
                    border: '1px solid #B4E7B2',
                    backgroundColor: '#D0F0C0',
                    color: '#2E8B57',
                };
            case 'No Automatic Promotion':
                return {
                    border: '1px solid #808080',
                    backgroundColor: '#F0F0F0',
                    color: '#333333',
                };
            // just use gray for default
            default:
                return {
                    border: '1px solid #808080',
                    backgroundColor: '#D3D3D3',        
                    color: '#4B4B4B',                  
                };
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* AI SCREENING SETTING */}
            <div style={containerStyleHelper('flex', false)}>
                <div style={styles.content}>
                    <span style={styles.title}>AI Interview Screening</span>
                    <span>
                        {formData?.aiScreeningSetting === 'No Automatic Promotion' ? "" : 'Automatically endorses candidates who are ' }
                        <span 
                            style={{
                                ...getStatusStyle(formData?.aiScreeningSetting),
                                padding: '2px 10px',
                                borderRadius: '13px',
                                fontWeight: 700,
                            }}
                        >
                            {formData?.aiScreeningSetting}
                        </span>
                    </span>
                </div>
            </div>

            {/* REQUIRE VIDEO OPTION */}
            <div style={containerStyleHelper('flex', false)}>
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}
                >
                    <span style={styles.title}>Require Video on Interview</span>
                    <div style={{ display: 'flex', gap: 5 }}>
                        <span style={{ color: 'black' }}>{formData?.requireVideo ? 'Yes' : 'No'}</span>
                        {formData?.requireVideo
                        ? (
                        <div style={{ border: '1px solid #B4E7B2', padding: '0px 4px', borderRadius: '13px', backgroundColor: '#D0F0C0' }}>
                            <i className="la la-check" style={{ color: '#2E8B57', fontSize: 16 }}></i>
                        </div>
                        ) : (
                        <div style={{ border: '1px solid #FFB6B6', padding: '0px 4px', borderRadius: '13px', backgroundColor: '#FFEBEB' }}>
                            <i className="la la-times" style={{ color: '#8B0000', fontSize: 16 }}></i>
                        </div>
                        )}
                    </div>
                </div>
            </div>

            {/* AI INTERVIEW QUESTIONS */}
            <div style={containerStyleHelper('flex', true)}>
                <div style={styles.content}>
                    <span style={{...styles.title, display: 'flex', flexDirection: 'row', gap: 12 }}>
                        Inteview Questions
                        <div
                            style={{
                                fontSize: 14,
                                padding: '0px 10px',
                                background: "#D9E2EC",
                                borderRadius: '13px',
                                border: '1px solid #B0C4D4'
                                }}
                            >
                            {formData.aiQuestions.length}
                        </div>
                        </span>
                    {formData?.aiQuestions.map((q, idx) => (
                        <div key={idx}>
                            <ReviewQuestionsContainer title={q.category} questions={q.questions} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const styles: {[key: string]: React.CSSProperties} = {
    flexContainer: {
        padding: '20px 0px',
        borderBottom: '2px solid #e4e6e9ff',
    },
    gridContainer: {
        padding: '20px 0px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20,
        borderBottom: '2px solid #e4e6e9ff',
    },
    content: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    title: {
        fontSize: 16,
        color: "#181D27",
        fontWeight: 700,
    }
}