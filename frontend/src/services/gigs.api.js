import apiFetch from './api';

export async function getAllGigs(search) {
    const query = search ? `?search=${encodeURIComponent(search)}` : '';
    const data = await apiFetch(`/gigs${query}`);
    // If the API returns { success: true, count: 5, data: [...] } we might need to adjust.
    // Assuming generic REST response or matching backend structure.
    // Based on typical express patterns, it often returns { data: [...] } or just [...]
    // We'll return 'data' if it exists, or the raw response if it is an array.
    return data.data || data;
}

export async function getGigById(id) {
    // Workaround: Backend doesn't have GET /gigs/:id yet.
    // We fetch all gigs and find the one matching the ID.
    const gigs = await getAllGigs();
    return gigs.find(gig => gig._id === id);
}
