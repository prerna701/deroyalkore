export interface CaseResult {
    label: string;
    before: string;
    after: string;
}

export interface CategoryGroup {
    id: string;
    name: string;
    results: CaseResult[];
}

export const globalResultsData: CategoryGroup[] = [
    {
        id: "acne",
        name: "Acne Treatment",
        results: [
            { label: "Acne Control Case #1", before: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&q=80", after: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=500&q=80" },
            { label: "Scar Reduction Case #1", before: "https://images.unsplash.com/photo-1543363136-3fdb62e11be5?w=500&q=80", after: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&q=80" },
            { label: "Active Acne Case #2", before: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&q=80", after: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=500&q=80" },
        ]
    },
    {
        id: "korean",
        name: "Korean Rituals",
        results: [
            { label: "Golden Glow Case #1", before: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&q=80", after: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=500&q=80" },
            { label: "Hydration Glow #2", before: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500&q=80", after: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&q=80" },
            { label: "Glass Skin Transformation", before: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=500&q=80", after: "https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=500&q=80" },
        ]
    },
    {
        id: "anti-aging",
        name: "Anti-Aging & Lifting",
        results: [
            { label: "Elasticity Case #1", before: "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=500&q=80", after: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500&q=80" },
            { label: "Eye Restoration Case #1", before: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=500&q=80", after: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&q=80" },
            { label: "Fine Lines Correction", before: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80", after: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?w=500&q=80" },
        ]
    }
];
