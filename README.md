# Launchpad Jia - Add Career Form Feature

## Overview
My approach focused on creating a step-based form architecture that cleanly manages state across components.
I used React Hook Form’s FormProvider and useFormContext to share state between steps, making validation, data persistence, and form submission consistent across the entire flow.
Each step was designed as an independent, reusable unit that integrates smoothly with the main stepper.

## Architecture

Each step (Career Details, Pre-Screening, CV Screening, etc.) connects through a shared stepper.
Using FormProvider, all steps access the same form state for validation, draft saving, and submission.

```tsx
<FormProvider {...methods}>
  <CareerDetailsStep />
  <PreScreeningStep />
  <CVScreeningStep />
</FormProvider>
```

This structure simplifies scaling and ensures consistent UX and data integrity.

## Highlights

- Shared state across steps (FormProvider + useFormContext)
- Draft save/restore logic
- Input sanitization for safe content
- Dynamic question generation
- Clean, scalable architecture

## Learnings

Building this flow deepened my understanding of multi-step form state management, context-driven validation, and modular React architecture.
