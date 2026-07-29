export interface BeforeAfterCase {
    _id?: string;
    category: string;
    label: string;
    before: string;
    after: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Treatment {
    _id?: string;
    slug?: string;
    title: string;
    about: string;
    bestFor: string[];
    benefits: string[];
    sessions: string;
    image: string;
    price: string;
    duration: string;
    protocol: string;
    createdAt?: string;
    updatedAt?: string;
}
