# Remind Me Membership SaaS


### System Requirements

- mongodb
- nodejs

### Getting Started

First update `/server/config/secrets.js` with the following credentials:

- Stripe [API keys](https://dashboard.stripe.com/account/apikeys) and [plan info](https://dashboard.stripe.com/test/plans)
- Mandrill for sending forgot/reset password confirmations.
- session secret
- google analytics id

Install dependencies with `npm install`.

Start the server with `node server`.

Note: Stripe webhooks can be recieved at `https://your-url.com/stripe/events`.

