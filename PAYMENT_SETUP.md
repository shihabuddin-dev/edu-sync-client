# Payment System Setup Guide

## Environment Variables

### Client (.env file in edu-sync-client)
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
VITE_API_URL=http://localhost:3000
```

### Server (.env file in edu-sync-server)
```env
PAYMENT_GATEWAY_KEY=sk_test_your_stripe_secret_key_here
MONGODB_URI=your_mongodb_connection_string
FB_SERVICE_KEY=your_firebase_service_key
```

## Getting Stripe Keys

1. Sign up for a Stripe account at https://stripe.com
2. Go to the Stripe Dashboard
3. Navigate to Developers > API keys
4. Copy your publishable key (starts with `pk_test_` or `pk_live_`)
5. Copy your secret key (starts with `sk_test_` or `sk_live_`)

## Testing Cards

For testing, use Stripe's test card numbers:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Expiry**: Any future date (e.g., `12/25`)
- **CVC**: Any 3 digits (e.g., `123`)

## Payment Flow

1. **Free Sessions** (`registrationFee === 0`):
   - Click "Book Now" → Direct booking → Success notification → Redirect to My Bookings

2. **Paid Sessions** (`registrationFee > 0`):
   - Click "Book Now" → Redirect to Payment Page → Enter card details → Process payment → Create booking → Success notification → Redirect to My Bookings

## API Endpoints

### Backend Routes:
- `POST /create-payment-intent` - Creates Stripe payment intent
- `POST /bookedSessions` - Create new booking
- `POST /payments` - Record successful payment
- `GET /bookedSessions/student/:email` - Get student's bookings
- `GET /payments` - Get payment history

### Frontend Routes:
- `/payment/:id` - Payment page for session booking
- `/dashboard/student/my-bookings` - Student's booked sessions

## Features

✅ **Security:**
- Stripe Elements for secure card input
- User authentication required
- Students can only book for themselves
- Registration period validation

✅ **Payment Processing:**
- Real-time payment processing
- Transaction ID tracking
- Payment history recording
- Booking status updates

✅ **User Experience:**
- Loading states and error handling
- Success notifications with transaction details
- Responsive design
- Order summary display

## Troubleshooting

1. **Payment fails**: Check Stripe keys and test card details
2. **Booking not created**: Verify session exists and is approved
3. **Route not found**: Ensure all routes are properly configured
4. **Environment variables**: Make sure all keys are set correctly

## Database Collections

- `bookedSessions` - Store all booked study sessions
- `payments` - Store payment records with transaction IDs 