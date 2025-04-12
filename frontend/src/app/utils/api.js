'use client';

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const detectTechnologies = async (url) => {
    try {
        const response = await api.post('/api/detect', { url });
        return response.data;
    } catch (error) {
        console.error('Error detecting technologies:', error);
        throw error;
    }
};

// Function to get a token and submit the contact form
export const submitContactForm = async (formData) => {
    try {
        // Get a fresh token right before submission
        const tokenResponse = await fetch(`${API_URL}/api/token`);
        const tokenData = await tokenResponse.json();

        // Immediately use the token to submit the form
        const contactResponse = await fetch(`${API_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenData.token}`
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                message: formData.message
            })
        });

        return await contactResponse.json();
    } catch (error) {
        console.error('Error submitting form:', error);
        return { error: 'Failed to submit form', message: error.message };
    }
};