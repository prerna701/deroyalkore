export const formatPrice = (price?: string | number | null) => {
    if (price === undefined || price === null || price === '') return '';

    const normalized = String(price)
        .trim()
        .replace(/^(?:\$|₹|Rs\.?|INR)\s*/i, '');

    return `Rs ${normalized}`;
};
