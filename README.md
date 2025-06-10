# Cuca de Llum - Reservations

Reservation system for Cuca de Llum Country House.

## Description

This project is a web application developed with Vue 3 and Vite that enables reservation management for tourist accommodations. It includes integration with Firebase for database, authentication, and hosting, Brevo for email management, and Stripe for payment processing.

## Links

- **Production**: [https://reservas-cuca-de-llum.web.app](https://reservas-cuca-de-llum.web.app)

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase Account
- Brevo Account (formerly Sendinblue)
- Stripe Account (for payment processing)

## External Services Configuration

### Firebase

1. Create a new project in [Firebase Console](https://console.firebase.google.com/)
2. Enable the following services:
   - Authentication (email/password)
   - Firestore Database
   - Cloud Functions
   - Hosting

3. Get the configuration credentials from the Firebase console (Project settings > General > Your apps > Web)

### Brevo (Sendinblue)

1. Register at [Brevo](https://www.brevo.com/)
2. Get your API Key from the Brevo dashboard (Settings > API Keys)
3. Create mailing lists to manage your contacts (one for production and one for testing)

### Stripe

1. Register at [Stripe](https://stripe.com/)
2. Get your test and production API keys from the Stripe dashboard (Developers > API Keys)

## Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd app-cuca
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file at the root of the project with the following variables:
```
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
```

4. For Cloud Functions, configure environment variables:
```bash
cd functions
npm install
firebase functions:config:set brevo.apikey="your-brevo-api-key" stripe.secret="your-stripe-secret-key"
```

## Local Development

```bash
npm run dev
```

## Build for Production

```bash
npm run build
```

## Deployment

```bash
npm run build
firebase deploy
```

To deploy only functions:
```bash
firebase deploy --only functions
```

## Main Dependencies Structure

- **Vue 3**: UI framework
- **Vite**: Build tool and development server
- **Vuetify**: UI component framework for Vue
- **Firebase**: Application development platform
  - **firebase/app**: Firebase core
  - **firebase/auth**: User authentication
  - **firebase/firestore**: NoSQL database
  - **firebase/functions**: Serverless functions
  - **firebase/hosting**: Web hosting
- **Brevo (sib-api-v3-sdk)**: Email and marketing management
- **Stripe**: Payment processing
- **Moment.js**: Date and time handling
- **VeeValidate**: Form validation
- **Pinia**: Application state management
- **Vue Router**: Application routing

## Main Features

- User registration and authentication
- Availability calendar
- Reservation process
- Payment processing with Stripe
- Automatic email sending with Brevo
- Reservation administration panel
- Availability management

## Cloud Functions

- **createReservationProd**: Creates a contact in Brevo when a reservation is generated in production
- **createReservationTest**: Creates a contact in Brevo when a reservation is generated in test mode (uses sandbox)

## Brevo Sandbox Mode

For testing without actually sending emails or affecting account limits, Brevo's sandbox mode is used by setting the `X-Sib-Sandbox: drop` header in API requests.