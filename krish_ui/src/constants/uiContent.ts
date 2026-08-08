export const UI_STRINGS = {
    skinTreatment: {
        discoveryHeader: "RITUAL DISCOVERY",
        headerSubtitle: "RITUAL",
        headerMain: "DISCOVERY",
        sidebar: {
            process: "Ritual Process",
            benefits: "Ritual Benefits",
            aftercare: "Aftercare Protocol",
            results: "Successful Results"
        },
        dashboard: {
            badge: "Real Transformations",
            titlePrefix: "Successful",
            titleSuffix: "Results",
            description: (treatmentTitle: string) => `Explore documented case studies and clinically proven outcomes for the ${treatmentTitle}.`,
            buttonText: "VIEW RESULTS",
            verification: "Authorized Clinic Results • Verified Transformations"
        },
        footer: {
            durationPrefix: "Ritual Duration:",
            buttonText: "Reserve Ritual"
        }
    },
    booking: {
        headerPrefix: "AURUM",
        headerBooking: "BOOKING",
        headerDetails: "DETAILS",
        steps: {
            date: {
                number: "01",
                label: "Select Date",
                monthYear: "November 2024"
            },
            time: {
                number: "02",
                label: "Available Time"
            },
            personal: {
                title: "Final Step",
                subtitle: "Personalize your ritual",
                fields: {
                    name: "Full Name",
                    phone: "Phone Number",
                    email: "Email Address",
                    emailOptional: "(optional)"
                }
            }
        },
        footer: {
            summary: "Checkout Summary",
            nextStep: "Next Step",
            confirm: "Confirm Ritual"
        }
    },
    aboutSection: {
        badge: "10+",
        badgeLabel: "Year of Experience",
        tagline: "About De Royal Kore",
        titlePrefix: "Top-Rated Skin Clinic in",
        titleSuffix: "Panipat, Karnal",
        paragraphs: [
            "De Royal Kore is a leading dermatology and laser clinic in Panipat and Karnal, led by Dr. Manpreet Kaur (MBBS AIIMS Delhi, MD Dermatology, PGI), a highly trusted dermatologist in Mohali and experienced skin specialist.",
            "Established in 2016, the clinic stands tall in Mohali, renowned for unparalleled patient satisfaction, exceptional services, and modern infrastructure.",
            "De Royal Kore provides advanced treatment for acne, acne scars, pigmentation, melasma, hair fall, CO₂ laser treatment, laser hair reduction, and other dermatological conditions.",
            "Equipped with advanced laser technology, De Royal Kore is the preferred choice for patients searching for a reliable skin doctor or dermatologist in Panipat/Karnal."
        ],
        buttonText: "Read More",
        images: [
            "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&q=80",
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80",
            "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80"
        ]
    },
    clinicGallery: {
        title: "Clinical",
        titleSuffix: "Gallery",
        subtitle: "Experience The Luxury",
        images: [
            { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80", title: "Modern Consultation Room" },
            { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80", title: "Advanced Treatment Suite" },
            { url: "https://images.unsplash.com/photo-1586773860418-d3b9a8ec862e?auto=format&fit=crop&q=80", title: "Luxury Reception" },
            { url: "https://images.unsplash.com/photo-1600334129128-ec85758fd30d?auto=format&fit=crop&q=80", title: "Waitng Lounge" },
            { url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80", title: "Sterile Procedure Room" },
            { url: "https://images.unsplash.com/photo-1631217812030-802525166299?auto=format&fit=crop&q=80", title: "Laser Technology Booth" }
        ]
    }
};

export const TIME_SLOTS = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM', '03:00 PM', '04:30 PM'];

export const CALENDAR_DAYS = [
    { day: 10, current: false }, { day: 11, current: false },
    { day: 12, current: true }, { day: 13, current: true },
    { day: 14, current: true }, { day: 15, current: true },
    { day: 16, current: true }, { day: 17, current: true },
    { day: 18, current: true }, { day: 19, current: true },
    { day: 20, current: true }, { day: 21, current: true },
    { day: 22, current: true }, { day: 23, current: true },
    { day: 24, current: true }, { day: 25, current: true }
];
