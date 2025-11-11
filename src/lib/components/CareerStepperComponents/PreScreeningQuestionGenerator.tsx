import { useEffect, useState } from "react";
import { guid } from "@/lib/Utils";
import CustomDropdown from "../CareerComponents/CustomDropdown";

type QuestionOption = {
    id: string;
    label: string;
    value?: string | number;
};

type QuestionType = {
    id: string;
    title: string;
    type: string;
    options?: QuestionOption[];
};


const suggestedQuestions = [
    {
        title: 'Notice period',
        question: 'How long is your notice period?',
        type: 'dropdown',
    },
    {
        title: 'Work Setup',
        question: 'How often are you willing to report to the office each week?',
        type: 'dropdown',
    },
    {
        title: 'Asking salary?',
        question: 'How much is your expected salary?',
        type: 'range'
    }
]

const settingList = [
    { name: "dropdown" },
    { name: "range" },
  ];

/**
 * defaults newly created questions type to dropdown
 * adds 1 option to every questions on init
 * set unique ids to each questions with guid()
 */
export default function PreScreeningQuestionGenerator ({ questions, setQuestions }) {
    /**
     * questions related functions
     */
    // add a new blank question to the list
    // send updates to parent component
    const handleAddCustomClick = () => {
        const updated = [...questions, { id: guid(), title: '', type: 'dropdown', options: [] }];
        setQuestions(updated);
    };

    // clone existing array to avoid mutation
    // update title at given index then send new array to parent component
    const handleTitleChange = (idx: number, newTitle: string) => {
        const updated = [...questions];
        updated[idx].title = newTitle;
        setQuestions(updated);
    };

    // same cloning logic
    // updates question type
    const handleTypeChange = (idx: number, newType: string) => {
        const updated = [...questions];
        const target = { ...updated[idx] };

        if (!target.savedOptions) target.savedOptions = {};

        // store current options by type before switching
        target.savedOptions[target.type] = target.options?.map(opt => ({ ...opt })) || [];

        // update type
        target.type = newType;

        // restore previously saved options if any
        if (target.savedOptions[newType]) {
            target.options = target.savedOptions[newType].map(opt => ({ ...opt }));
        } else if (newType === "range") {
            target.options = [{ id: guid(), min: null, max: null }];
        } else if (newType === "dropdown") {
            target.options = [{ id: guid(), label: "" }];
        }

        updated[idx] = target;

        // send only clean data to parent
        setQuestions(updated.map(({ savedOptions, ...rest }) => rest));
    };

    // add options to questions
    const handleAddOption = (idx: number) => {
        const updated = [...questions];
        const target = { ...updated[idx] };

        const options = target.options ? [...target.options] : [];
        options.push({ id: guid(), label: '' });

        target.options = options;
        updated[idx] = target;

        setQuestions(updated);
    };

    // delete questions
    const handleDeleteQuestion = (idx: number) => {
        const updated = questions.filter((_, i) => i !== idx);
        setQuestions(updated);
    };

    // used for adding suggestions to question list
    // need to add disabling on already added question
    // or can do rotation if suggested question list grows
    const handleAddSuggestedQuestion = (q) => {
        const updated = [...questions, { id: guid(), title: q.question, type: q.type, options: [] }];
        setQuestions(updated);
    };

    /**
     * options related functions
     */
    // handle input changes on options
    const handleOptionChange = (qIdx: number, optIdx: number, newLabel: string) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[qIdx].options) {
            updatedQuestions[qIdx].options[optIdx].label = newLabel;
        }
        setQuestions(updatedQuestions);
    };

    const handleDeleteOption = (questionIdx: number, optionIdx: number) => {
        const updated = [...questions];
        if (updated[questionIdx].options) {
            updated[questionIdx].options = updated[questionIdx].options.filter((_, i) => i !== optionIdx);
        }
        setQuestions(updated);
    };

    const handleRangeChange = (qIdx: number, field: "min" | "max", value: number) => {
        const updated = [...questions];
        const opt = updated[qIdx].options?.[0];
        if (opt) opt[field] = value;
        setQuestions(updated);
    };

    return (
        <div className="layered-card-middle" style={{ padding: 0 }}>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between', width: '100%' }}>
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <span style={{fontSize: 19, color: "#181D27", fontWeight: 700, paddingLeft: '0px 5px'}}>
                        2. Pre-Screening Questions
                        </span>
                        <span>(optional)</span>
                        <div style={{ borderRadius: "13px", padding: '0px 7px', border: "1px solid #D5D9EB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, backgroundColor: "#F8F9FC", color: "#181D27", fontWeight: 700 }}>
                           {questions && questions.length}
                        </div>
                    </div>
                    <div
                        style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: 'black', padding: '7px 12px', borderRadius: '18px', cursor: 'pointer' }}
                        onClick={() => handleAddCustomClick()}
                    >
                        <i className="la la-plus" style={{ transform: 'scale(1.2)', color: '#ffff' }}></i>
                        <span style={{ color: '#ffff' }}>Add custom</span>
                    </div>
                </div>
            </div>
            <div className="layered-card-content" style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
                <div className="questions-set">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        { questions.length > 0 ? (
                            questions.map((q, qIdx) => (
                                <div key={q.id} className="layered-card-content" style={{ padding: 0, borderRadius: '20px', border: "1px solid #D5D9EB" }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#f8f9fc', padding: '20px', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
                                        <input 
                                            placeholder="Ask your applicants..."
                                            value={q.title}
                                            onChange={(e) => handleTitleChange(qIdx, e.target.value)}
                                            style={{ width: '60%', border: '2px solid #D5D7DA', borderRadius: '8px', padding: '5px 10px' }}
                                        />
                                        <div>
                                            <CustomDropdown
                                                screeningSetting={q.type}
                                                onSelectSetting={val => handleTypeChange(qIdx, val)}
                                                settingList={settingList}
                                                placeholder="Select type"
                                            />
                                        </div>
                                    </div>
                                    <div style={{ padding: '20px', paddingBottom: '0', display: 'flex', flexDirection: 'column' }}>
                                        
                                        {/* OPTIONS */}
                                        <div style={{  }}>

                                            {/* RENDER WHEN THERE ARE CURRENTLY NO OPTIONS ADDED YET */}
                                            {(q.type === 'dropdown' && q.options?.length === 0) && (
                                                <div style={{ borderBottom: '1px solid #D5D7DA', paddingBottom: '20px' }}>
                                                    <span>Add at least one (1) option for this question.</span>
                                                </div>
                                            )}

                                            {/* TYPE: DROPDOWN OPTIONS */}
                                            {(q.type === 'dropdown' && q.options?.length > 0) && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, }}>
                                                    {q.options.map((opt, optIdx) => (
                                                        <div
                                                            key={opt.id}
                                                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                                                        >
                                                            <div
                                                                style={{ border: '2px solid #D5D9EB', borderRadius: '12px', padding: '0px', width: '80%', position: 'relative', }}
                                                            >
                                                                <label
                                                                    htmlFor={`option_${opt.id}`}
                                                                    style={{ fontSize: 19, position: 'absolute', top: 3, left: 10,  }}
                                                                >
                                                                    {optIdx + 1}
                                                                </label>
                                                                <input
                                                                    key={`option_${opt.id}`}
                                                                    id={`option_${opt.id}`}
                                                                    value={opt.label}
                                                                    onChange={(e) => handleOptionChange(qIdx, optIdx, e.target.value)}
                                                                    style={{ width: '100%', border: 'none', borderRadius: '8px', padding: '5px 30px', paddingLeft: ' 30px' }}
                                                                />
                                                            </div>
                                                            <div key={opt.id} style={{ display: 'flex', alignContent: 'center', width:'fit-content'}}>
                                                                <i className="la la-times"
                                                                    style={{ transform: 'scale(1.3)', border: '2px solid #D5D9EB', padding: '3px', borderRadius: '18px', cursor: 'pointer' }}
                                                                    onClick={() => handleDeleteOption(qIdx, optIdx)}
                                                                ></i>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* TYPE: RANGE OPTIONS */}
                                            {q.type === 'range' && (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24, }}>
                                                    {q.options.map((opt, optIdx) => (
                                                         <div
                                                            key={opt.id}
                                                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', gap: 26 }}
                                                        >
                                                            <div
                                                                style={{ padding: '0px', position: 'relative', width: '100%' }}
                                                            >
                                                                <span>Minimum</span> 
                                                                <div>
                                                                    <label
                                                                        htmlFor={`option_${opt.id}`}
                                                                        style={{ fontSize: 19, position: 'absolute', top: 33, left: 10,  }}
                                                                    >PHP</label>
                                                                    <input
                                                                        key={`option_${opt.id}`}
                                                                        id={`option_${opt.id}`}
                                                                        type="number"
                                                                        className="form-control"
                                                                        placeholder="0"
                                                                        min={0}
                                                                        value={opt.min}
                                                                        onChange={(e) => handleRangeChange(qIdx, "min", Number(e.target.value))}
                                                                        style={{ width: '100%', border: 'none', borderRadius: '8px', padding: '5px 10px', paddingLeft: 50 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div
                                                                style={{ padding: '0px', position: 'relative', width: '100%' }}
                                                            >
                                                                <span>Maximum</span> 
                                                                <div>
                                                                    <label
                                                                        htmlFor={`option_${opt.id}`}
                                                                        style={{ fontSize: 19, position: 'absolute', top: 33, left: 10,  }}
                                                                    >PHP</label>
                                                                    <input
                                                                        key={`option_${opt.id}`}
                                                                        id={`option_${opt.id}`}
                                                                        type="number"
                                                                        className="form-control"
                                                                        placeholder="0"
                                                                        min={0}
                                                                        value={opt.max}
                                                                        onChange={(e) => handleRangeChange(qIdx, "max", Number(e.target.value))}
                                                                        style={{ width: '100%', border: 'none', borderRadius: '8px', padding: '5px 10px', paddingLeft: 50 }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        {/* ADD OPTION BUTTON */}
                                        {q.type === 'dropdown' && (
                                            <div style={{ padding: '30px 0px', paddingLeft: '20px', borderBottom: '1px solid #D5D9EB' }}>
                                                <div
                                                    style={{ display: 'flex', flexDirection: 'row', gap: 5, alignItems: 'center', border: '2px solid #D5D9EB', borderRadius: '13px', width: 'fit-content', padding: '3px 6px', cursor: 'pointer' }}
                                                    onClick={() => handleAddOption(qIdx)}
                                                >
                                                    <i className="la la-plus" style={{ transform: 'scale(1.2)' }}></i>
                                                    <span style={{ fontWeight: 700, }}>Add Option</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* DELETE QUESTION BUTTON */}
                                    <div style={{ padding: '20px', display: 'flex', flexDirection: 'row-reverse' }}>
                                        <div
                                            style={{ display: 'flex', flexDirection: 'row', gap: 10, alignItems: 'center', borderRadius: '18px', border: '2px solid #F4A6A6', width: 'fit-content', padding: '5px 10px', cursor: 'pointer' }}
                                            onClick={() => handleDeleteQuestion(qIdx)}
                                        >
                                            <i className="la la-trash" style={{ transform: 'scale(1.5)', color: '#8A0303' }}></i>
                                            <span style={{ fontWeight: 700, color: '#8A0303' }}>Delete Question</span>
                                        </div>
                                    </div>
                                </div>
                            )))
                            : (
                            <div style={{ borderBottom: '1px solid #D5D7DA', paddingBottom: '20px' }}>
                                <span>No pre-screening questions added yet.</span>
                            </div>
                            )
                        }
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', padding: questions.length === 0 ? 0 : '20px 0px', gap: 10, borderTop: questions.length === 0 ? 'none' : '1px solid #D5D9EB' }}>
                    <span style={{fontSize: 17, color: "#181D27", fontWeight: 700}}>Suggested Pre-Screening Questions:</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        { suggestedQuestions.map((q, idx) => (
                            <div key={idx} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>{q.title}</span>
                                    <span>{q.question}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
                                    <span
                                        style={{fontSize: 16, color: "#181D27", fontWeight: 700, border: '2px solid #D5D7DA', padding: '5px 15px', borderRadius: '18px', cursor: 'pointer' }}
                                        onClick={() => handleAddSuggestedQuestion(q)}
                                    >
                                        Add
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}