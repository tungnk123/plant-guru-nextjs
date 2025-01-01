const PAYPAL_API = 'https://api-m.sandbox.paypal.com';

const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
  ).toString('base64');

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${auth}`,
    },
    body: 'grant_type=client_credentials',
  });
  const data = await response.json();
  return data.access_token;
};

export const transferToPayPal = async (recipientEmail: string, amount: number): Promise<void> => {
  const accessToken = await getAccessToken();
  
  const response = await fetch(`${PAYPAL_API}/v1/payments/payouts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: `batch-${Date.now()}`,
        email_subject: 'You have a payout!',
      },
      items: [{
        recipient_type: 'EMAIL',
        amount: { value: amount.toFixed(2), currency: 'USD' },
        receiver: recipientEmail,
      }],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to transfer to PayPal');
  }
};
  