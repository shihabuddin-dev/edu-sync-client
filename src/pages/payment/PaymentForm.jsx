import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Button from "../../components/ui/Button";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Spinner from "../../components/ui/Spinner";
import useAuth from "../../hooks/useAuth";
import Swal from "sweetalert2";
import {
    FaArrowLeft,
    FaCreditCard,
    FaLock,
    FaShieldAlt,
    FaTimesCircle
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import SectionTitle from "../../components/shared/SectionTitle";

const PaymentForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const { id: sessionId } = useParams();
    const axiosSecure = useAxiosSecure();

    const { isPending, data: session = {} } = useQuery({
        queryKey: ['session-details', sessionId],
        queryFn: async () => {
            const res = await axiosSecure(`/sessions/${sessionId}`);
            return res.data;
        }
    });

    if (isPending) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200 flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg"></div>
                    <p className="mt-4 text-base-content/70">Loading payment details...</p>
                </div>
            </div>
        );
    }

    const amount = session.registrationFee || 0;
    const amountInCents = Math.round(amount * 100);
    
    console.log('Session:', session);
    console.log('Amount:', amount);
    console.log('Amount in cents:', amountInCents);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setError('');

        // Validate amount
        if (!amount || amount <= 0) {
            setError('Invalid amount. Please check the session registration fee.');
            setIsProcessing(false);
            return;
        }

        if (amountInCents <= 0) {
            setError('Invalid amount in cents. Please check the session registration fee.');
            setIsProcessing(false);
            return;
        }

        try {
            const card = elements.getElement(CardElement);
            if (!card) {
                setError('Card element not found');
                return;
            }

            console.log('Processing payment for amount:', amountInCents, 'cents');

            // Step 1: Create payment intent
            const paymentIntentRes = await axiosSecure.post('/create-payment-intent', {
                amountInCents
            });
            
            if (!paymentIntentRes.data.clientSecret) {
                setError('Failed to create payment intent');
                return;
            }
            
            const clientSecret = paymentIntentRes.data.clientSecret;
            console.log('Payment intent created, client secret received');

            // Step 2: Confirm payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user.displayName || user.email,
                        email: user.email
                    },
                },
            });

            if (result.error) {
                console.error('Payment confirmation error:', result.error);
                setError(result.error.message);
                return;
            }

            console.log('Payment result:', result);

            if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
                console.log('Payment Succeeded');
                const transactionId = result.paymentIntent.id;

                // Step 4: Create booking first
                const bookingData = {
                    sessionId: session._id,
                    studentEmail: user.email,
                    amount: amount,
                    paymentStatus: 'pending',
                    paymentMethod: 'card',
                    bookedAt: new Date().toISOString()
                };

                const bookingRes = await axiosSecure.post('/bookedSessions', bookingData);
                
                if (bookingRes.data.success) {
                    // Step 5: Record payment
                    const paymentData = {
                        bookingId: bookingRes.data.bookingId,
                        email: user.email,
                        amount: amount,
                        transactionId: transactionId,
                        paymentMethod: result.paymentIntent.payment_method_types[0]
                    };

                    const paymentRes = await axiosSecure.post('/payments', paymentData);
                    
                    if (paymentRes.data.insertedId) {
                        // Show success message
                        await Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            html: `
                                <div class="text-left">
                                    <p><strong>Session:</strong> ${session.title}</p>
                                    <p><strong>Amount:</strong> $${amount}</p>
                                    <p><strong>Transaction ID:</strong> <code>${transactionId}</code></p>
                                </div>
                            `,
                            confirmButtonText: 'Go to My Bookings',
                        });

                        // Redirect to My Bookings
                        navigate('/dashboard/student/my-bookings');
                    }
                }
            }
        } catch (error) {
            console.error('Payment error:', error);
            console.error('Error response:', error.response);
            console.error('Error message:', error.message);
            
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.message) {
                setError(error.message);
            } else {
                setError('Something went wrong with the payment. Please try again.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
            {/* Header */}
            <div className="bg-base-100 shadow-md pb-2">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <Button
                        onClick={() => navigate(-1)}
                        className="btn btn-sm mb-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back
                    </Button>
                    <SectionTitle title="Payment" icon={<MdPayment />} />
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Form */}
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <FaCreditCard className="text-primary" />
                            Payment Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Card Details */}
                            <div>
                                <label className="block text-sm font-medium mb-3">Card Details</label>
                                <div className="border border-base-300 rounded-md p-4 bg-base-100">
                                    <CardElement 
                                        options={{
                                            style: {
                                                base: {
                                                    fontSize: '16px',
                                                    color: '#424770',
                                                    '::placeholder': {
                                                        color: '#aab7c4',
                                                    },
                                                },
                                                invalid: {
                                                    color: '#9e2146',
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Error Display */}
                            {error && (
                                <div className="alert alert-error">
                                    <FaTimesCircle />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Security Notice */}
                            <div className="bg-base-200 rounded-md p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <FaLock className="text-success" />
                                    <span className="font-medium text-sm">Secure Payment</span>
                                </div>
                                <p className="text-xs text-base-content/70">
                                    Your payment information is encrypted and secure. We use Stripe for secure payment processing.
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={!stripe || isProcessing}
                                className="w-full btn"
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="loading loading-spinner loading-sm"></div>
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <FaShieldAlt className="mr-2" />
                                        Pay ${amount}
                                    </>
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-base-100 rounded-md shadow-md border border-base-300 p-6 h-fit">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                        {/* Session Details */}
                        <div className="space-y-4 mb-6">
                            <div className="flex items-center gap-3">
                                {session.sessionImage && (
                                    <img
                                        src={session.sessionImage}
                                        alt={session.title}
                                        className="w-16 h-16 object-cover rounded-md border-2 border-primary"
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-semibold">{session.title}</h4>
                                    <p className="text-sm text-base-content/70">by {session.tutorName}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Duration:</span>
                                    <span className="font-medium">{session.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Start Date:</span>
                                    <span className="font-medium">
                                        {new Date(session.classStart).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown */}
                        <div className="border-t border-base-300 pt-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Registration Fee:</span>
                                <span>${amount}</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total:</span>
                                <span>${amount}</span>
                            </div>
                        </div>

                        {/* Security Features */}
                        <div className="mt-6 space-y-3">
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span>SSL Encrypted Payment</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span>Stripe Secure Processing</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                                <div className="w-2 h-2 bg-success rounded-full"></div>
                                <span>Instant Booking Confirmation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
