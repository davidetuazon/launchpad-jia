'use client'

import React from "react"
import CareerReviewSection from "./CareerReviewSection";
import ReviewCareerDetails from "./ReviewSections/ReviewCareerDetails";
import ReviewCVSCreening from "./ReviewSections/ReviewCVScreening";
import ReviewAiInterviewSetup from "./ReviewSections/ReviewAiInterviewSetup";

type Props = {
    formData: any,
    steps: any,
}

export default function CareerFormReview({ formData, steps }: Props) {
    
    // TODO: Finish edit button logic at CareerReviewSection.tsx
    //      should direct users to which form step the edit button is mounted
    return (
        <div style={{ overflowY: 'auto', maxHeight: '100dvh', scrollBehavior: 'smooth', scrollbarWidth: 'none', display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 24, alignItems: "flex-start", marginTop: 26 }}>
            <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                <CareerReviewSection title={steps[0].title} steps={0}>
                    <ReviewCareerDetails formData={formData} />
                </CareerReviewSection>
                <CareerReviewSection title={`${steps[1].title} Questions`} steps={1}>
                    <ReviewCVSCreening formData={formData} />
                </CareerReviewSection>
                <CareerReviewSection title={steps[2].title} steps={2}>
                    <ReviewAiInterviewSetup formData={formData} />
                </CareerReviewSection>
            </div>
        </div>
    )
}