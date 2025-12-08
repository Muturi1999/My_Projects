/* eslint-disable @typescript-eslint/no-explicit-any */
// ecommerce-frontend/src/hooks/useCheckout.ts (Conceptual file)

import { useState } from "react";

interface CheckoutData {
    customerInfo: { email: string; phone: string; /* ... */ };
    shippingAddress: any; // Based on Address model fields
    shippingMethod: string;
    paymentMethod: string;
}

export const useCheckoutState = () => {
    const [step, setStep] = useState(1);
    const [data, setData] = useState<CheckoutData>({ /* initial values */ });

    const nextStep = () => setStep(prev => prev < 5 ? prev + 1 : prev);
    const prevStep = () => setStep(prev => prev > 1 ? prev - 1 : prev);

    return { step, data, setStep, setData, nextStep, prevStep };
};