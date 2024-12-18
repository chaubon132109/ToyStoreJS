export const configuration = () => ({
  vnpay: {
    tmnCode: process.env.VNP_TMNCODE,
    hashSecret: process.env.VNP_HASHSECRET,
    url: process.env.VNPAY_URL,
    returnUrl: `${process.env.FRONTEND_URL}/payment-result`,
  },
});
