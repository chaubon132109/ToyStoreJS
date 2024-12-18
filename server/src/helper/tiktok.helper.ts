import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
dotenv.config();

interface TiktokApiParams {
  access_token: string;
  app_key: string;
  shop_id: string;
  timestamp: number;
  version: string;
  [key: string]: any; // Allow extra optional parameters
}

const generateSign = (
  params: TiktokApiParams,
  uri: string,
  app_secret: string,
): string => {
  const excludeKeys = ['access_token', 'sign'];
  const sortedParams = Object.keys(params)
    .filter((key) => !excludeKeys.includes(key))
    .sort()
    .map((key) => `${key}${params[key]}`)
    .join('');

  const pathname = new URL(uri).pathname;
  const signString = `${app_secret}${pathname}${sortedParams}${app_secret}`;

  const hmac = crypto.createHmac('sha256', app_secret);
  hmac.update(signString);
  return hmac.digest('hex');
};

const getCurrentTimestamp = (): number => Math.floor(Date.now() / 1000);

/**
 * Helper function to send a GET or POST request to TikTok API.
 * @param method - HTTP method ('get' or 'post').
 * @param uri - API endpoint URI.
 * @param access_token - Access token for the API request.
 * @param additionalParams - Additional query or body parameters.
 * @param body - Request body (only for POST requests).
 * @returns API response data or throws an error.
 */
const sendTiktokRequest = async (
  method: Method,
  uri: string,
  access_token: string,
  additionalParams: Record<string, any> = {},
  body?: Record<string, any>, // Only for POST requests
): Promise<any> => {
  const params: TiktokApiParams = {
    access_token,
    app_key: process.env.TIKTOK_APP_KEY as string,
    shop_id: process.env.TIKTOK_SHOP_ID as string,
    timestamp: getCurrentTimestamp(),
    version: process.env.TIKTOK_API_VERSION as string,
    ...additionalParams, // Spread additional params here
  };

  const app_secret = process.env.TIKTOK_APP_SECRET as string;
  const sign = generateSign(params, uri, app_secret);

  const searchParams = new URLSearchParams(
    Object.entries({ ...params, sign }).map(([key, value]) => [
      key,
      String(value),
    ]),
  );

  const axiosConfig: AxiosRequestConfig = {
    method,
    maxBodyLength: Infinity,
    url: `${uri}?${searchParams.toString()}`,
    headers: {
      'x-tts-access-token': access_token,
      'Content-Type': 'application/json',
    },
    ...(method === 'post' && { data: body }), // Include body only for POST
  };

  try {
    const response: AxiosResponse = await axios.request(axiosConfig);
    return response.data;
  } catch (error: any) {
    console.log('🚀 ~ error:', error);
    throw new Error(error.response?.data || error.message);
  }
};

export const fetchTiktokApiGet = (
  uri: string,
  access_token: string,
  additionalParams: Record<string, any> = {},
): Promise<any> => {
  return sendTiktokRequest('get', uri, access_token, additionalParams);
};

/**
 * Send a POST request to TikTok API.
 */
export const fetchTiktokApiPost = (
  uri: string,
  access_token: string,
  additionalParams: Record<string, any> = {},
  body: Record<string, any> = {},
): Promise<any> => {
  return sendTiktokRequest('post', uri, access_token, additionalParams, body);
};
