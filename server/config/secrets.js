/* Application Secret Data */
module.exports = {

  db: process.env.MONGODB || process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost:27017/inbound-api',

  sessionSecret: process.env.SESSION_SECRET || 'alksdfja2311kjdas282diwojdw',

  mandrill: {
    key: '5an8F6z0BFYbiyTkibL2YA'
  },

  stripeOptions: {
    apiKey: process.env.STRIPE_KEY || '5wxEPvdEqfZZJnfnPPVyUD6x9W2ysToc',
    stripePubKey: process.env.STRIPE_PUB_KEY || 'pk_cRvnHIUJ7leC6yN3SSPIxm1vxU2Xo',
    defaultPlan: 'free',
    plans: ['free', 'silver', 'gold', 'platinum'],
    planData: {
      'free': {
        name: 'Free',
        price: 0
      },
      'silver': {
        name: 'Silver',
        price: 9
      },
      'gold': {
        name: 'Gold',
        price: 19
      },
      'platinum': {
        name: 'Platinum',
        price: 29
      }
    }
  },

  googleAnalytics: process.env.GOOGLE_ANALYTICS || ''
};
