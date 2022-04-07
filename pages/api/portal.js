import { supabase } from '../../utils/supabase';
import cookie from 'cookie';
import Stripe from 'stripe';

const handler = async (req, res) => {
  // get user data by cookie since on server
  const { user } = await supabase.auth.api.getUserByCookie(req);

  // if no user, return unauthed 401 status
  if (!user) {
    return res.status(401).send('Unauthorized');
  }

  // otherwise, get the supabase access-token from cookie
  const token = cookie.parse(req.headers.cookie)['sb-access-token'];

  // set supabase auth session using the token from cookie
  supabase.auth.session = () => ({
    access_token: token,
  });

  // get stripe_customer number / data
  const {
    data: { stripe_customer },
  } = await supabase
    .from('profile')
    .select('stripe_customer')
    .eq('id', user.id)
    .single();

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer,
    return_url: `${process.env.CLIENT_URL}/dashboard`,
  });

  res.send({
    url: session.url,
  });
};

export default handler;
