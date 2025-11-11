'use client'

import React, { useEffect } from "react"

type Props = {
    formData: any,
}

export default function ReviewCareerDetails({ formData }: Props) {
    
    // helper for applying bottom border :D
    const containerStyleHelper = (type: 'flex' | 'grid', isLast: boolean) => ({
        ...(type === 'flex' ? styles.flexContainer : styles.gridContainer),
        borderBottom: isLast ? 'none' : '2px solid #e4e6e9ff',
    });

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>

            {/* JOB TITLE */}
            <div style={containerStyleHelper('flex', false)}>
                <div style={styles.content}>
                    <span style={styles.title}>Job Title</span>
                    <span >{formData?.jobTitle}</span>
                </div>
            </div>

            {/* EMPLOYMENT */}
            <div style={containerStyleHelper('grid', false)}>
                <div style={styles.content}>
                    <span style={styles.title}>Employment Type</span>
                    <span >{formData?.employmentType}</span>
                </div>
                <div style={styles.content}>
                    <span style={styles.title}>Work Arrangement</span>
                    <span >{formData?.workSetup}</span>
                </div>
            </div>

            {/* LOCATION */}
            <div style={containerStyleHelper('grid', false)}>
                <div style={styles.content}>
                    <span style={styles.title}>Country</span>
                    <span >{formData?.country}</span>
                </div>
                <div style={styles.content}>
                    <span style={styles.title}>Province / State</span>
                    <span >{formData?.province}</span>
                </div>
                <div style={styles.content}>
                    <span style={styles.title}>City</span>
                    <span >{formData?.location}</span>
                </div>
            </div>

            {/* SALARY */}
            <div style={containerStyleHelper('grid', false)}>
                <div style={styles.content}>
                    <span style={styles.title}>Minimum Salary</span>
                    <span >
                        {formData?.minimumSalary !== null || undefined
                            ?  `PHP ${formData.minimumSalary.toLocaleString()}`
                            : formData?.salaryNegotiable
                                ? 'Negotiable'
                                : 'N/A'
                        }
                    </span>
                </div>
                <div style={styles.content}>
                    <span style={styles.title}>Maximum Salary</span>
                    <span >
                        {formData?.maximumSalary !== null || undefined
                            ?  `PHP ${formData.maximumSalary.toLocaleString()}`
                            : formData?.salaryNegotiable
                                ? 'Negotiable'
                                : 'N/A'
                        }
                    </span>
                </div>
            </div>

            {/* JOB DESCRIPTION */}
            <div style={containerStyleHelper('flex', true)}>
                <div style={styles.content}>
                    <span style={styles.title}>Job Description</span>
                    <span dangerouslySetInnerHTML ={{ __html: formData?.description }}>
                    </span>
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