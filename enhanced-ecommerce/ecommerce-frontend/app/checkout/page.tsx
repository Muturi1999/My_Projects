// ecommerce-frontend/src/app/checkout/page.tsx

'use client';
import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import api from '@/lib/api'; 
import { useRouter } from 'next/navigation';

// Placeholder Components for Steps
const CustomerInfoStep = ({ nextStep, data, setData }) => ( /* ... Step 1 form */ );
const ShippingAddressStep = ({ nextStep, prevStep, data, setData }) => ( /* ... Step 2 form, fetches user addresses if logged in */ );
const ShippingMethodStep = ({ nextStep, prevStep, data, setData }) => ( /* ... Step 3 form, selects from SHIPPING_RATES */ );
const PaymentMethodStep = ({ nextStep, prevStep, data, setData, handlePlaceOrder }) => ( /* ... Step 4 form, selects M-Pesa/Stripe */ );


// STEP 5: ORDER REVIEW - Sticky Order Summary (Right Sidebar) and Final Submission
const OrderReviewStep = ({ data, prevStep, handlePlaceOrder, cart, isOrdering }) => (
    <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2">
            <h3 className="text-2xl font-bold mb-4">4. Order Review</h3>
            <div className="p-4 border rounded-lg space-y-3">
                <p><strong>Shipping To:</strong> {data.shippingAddress.full_name}, {data.shippingAddress.city}</p>
                <p><strong>Shipping Method:</strong> {data.shippingMethod}</p>
                <p><strong>Payment Method:</strong> {data.paymentMethod}</p>
            </div>
            
            <button 
                onClick={handlePlaceOrder}
                disabled={isOrdering}
                className="mt-6 w-full bg-red-600 text-white p-4 rounded-lg text-lg font-bold hover:bg-red-700 transition"
            >
                {isOrdering ? 'Placing Order...' : 'Place Order Now'}
            </button>
            <button onClick={prevStep} className="mt-4 w-full text-blue-600">
                &larr; Back to Payment
            </button>
        </div>
        <div className="col-span-1 border p-4 rounded-lg sticky top-4 h-fit">
            <h3 className="font-bold text-xl mb-4">Order Summary ({cart?.item_count || 0} Items)</h3>
            {/* Display Cart Items (Mini product list) */}
            {(cart?.items || []).map(item => (
                <p key={item.id} className="text-sm flex justify-between">
                    <span>{item.quantity} x {item.product.name}</span>
                    <span>${item.total_price}</span>
                </p>
            ))}
            <div className="border-t mt-3 pt-3 space-y-1">
                <p className="flex justify-between">Subtotal: <span>${cart?.subtotal}</span></p>
                <p className="flex justify-between text-green-600">Discount: <span>$0.00</span></p>
                <p className="flex justify-between">Shipping: <span>$15.00</span></p> {/* Use actual cost from state */}
                <p className="flex justify-between text-2xl font-bold mt-2">TOTAL: <span>${parseFloat(cart?.subtotal) + 15.00}</span></p>
            </div>
        </div>
    </div>
);


export default function CheckoutPage() {
    const router = useRouter();
    const { cart, fetchCart } = useCart(); // Assuming useCart exposes the current cart state
    const [step, setStep] = useState(1);
    const [isOrdering, setIsOrdering] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        customerInfo: { email: '', phone: '' },
        shippingAddress: { full_name: '', address_line_1: '', city: '', postal_code: '' },
        shippingMethod: 'express', // Default selection
        paymentMethod: 'Stripe', 
    });

    if (!cart || cart.item_count === 0) {
        return <p className="container mx-auto p-8 text-center">Your cart is empty. Please add items to proceed to checkout.</p>;
    }

    const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
    const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
    
    // Final Order Submission Handler
    const handlePlaceOrder = async () => {
        setIsOrdering(true);
        try {
            // Data structure sent to Django CheckoutView
            const payload = {
                customer_info: checkoutData.customerInfo,
                shipping_address: checkoutData.shippingAddress,
                shipping_method: checkoutData.shippingMethod,
                payment_method: checkoutData.paymentMethod, // Used for tracking
                // We'd typically handle actual payment (Stripe/M-Pesa) before this step 
                // or redirect here for external payment.
            };

            const response = await api.post('/checkout/process/', payload);
            
            // Redirect to a thank you page with the order number
            router.push(`/order/confirmation/${response.data.id}`); 
            fetchCart(); // Clear local cart state
            
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Order processing failed. Please try again.');
        } finally {
            setIsOrdering(false);
        }
    };

    const steps = [
        { label: 'Customer Info', component: CustomerInfoStep },
        { label: 'Shipping Address', component: ShippingAddressStep },
        { label: 'Shipping Method', component: ShippingMethodStep },
        { label: 'Payment Method', component: PaymentMethodStep },
        { label: 'Order Review', component: OrderReviewStep },
    ];

    const CurrentStepComponent = steps[step - 1].component;

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-extrabold mb-8">Checkout</h1>
            
            {/* Progress Indicator (Multi-Step Wizard) */}
            <div className="flex justify-between mb-8">
                {steps.map((s, index) => (
                    <div key={index} className={`flex-1 text-center border-b-4 pb-2 transition-colors 
                        ${step > index ? 'border-blue-600 text-blue-600 font-semibold' : 'border-gray-300 text-gray-500'}`}
                    >
                        {index + 1}. {s.label}
                    </div>
                ))}
            </div>

            <div className="p-6 border rounded-lg bg-white shadow-lg">
                 <CurrentStepComponent 
                    nextStep={nextStep} 
                    prevStep={prevStep} 
                    data={checkoutData} 
                    setData={setCheckoutData}
                    handlePlaceOrder={handlePlaceOrder}
                    cart={cart}
                    isOrdering={isOrdering}
                />
            </div>
        </main>
    );
}