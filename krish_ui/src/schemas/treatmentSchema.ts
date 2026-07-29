import { z } from 'zod';

export const treatmentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    about: z.string().min(1, 'About is required'),
    sessions: z.string().optional(),
    price: z.string().optional(),
    duration: z.string().optional(),
    protocol: z.string().optional(),
    bestFor: z.string().optional(),
    benefits: z.string().optional(),
});

export type TreatmentFormValues = z.infer<typeof treatmentSchema>;

export const emptyTreatmentForm: TreatmentFormValues = {
    title: '',
    about: '',
    sessions: '',
    price: '',
    duration: '',
    protocol: '',
    bestFor: '',
    benefits: '',
};
