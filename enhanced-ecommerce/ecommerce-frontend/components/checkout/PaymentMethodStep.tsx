// ecommerce-frontend/src/components/checkout/PaymentMethodStep.tsx

'use client';

// NOTE: This component assumes the Order object has been created (status=Pending)
// in the previous CheckoutView and its ID is passed here.

export default function PaymentMethodStep({ prevStep, finalOrder, nextStep }) {
    const [selectedMethod, setSelectedMethod] = useState('CARD');
    const [cardDetails, setCardDetails] = useState({ token: '' }); // Conceptual: Handled by Stripe Elements
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePaymentSubmission = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const orderId = finalOrder.id; // The ID of the Order created in the previous step

        try {
            let response;
            if (selectedMethod === 'CARD') {
                // 1. Conceptual Stripe: Integrate Stripe Elements here to get a payment token/ID
                const paymentToken = 'pm_card_visa'; // Mock token
                
                response = await api.post('/payments/card/', { order_id: orderId, payment_token: paymentToken });
            
            } else if (selectedMethod === 'MPESA') {
                response = await api.post('/payments/mpesa/', { 
                    order_id: orderId, 
                    phone_number: mpesaPhone 
                });
                
                // M-Pesa is asynchronous: Wait for confirmation (or redirect to a tracking page)
                alert("M-Pesa push sent to your phone. Awaiting confirmation...");
                
                // We'll jump to the review step/confirmation immediately for this mock
            }

            // If successful, proceed to Order Review (or Confirmation if this is the final step)
            nextStep(response.data.order_id); 

        } catch (error) {
            console.error("Payment Error:", error.response?.data || error);
            alert('Payment processing failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handlePaymentSubmission} className="space-y-6">
            <h2 className="text-2xl font-bold">4. Select Payment Method</h2>

            {/* Method Selection Radio Buttons */}
            <div className="space-y-4">
                <PaymentOption 
                    name="CARD" 
                    label="Bank Card (Visa, MasterCard)" 
                    selected={selectedMethod} 
                    onChange={setSelectedMethod}
                    description="Pay securely with your credit or debit card."
                />
                <PaymentOption 
                    name="MPESA" 
                    label="M-Pesa (STK Push)" 
                    selected={selectedMethod} 
                    onChange={setSelectedMethod}
                    description="Receive a prompt on your phone to authorize payment."
                />
            </div>

            {/* Conditional Input Fields */}
            {selectedMethod === 'CARD' && (
                <div className="border p-4 rounded-lg bg-gray-50">
                    {/* Real Stripe integration uses Stripe Elements for secure field handling */}
                    <p className='text-sm text-gray-600'> **Secure Credit Card Fields (Conceptual Stripe Elements)**</p>
                    <input type="text" placeholder="Card Number (Mock)" className='w-full p-2 border rounded mt-2' />
                </div>
            )}
            
            {selectedMethod === 'MPESA' && (
                <div className="border p-4 rounded-lg bg-green-50">
                    <label className="block font-medium mb-2">M-Pesa Phone Number</label>
                    <input 
                        type="tel" 
                        value={mpesaPhone} 
                        onChange={(e) => setMpesaPhone(e.target.value)} 
                        required 
                        placeholder="e.g., 2547XXXXXXXX" 
                        className="w-full p-2 border rounded"
                    />
                </div>
            )}

            <div className="flex justify-between mt-6">
                <button type="button" onClick={prevStep} className="text-blue-600 hover:underline p-3 rounded">
                    &larr; Back to Shipping
                </button>
                <button type="submit" disabled={loading || !selectedMethod} className="bg-red-600 text-white p-3 rounded-lg font-bold hover:bg-red-700 transition disabled:bg-gray-400">
                    {loading ? 'Processing...' : 'Pay & Place Order'}
                </button>
            </div>
        </form>
    );
}

const PaymentOption = ({ name, label, selected, onChange, description }) => (
    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
        <input 
            type="radio" 
            name="payment_method" 
            value={name} 
            checked={selected === name}
            onChange={() => onChange(name)}
            className="form-radio h-5 w-5 text-red-600"
        />
        <div className="ml-3">
            <p className="font-semibold text-lg">{label}</p>
            <p className="text-sm text-gray-600">{description}</p>
        </div>
    </label>
);