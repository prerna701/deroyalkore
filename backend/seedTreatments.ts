import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

// Replicating the mock data locally to avoid TS module resolution issues
const treatmentsData = {
    "pigmentation": {
        id: "pigmentation",
        title: "Pigmentation & Melasma Treatment",
        about: "Our advanced pigmentation treatment targets stubborn melasma, sun spots, and dark patches using medical-grade technology to restore a brighter, more even complexion.",
        bestFor: ["Melasma", "Hyperpigmentation", "Sun spots", "Acne marks"],
        benefits: ["Reduces pigmentation", "Brightens skin tone", "Evens complexion", "Healthy natural glow"],
        sessions: "1–2 Sessions (depending on skin condition)",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
        price: "250.00",
        duration: "60 Mins",
        protocol: "We begin with a deep double cleanse, followed by a customized peel to lift pigment. Next, medical-grade laser targeting breaks down deep melanin. We finish with a cooling, hydrating mask and SPF protection."
    },
    "acne": {
        id: "acne",
        title: "Acne & Scarring Solutions",
        about: "A comprehensive approach to clearing active acne and minimizing scarring. We use a combination of deep cleansing, targeted extraction, and customized peels.",
        bestFor: ["Active acne", "Acne scars", "Oily/Congested skin", "Large pores"],
        benefits: ["Clears active breakouts", "Reduces pore size", "Smooths skin texture", "Fades acne scarring"],
        sessions: "3–6 Sessions for optimal results",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
        price: "200.00",
        duration: "75 Mins",
        protocol: "The session includes an exfoliating cleanse, followed by manual extractions. A customized salicylic peel is applied to unclog pores. Blue LED light therapy is then used to destroy acne-causing bacteria."
    },
    "korean-glass-skin": {
        id: "korean-glass-skin",
        title: "Korean Glass Skin Treatment",
        about: "Achieve radiant, hydrated, and luminous Korean glass skin with our advanced skin rejuvenation treatment.",
        bestFor: ["Dull skin", "Dry skin", "Dehydrated skin", "Uneven texture"],
        benefits: ["Intense hydration", "Luminous glass-like glow", "Plumps fine lines", "Improves skin elasticity"],
        sessions: "1 Session for instant glow, 3 for lasting results",
        image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80",
        price: "300.00",
        duration: "90 Mins",
        protocol: "This multi-step facial starts with a gentle enzyme exfoliation. We then infuse the skin with hyaluronic acid and niacinamide using oxygen therapy, finishing with a premium modeling mask for maximum glow."
    },
    "anti-aging": {
        id: "anti-aging",
        title: "Anti-Aging & Skin Tightening",
        about: "Reverse the signs of aging with our advanced skin tightening treatments. We stimulate collagen production to firm, lift, and rejuvenate mature skin.",
        bestFor: ["Fine lines & wrinkles", "Sagging skin", "Loss of volume", "Mature skin"],
        benefits: ["Firms and lifts skin", "Reduces deep wrinkles", "Stimulates collagen", "Restores youthful contour"],
        sessions: "4–6 Sessions for visible lifting",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
        price: "350.00",
        duration: "90 Mins",
        protocol: "After cleansing, radiofrequency (RF) energy is applied to heat the deep dermis and stimulate collagen. A peptide-rich serum is then micro-needled into the skin, followed by a firming peptide mask."
    }
};

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

const seed = () => {
    const dataDir = path.join(process.cwd(), 'data');
    const dataFile = path.join(dataDir, 'treatments.json');

    fs.mkdirSync(dataDir, { recursive: true });

    const now = new Date().toISOString();
    const treatments = Object.values(treatmentsData).map((t) => ({
        id: randomUUID(),
        slug: slugify(t.title),
        title: t.title,
        about: t.about,
        sessions: t.sessions,
        price: t.price,
        duration: t.duration,
        protocol: t.protocol,
        bestFor: t.bestFor,
        benefits: t.benefits,
        image: t.image,
        createdAt: now,
        updatedAt: now,
    }));

    fs.writeFileSync(dataFile, JSON.stringify(treatments, null, 2), 'utf8');
    console.log(`Successfully seeded ${treatments.length} treatments to data/treatments.json`);
};

seed();
