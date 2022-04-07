import Stripe from 'stripe';
import { getServiceSupabase } from '../../utils/supabase';

const handler = async (req, res) => {
  if (req.query.API_ROUTE_SECRET !== process.env.API_ROUTE_SECRET) {
    return res.status(401).send('You are not authorized to call this API');
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const customer = await stripe.customers.create({
    email: req.body.record.email,
  });

  console.log({ customer });
  console.log({ customer_id: customer.id });
  console.log(req.body.record.id);

  const supabase = getServiceSupabase();

  await supabase
    .from('profile')
    .update({
      stripe_customer: customer.id,
    })
    .eq('id', req.body.record.id);

  res.send({ message: `stripe customer created: ${customer.id}` });
};

export default handler;
