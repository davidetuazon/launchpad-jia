import moment from "moment";

// imports for input validation and sanitation
import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';

export function checkFile(file) {
  if (file.length > 1) {
    alert("Only one file is allowed.");
    return false;
  }

  if (file[0].size > 10 * 1024 * 1024) {
    alert("File size must be less than 10MB.");
    return false;
  }

  if (
    ![
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ].includes(file[0].type)
  ) {
    alert("Only PDF, DOC, DOCX, or TXT files are allowed.");
    return false;
  }

  return file[0];
}

export function formatFileSize(size) {
  return (size / 1024 / 1024).toFixed(2);
}

export function processDate(date) {
  const inputDate = moment(date).utcOffset(8).startOf("day");
  const now = moment().utcOffset(8).startOf("day");
  const diffDays = now.diff(inputDate, "days");

  if (diffDays < 1) {
    return "Today";
  }

  if (diffDays === 1) {
    return "Yesterday";
  }

  if (diffDays < 30) {
    return `${diffDays} days ago`;
  }

  const diffMonths = now.diff(inputDate, "months");

  if (diffMonths < 1) {
    return `${diffDays} days ago`;
  }

  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export function processDisplayDate(date) {
  return moment(date).format("MMM D, YYYY");
}

// use zod and sanitize-html to validate and sanitize inputs
// zod defines what data should look like and transforms incoming data to that shape
// sanitize-html cleans out potential malicious HTML or scripts

// currently removes all HTML tags and attributes
// can tweak to fit a more particular use case
const clean = (val: string) => sanitizeHtml(val, { allowedTags: [], allowedAttributes: {} });

// nested question validation + sanitation
const questionsSchema = z.object({
  id: z.union([z.string(), z.number()]),
  category: z.string().min(1).transform(clean),
  questionCountToAsk: z.number().nullable().optional(),
  questions: z.array(z.any()).optional(),
});

// do the transforming/cleaning job
export const careerInputSanitation = z.object({
  jobTitle: z.string().min(1).transform(clean),
  description: z.string().min(1).transform(clean),
  questions: z.array(questionsSchema).optional(),
  lastEditedBy: z.any().optional(),
  createdBy: z.any().optional(),
  screeningSetting: z.any().optional(),
  orgID: z.string(),
  requireVideo: z.boolean().optional(),
  location: z.string().min(1).transform(clean),
  workSetup: z.string().min(1).transform(clean),
  workSetupRemarks: z.string().optional().transform(val => val ? clean(val) : ""),
  status: z.string().optional(),
  salaryNegotiable: z.boolean().optional(),
  minimumSalary: z.number().optional(),
  maximumSalary: z.number().optional(),
  country: z.string().optional(),
  province: z.string().optional(),
  employmentType: z.string().optional(),
});

// infer type
export type careerInputData = z.infer<typeof careerInputSanitation>;