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

export interface SiteAbout {
    id: string;
    badge: string;
    badgeLabel: string;
    tagline: string;
    titlePrefix: string;
    titleSuffix: string;
    paragraphs: string[];
    buttonText: string;
    images: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ContactTiming {
    label: string;
    value: string;
    isClosed?: boolean;
}

export interface SiteContact {
    id: string;
    heading: string;
    address: string;
    phone: string;
    website: string;
    mapLink: string;
    timings: ContactTiming[];
    createdAt?: string;
    updatedAt?: string;
}

export interface GalleryImage {
    id: string;
    url: string;
    title: string;
    sortOrder: number;
}

export interface SiteGallery {
    id: string;
    title: string;
    titleSuffix: string;
    subtitle: string;
    note: string;
    images: GalleryImage[];
    createdAt?: string;
    updatedAt?: string;
}
