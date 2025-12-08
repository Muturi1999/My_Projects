// ecommerce-frontend/src/components/checkout/StripeCardForm.tsx (New Component)

'use client';
import { useState, useEffect } from 'react';
import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import api from '@/lib/api';

// Load Stripe outside of render to avoid recreating it
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// --- Inner Form Component (Accesses Stripe Context) ---
const CheckoutForm = ({ orderId, nextStep, totalAmount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [clientSecret, setClientSecret] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Step 1: Create the Payment Intent on the server
    useEffect(() => {
        const fetchIntent = async () => {
            setLoading(true);
            try {
                const response = await api.post('/payments/intent/create/', { order_id: orderId });
                setClientSecret(response.data.client_secret);
            } catch (error) {
                setErrorMessage('Could not initialize payment. Please try refreshing.');
                console.error("Intent creation error:", error);
            } finally {
                setLoading(false);
            }
        };
        if (orderId) {
            fetchIntent();
        }
    }, [orderId]);

    // Step 3: Handle the final confirmation
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage('');

        if (!stripe || !elements || !clientSecret) return;

        try {
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    // Optional: billing details for compliance
                    billing_details: { 
                        name: 'Customer Name', 
                        email: 'customer@example.com' 
                    }, 
                }
            });

            if (result.error) {
                setErrorMessage(result.error.message);
            } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                // Payment is complete! The server is notified by Stripe webhook (ideal)
                // For a simpler setup, we proceed immediately:
                alert('Payment successful!');
                nextStep(orderId); 
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred during confirmation.');
            console.error("Confirmation error:", error);
        } finally {
            setLoading(false);
        }
    };
    
    // Stripe Elements styling options
    const cardElementOptions: StripeCardElementOptions = {
        style: {
            base: {
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#fa755a', iconColor: '#fa755a' },
        },
    };


    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="font-semibold text-lg">Card Details</h3>
            <div className="border p-3 rounded-lg bg-white">
                <CardElement options={cardElementOptions} />
            </div>

            {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}

            <button
                type="submit"
                disabled={!stripe || loading || !clientSecret}
                className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
                {loading ? 'Processing...' : `Pay $${totalAmount}`}
            </button>
        </form>
    );
};

// --- Outer Wrapper Component ---
export default function StripeCardFormWrapper({ orderId, nextStep, totalAmount }) {
    if (!orderId || !totalAmount) return <div className='text-red-500'>Error: Order details missing.</div>;
    
    const options: StripeElementsOptions = {
        // Stripe options for appearance or locale
        locale: 'en', 
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm 
                orderId={orderId} 
                nextStep={nextStep} 
                totalAmount={totalAmount}
            />
        </Elements>
    );
}