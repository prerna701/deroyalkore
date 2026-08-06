import { z } from 'zod';

export const treatmentSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    about: z.string().min(1, 'About is required'),
    sessions: z.string().optional(),
    price: z.string().optional(),
    discountPrice: z.string().optional(),
    duration: z.string().optional(),
    protocol: z.string().optional(),
    bestFor: z.string().optional(),
    benefits: z.string().optional(),
}).superRefine((data, ctx) => {
    if (data.discountPrice && data.price) {
        const p = parseFloat(data.price);
        const dp = parseFloat(data.discountPrice);
        if (!isNaN(p) && !isNaN(dp) && dp >= p) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Discount price must be less than the regular price',
                path: ['discountPrice'],
            });
        }
    }
});

export type TreatmentFormValues = z.infer<typeof treatmentSchema>;

export const emptyTreatmentForm: TreatmentFormValues = {
    title: '',
    about: '',
    sessions: '',
    price: '',
    discountPrice: '',
    duration: '',
    protocol: '',
    bestFor: '',
    benefits: '',
};
