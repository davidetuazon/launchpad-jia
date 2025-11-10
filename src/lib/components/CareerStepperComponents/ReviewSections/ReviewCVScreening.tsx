'use client'

import React from "react";

type Props = {
    formData: any,
}

export default function ReviewCVSCreening({ formData }: Props) {

    // should've modularize these... but oh well
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
                    border: '1px solid #ADD8E6',
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
                    border: '1px solid #D3D3D3',
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

            {/* CV SCREENING SETTING */}
            <div style={containerStyleHelper('flex', false)}>
                <div style={styles.content}>
                    <span style={styles.title}>CV Screening</span>
                    <span>
                        {formData?.cvScreeningSetting === 'No Automatic Promotion' ? "" : 'Automatically endorses candidates who are ' }
                        <span 
                            style={{
                                ...getStatusStyle(formData?.cvScreeningSetting),
                                padding: '2px 10px',
                                borderRadius: '13px',
                                fontWeight: 700,
                            }}
                        >
                            {formData?.cvScreeningSetting}
                        </span>
                    </span>
                </div>
            </div>

            {/* PRE-SCREENING QUESTIONS */}
            <div style={containerStyleHelper('flex', true)}>
                <div style={styles.content}>
                    <span style={styles.title}>Pre-Screening Questions</span>
                    <span style={styles.title}>
                        TODO: Finish the add pre-screening questions logic
                        <br/>
                        DEADLINE: Tomorrow, November 10, 2025
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