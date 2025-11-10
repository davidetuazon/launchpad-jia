"use client"

import { useEffect, useState } from "react";
import RichTextEditor from "@/lib/components/CareerComponents/RichTextEditor";
import CustomDropdown from "@/lib/components/CareerComponents/CustomDropdown";
import philippineCitiesAndProvinces from "../../../../public/philippines-locations.json";
import { useFormContext, Controller } from "react-hook-form";
import CareerFormTipsContainer from "./CareerFormTipsContainer";

type Props = {
    career: any,
    onFormStateChange?: (isEmpty: boolean) => void,
    onTitleChange?: (title: string) => void,
}

const workSetupOptions = [
    {
        name: "Fully Remote",
    },
    {
        name: "Onsite",
    },
    {
        name: "Hybrid",
    },
];

const employmentTypeOptions = [
    {
        name: "Full-Time",
    },
    {
        name: "Part-Time",
    },
];

const jobDetailTips = [
    {
        title: "Use clear, standard job titles",
        description: `for better searchability (e.g., "Software Engineer" instead of "Code Ninja" or "Tech Rockstar").`,
    },
    {
        title: "Avoid abbreviations",
        description: `or internal role codes that applicants may not understand (e.g., use "QA Engineer" instead of "QE II" or "QA-TL").`,
    },
    {
        title: "Keep it concise",
        description: `— job titles should be no more than a few words (2-4 max), avoid fluff or marketing terms.`,
    },
]

export default function CareerFormDetails({ career, onFormStateChange, onTitleChange }: Props) {
    const { register, control, watch, setValue, formState: { errors } } = useFormContext();
    
    const selectedProvince = watch('province');
    const [provinceList, setProvinceList] = useState(philippineCitiesAndProvinces.provinces);
    const [cityList, setCityList] = useState<{ name: string; province: string }[]>([]);

    const salaryNegotiable = watch('salaryNegotiable');
    const jobTitle = watch('jobTitle');

    const watchedFields = watch([
        "jobTitle",
        "employmentType",
        "workSetup",
        "minimumSalary",
        "maximumSalary",
        "description",
    ]);

    // works kind of like isDirty
    // allows parent component to check on child components 'isDirty' state
    useEffect(() => {
        const isEmpty = watchedFields.every((field) => {
            if (typeof field === 'string') return field.trim() === "";
            if (typeof field === 'number') return field === 0 || field === null || field === undefined;
            return !field;
        });

        onFormStateChange?.(isEmpty);
    }, [watchedFields, onFormStateChange]);

    // if career.province exists, use it
    // else prefills the list with the first province
    // then gets only cities from that province
    useEffect(() => {
        const initialProvince = career?.province || provinceList[0]?.name;
        const cities = philippineCitiesAndProvinces.cities.filter(
        (c) => c.province === provinceList.find((p) => p.name === initialProvince)?.key
        );
        setCityList(cities);
        if (cities[0]) {
            setValue('location', career?.location || cities[0].name);
        }
        setValue('province', initialProvince);
    }, [career, provinceList, setValue]);

    // listens to province changes and updates city list accordingly
    useEffect(() => {
        if (!selectedProvince) return;
        const provinceObj = provinceList.find((p) => p.name === selectedProvince);
        if (!provinceObj) return;

        const cities = philippineCitiesAndProvinces.cities.filter(
        (c) => c.province === provinceObj.key
        );
        setCityList(cities);
        if (cities.length > 0) setValue('location', cities[0].name);
    }, [selectedProvince, provinceList, setValue]);

    // negotiable toggling mount
    useEffect(() => {
        if (career?.salaryNegotiable !== undefined) {
            setValue("salaryNegotiable", career.salaryNegotiable);
        }
    }, [career, setValue]);

    // listens for jobTitle
    // purely for UI render purposes
     useEffect(() => {
        onTitleChange?.(jobTitle);
    }, [jobTitle, onTitleChange]);

    return (
        <div style={{ overflowY: 'auto', maxHeight: '100dvh', scrollBehavior: 'smooth', scrollbarWidth: 'none', display: "flex", flexDirection: "row", justifyContent: "space-between", width: "100%", gap: 24, alignItems: "flex-start", marginTop: 26 }}>
            <div style={{ width: "60%", display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="layered-card-middle">

                    {/* CAREER INFO */}
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, padding: '0px 5px' }}>
                        <span style={{fontSize: 19, color: "#181D27", fontWeight: 700}}>1. Career Information</span>
                    </div>
                    <div className="layered-card-content">

                        {/* JOB TITLE */}
                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Basic Information</span>
                        <span>Job Title</span>
                        <input
                        {...register('jobTitle')}
                        defaultValue={career?.jobTitle || ""}
                        className="form-control"
                        placeholder="Enter job title"
                        />
                        { errors.jobTitle?.message && (
                            <p style={{ color: '#e53935', fontSize: 16, fontWeight: 400 }}>
                                {errors.jobTitle.message as string}
                            </p>
                        )}

                        {/* WORK SETTING */}
                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Work Setting</span>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ padding: '2px 0px'}}>Employment Type</span>
                                <Controller
                                    name="employmentType"
                                    control={control}
                                    defaultValue={career?.employmentType || ''}
                                    render={({ field: { onChange, value }, fieldState }) => (
                                        <>
                                        <CustomDropdown
                                            onSelectSetting={onChange}
                                            screeningSetting={value}
                                            settingList={employmentTypeOptions}
                                            placeholder="Select Employment Type"
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
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ padding: '2px 0px'}}>Arrangement</span>
                                <Controller
                                    name="workSetup"
                                    control={control}
                                    defaultValue={career?.workSetup || ''}
                                    render={({ field: { onChange, value }, fieldState}) => (
                                        <>
                                        <CustomDropdown
                                            onSelectSetting={onChange}
                                            screeningSetting={value}
                                            settingList={workSetupOptions}
                                            placeholder="Select Work Setup"
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

                        {/* LOCATION */}
                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Location</span>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ padding: '2px 0px'}}>Country</span>
                                <Controller
                                    name="country"
                                    control={control}
                                    defaultValue={career?.country || 'Philippines'}
                                    render={({ field: { onChange, value }, fieldState }) => (
                                        <>
                                            <CustomDropdown
                                                onSelectSetting={onChange}
                                                screeningSetting={value}
                                                settingList={[]}
                                                placeholder="Select Country"
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
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ padding: '2px 0px'}}>State / Province</span>
                                <Controller
                                    name="province"
                                    control={control}
                                    defaultValue={career?.province || provinceList[0]?.name || ''}
                                    render={({ field: { onChange, value }, fieldState }) => (
                                        <>
                                            <CustomDropdown
                                                onSelectSetting={onChange}
                                                screeningSetting={value}
                                                settingList={provinceList}
                                                placeholder="Select State / Province"
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
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ padding: '2px 0px'}}>City</span>
                                <Controller
                                    name="location"
                                    control={control}
                                    defaultValue={career?.location || ''}
                                    render={({ field: { onChange, value }, fieldState }) => (
                                        <>
                                            <CustomDropdown
                                                onSelectSetting={onChange}
                                                screeningSetting={value}
                                                settingList={cityList}
                                                placeholder="Select City"
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
                        
                        {/* SALARY */}
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                            <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Salary</span>
                            <Controller
                                name="salaryNegotiable"
                                control={control}
                                defaultValue={career?.salaryNegotiable ?? true}
                                render={({ field: { onChange, value }}) => (
                                    <div style={{ display: "flex", flexDirection: "row", alignItems: "flex-start", gap: 8, minWidth: "130px" }}>
                                        <label className="switch">
                                            <input type="checkbox" checked={salaryNegotiable} onChange={(e) => onChange(e.target.checked)} />
                                            <span className="slider round"></span>
                                        </label>
                                        <span style={{fontSize: 16, color: "#181D27", fontWeight: 700}}>Negotiable</span>
                                    </div>
                                )}
                            />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ padding: '2px 0px'}}>Minimum Salary</span>
                                <div style={{ position: "relative" }}>
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#6c757d",
                                            fontSize: "16px",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        P
                                    </span>
                                    <Controller
                                        name="minimumSalary"
                                        control={control}
                                        defaultValue={career?.minimumSalary || ''}
                                        render={({ field: { onChange, value } }) => (
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ paddingLeft: "28px" }}
                                                placeholder="0"
                                                min={0}
                                                value={value}
                                                onChange={(e) => onChange(Number(e.target.value))}
                                            />
                                        )}
                                    />
                                    <span style={{
                                        position: "absolute",
                                        right: "30px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "16px",
                                        pointerEvents: "none",
                                    }}>
                                        PHP
                                    </span>
                                </div>
                                {errors.minimumSalary?.message && (
                                    <p style={{ color: '#e53935', fontSize: 16, fontWeight: 400, paddingTop: '5px' }}>
                                    {errors.minimumSalary.message as string}
                                    </p>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                                <span style={{ padding: '2px 0px'}}>Maximum Salary</span>
                                <div style={{ position: "relative" }}>
                                    <span
                                        style={{
                                            position: "absolute",
                                            left: "12px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            color: "#6c757d",
                                            fontSize: "16px",
                                            pointerEvents: "none",
                                        }}
                                    >
                                        P
                                    </span>
                                    <Controller
                                        name="maximumSalary"
                                        control={control}
                                        defaultValue={career?.maximumSalary || ''}
                                        render={({ field: { onChange, value }}) => (
                                            <input
                                                type="number"
                                                className="form-control"
                                                style={{ paddingLeft: "28px" }}
                                                placeholder="0"
                                                min={0}
                                                value={value}
                                                onChange={(e) => onChange(Number(e.target.value))}
                                            />
                                        )}
                                    />
                                    <span style={{
                                        position: "absolute",
                                        right: "30px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        color: "#6c757d",
                                        fontSize: "16px",
                                        pointerEvents: "none",
                                    }}>
                                        PHP
                                    </span>
                                </div>
                                {errors.maximumSalary?.message && (
                                    <p style={{ color: '#e53935', fontSize: 16, fontWeight: 400, paddingTop: '5px' }}>
                                    {errors.maximumSalary.message as string}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div className="layered-card-middle">
                    <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8, padding: '0px 5px' }}>
                        <span style={{fontSize: 19, color: "#181D27", fontWeight: 700}}>2. Job Description</span>
                    </div>
                    <div className="layered-card-content">
                        <Controller
                            name="description"
                            control={control}
                            defaultValue={career?.description || ""}
                            render={({ field: { onChange, value }, fieldState }) => (
                                <>
                                    { fieldState.error && (
                                        <p style={{ color: '#e53935', fontSize: 16, fontWeight: 400, paddingTop: '5px' }}>
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                    <RichTextEditor text={value} setText={onChange} />
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
             <div style={{ width: "40%", display: "flex", flexDirection: "column", gap: 24, position: 'sticky', top: 0 }}>
                <CareerFormTipsContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24,  padding: '10px' }}>
                        {jobDetailTips.map((tip, idx) => (
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