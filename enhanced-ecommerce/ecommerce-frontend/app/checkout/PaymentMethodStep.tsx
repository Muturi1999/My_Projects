// ecommerce-frontend/src/components/checkout/PaymentMethodStep.tsx (Update conditional rendering)

// ... existing imports ...
import StripeCardFormWrapper from './StripeCardForm'; // Import the new component

// ... PaymentMethodStep component ...

            {/* Conditional Input Fields */}
            {selectedMethod === 'CARD' && (
                <div className="border p-4 rounded-lg bg-gray-50">
                    <StripeCardFormWrapper 
                        orderId={finalOrder.id} 
                        nextStep={nextStep} 
                        totalAmount={finalOrder.total_amount} // Pass the total
                    />
                </div>
            )}
            
            {selectedMethod === 'MPESA' && (
                // Existing M-Pesa phone input and submission logic (handled via its own API call)
                <div className="border p-4 rounded-lg bg-green-50">
                    <label className="block font-medium mb-2">M-Pesa Phone Number</label>
                    <input 
                        // ... M-Pesa input fields ... 
                    />
                    {/* The submission button for M-Pesa would be inside this block, 
                    using the existing handlePaymentSubmission for the MPESA endpoint. */}
                </div>
            )}
            
            {/* The final submit button should only exist if MPESA is selected and we need to submit that form, 
                or be removed entirely if the card form handles its own submission. 
                Adjust button placement based on final UI decision. */}
            
            {/* For M-Pesa only, keep the submit button outside the form: */}
            {selectedMethod === 'MPESA' && (
                 <div className="flex justify-between mt-6">
                    <button type="button" onClick={prevStep} className="text-blue-600 hover:underline p-3 rounded">
                        &larr; Back to Shipping
                    </button>
                    <button type="submit" /* ... */>
                        Pay & Place Order (MPESA)
                    </button>
                </div>
            )}