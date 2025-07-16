import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from "./PaymentForm";

const stripeKey = import.meta.env.VITE_Payment_Key;
// console.log('Stripe Key:', stripeKey ? 'Key found' : 'Key missing');

const stripePromise = loadStripe(stripeKey);

const Payment = () => {
    return (
        <Elements stripe={stripePromise}>
            <PaymentForm />
        </Elements>
    );
};

export default Payment;