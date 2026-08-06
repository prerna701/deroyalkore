import dotenv from 'dotenv';
dotenv.config();

import { randomUUID } from 'crypto';
import { connectToDatabase, closeDatabase, getCollection } from '../config/mongo';

const treatmentsData: any = {
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
        protocol: "The treatment begins with a thorough skin analysis to determine the depth of pigmentation. A specialized medical-grade peel or laser is then applied to target melanin deposits in the skin. The procedure is painless and takes about 60 minutes. Post-treatment, a soothing mask and SPF are applied. Visible reduction in dark spots can be seen within the first two weeks as the skin gently exfoliates and renews itself."
    },
    "korean-glass-skin": {
        id: "korean-glass-skin",
        title: "Korean Glass Skin Treatment",
        about: "Achieve radiant, hydrated, and luminous Korean glass skin with our advanced skin rejuvenation treatment.",
        bestFor: ["Dull skin", "Dry skin", "Dehydrated skin", "Uneven texture"],
        benefits: ["Instant glow", "Deep hydration", "Smooth skin", "Glass-like finish"],
        sessions: "1 Session (Recommended: 2 sessions for longer-lasting results)",
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        price: "285.00",
        duration: "90 Mins",
        protocol: "This multi-step facial starts with double cleansing and gentle exfoliation to remove dead skin cells. Next, we infuse potent hydrating serums containing hyaluronic acid and peptides using micro-channeling or ultrasound technology. This deeply hydrates the skin, plumping it from within. We finish with a cooling gel mask and LED light therapy to lock in moisture, leaving you with an instant, reflective glass-like glow."
    },
    "permanent-whitening": {
        id: "permanent-whitening",
        title: "Permanent Whitening Treatment",
        about: "A premium skin brightening treatment designed to improve overall skin tone safely and effectively.",
        bestFor: ["Uneven skin tone", "Dull skin", "Mild pigmentation", "Tanning"],
        benefits: ["Brighter complexion", "Healthy glow", "Improved skin texture", "Even skin tone"],
        sessions: "1–2 Sessions",
        image: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80",
        price: "299.00",
        duration: "60 Mins",
        protocol: "Our brightening protocol utilizes advanced active ingredients like glutathione, vitamin C, and alpha arbutin. The treatment involves a careful topical application combined with advanced delivery systems (such as electroporation) to ensure maximum absorption into the deeper skin layers. This suppresses melanin production safely and progressively over a few sessions, leading to a long-lasting, even, and brighter complexion."
    },
    "tanning-removal": {
        id: "tanning-removal",
        title: "Tanning Removal Treatment",
        about: "Restore your natural complexion by removing stubborn sun tan with advanced dermatological care.",
        bestFor: ["Sun tan", "UV damage", "Dull skin"],
        benefits: ["Removes tan", "Brightens skin", "Refreshes complexion"],
        sessions: "1 Session (Severe tanning may require 2 sessions)",
        image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800&q=80",
        price: "150.00",
        duration: "45 Mins",
        protocol: "The procedure begins with a gentle enzymatic exfoliation to break down the surface layer of dead, sun-damaged skin cells. We then apply a specialized de-tan pack rich in antioxidants and natural brightening agents. The process takes just 45 minutes and instantly revitalizes the skin, stripping away recent UV-induced darkening and restoring your natural, healthy skin tone."
    },
    "acne-removal": {
        id: "acne-removal",
        title: "Acne Removal Treatment",
        about: "Advanced acne therapy that helps control active acne, reduce inflammation, and improve overall skin health.",
        bestFor: ["Active acne", "Pimples", "Oily skin", "Acne marks"],
        benefits: ["Reduces acne", "Controls oil", "Prevents future breakouts", "Clearer skin"],
        sessions: "1–2 Sessions",
        image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80",
        price: "200.00",
        duration: "60 Mins",
        protocol: "We begin with deep pore cleansing and a professional extraction process to safely remove comedones. Following this, a salicylic acid or customized anti-acne peel is applied to reduce sebum production and kill acne-causing bacteria. The session concludes with Blue LED light therapy, which effectively reduces inflammation and accelerates the skin's natural healing process, preventing future breakouts."
    },
    "open-pores": {
        id: "open-pores",
        title: "Open Pores Treatment",
        about: "Reduce enlarged pores and achieve smoother, firmer-looking skin with advanced pore refinement technology.",
        bestFor: ["Open pores", "Oily skin", "Rough texture"],
        benefits: ["Tightens pores", "Smooth skin", "Better texture", "Youthful appearance"],
        sessions: "1–2 Sessions",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
        price: "180.00",
        duration: "45 Mins",
        protocol: "This treatment uses a combination of radiofrequency (RF) microneedling and specific astringent serums. The RF energy heats the deeper layers of the skin, stimulating collagen production which structurally tightens the skin around the pores. Over the next few weeks, the pores visibly shrink, and the skin's overall texture becomes significantly smoother and more refined."
    },
    "uneven-skin-tone": {
        id: "uneven-skin-tone",
        title: "Uneven Skin Tone Treatment",
        about: "A customized treatment to restore an even, brighter, and healthier complexion.",
        bestFor: ["Patchy skin", "Uneven complexion", "Mild pigmentation"],
        benefits: ["Uniform skin tone", "Brighter skin", "Healthy glow"],
        sessions: "1–2 Sessions",
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&q=80",
        price: "220.00",
        duration: "60 Mins",
        protocol: "A tailored cocktail of mild chemical exfoliants (like glycolic or lactic acid) and nourishing vitamins is applied to the skin to gently slough off the uneven top layer. This promotes rapid cell turnover. We follow this up with intensely hydrating serums to ensure the new skin layer is healthy and plump, resulting in a beautifully uniform and glowing complexion."
    },
    "blemishes-removal": {
        id: "blemishes-removal",
        title: "Blemishes Removal Treatment",
        about: "Reduce blemishes, dark spots, and post-acne marks with targeted skin correction therapy.",
        bestFor: ["Acne marks", "Dark spots", "Skin blemishes"],
        benefits: ["Clearer skin", "Reduced marks", "Smooth complexion"],
        sessions: "1–2 Sessions",
        image: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&q=80",
        price: "210.00",
        duration: "60 Mins",
        protocol: "Targeting specific problem areas, we utilize a combination of laser therapy and targeted chemical peels. The laser energy breaks down the concentrated pigment in blemishes, which the body then naturally clears away. The peel ensures an even texture. Most blemishes fade significantly after the first session, revealing clearer, more confident skin."
    },
    "body-pigmentation": {
        id: "body-pigmentation",
        title: "Body Pigmentation Removal",
        about: "Advanced treatment to reduce pigmentation on various body areas and restore an even skin tone.",
        bestFor: ["Dark neck", "Underarms", "Elbows", "Knees"],
        benefits: ["Lighter skin tone", "Reduced pigmentation", "Improved texture"],
        sessions: "1–2 Sessions",
        image: "https://images.unsplash.com/photo-1614735241165-6756e1df61ab?w=800&q=80",
        price: "350.00",
        duration: "90 Mins",
        protocol: "Focusing on thicker skin areas like elbows, knees, or the neck, we apply a specially formulated body peel that is stronger than facial treatments. This safely lifts stubborn pigmentation without irritating the surrounding skin. We also use gentle laser therapy if needed, followed by a heavy moisturizing cream to repair the skin barrier and maintain the newly lightened tone."
    },
    "body-whitening": {
        id: "body-whitening",
        title: "Body Whitening & Glow Treatment",
        about: "A luxury body treatment that brightens, hydrates, and revitalizes the skin for a radiant glow.",
        bestFor: ["Dull body skin", "Uneven tone", "Dry skin"],
        benefits: ["Instant body glow", "Softer skin", "Bright complexion"],
        sessions: "1 Session (2 sessions recommended for enhanced results)",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
        price: "400.00",
        duration: "120 Mins",
        protocol: "A true spa-like experience. The protocol begins with a full-body dry brush and scrub to eliminate rough patches and improve circulation. Following the scrub, a luxurious, skin-brightening mask enriched with Vitamin C and botanical extracts is applied. You are then cocooned to allow maximum absorption. The treatment finishes with a massage using a radiant glow oil, leaving your entire body soft and luminous."
    },
    "intimate-whitening": {
        id: "intimate-whitening",
        title: "Intimate Area Whitening Treatment",
        about: "A safe and effective treatment for reducing pigmentation in intimate and sensitive body areas.",
        bestFor: ["Bikini area", "Inner thighs", "Underarms"],
        benefits: ["Reduced pigmentation", "Even skin tone", "Smooth skin"],
        sessions: "1–2 Sessions",
        image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80",
        price: "275.00",
        duration: "60 Mins",
        protocol: "Conducted with the utmost privacy and care, this treatment uses exclusively formulated, highly sensitive-skin safe peels and gentle brightening serums. It specifically targets hyperpigmentation caused by friction or hormonal changes without disrupting the skin's natural pH. The results are progressive, safe, and visibly lightening over the recommended sessions."
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

const seed = async () => {
    try {
        console.log('Connecting to database...');
        await connectToDatabase();
        const collection = await getCollection('treatments');
        
        console.log('Clearing existing treatments...');
        await collection.deleteMany({});
        
        const now = new Date().toISOString();
        const treatments = Object.values(treatmentsData).map((t: any) => ({
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

        console.log(`Inserting ${treatments.length} treatments...`);
        await collection.insertMany(treatments);
        
        console.log('Successfully seeded treatments!');
    } catch (error) {
        console.error('Error seeding treatments:', error);
    } finally {
        await closeDatabase();
        process.exit(0);
    }
};

seed();
