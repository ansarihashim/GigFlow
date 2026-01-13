import apiFetch from './api';

export async function createBid(bidData) {
    // bidData: { gigId, message, price }
    return apiFetch('/bids', {
        method: 'POST',
        body: JSON.stringify(bidData),
    });
}

export async function getBidsByGig(gigId) {
    const data = await apiFetch(`/bids/${gigId}`);
    return data.data || data;
}

export async function hireBid(bidId) {
    return apiFetch(`/bids/${bidId}/hire`, {
        method: 'PATCH',
    });
}
