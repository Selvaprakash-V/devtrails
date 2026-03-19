import axios from 'axios';

export const getIPLocation = async (ip) => {
  try {
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168')) {
      return { lat: 12.9716, lng: 77.5946 };
    }
    const response = await axios.get(`http://ip-api.com/json/${ip}`);
    return { lat: response.data.lat, lng: response.data.lon };
  } catch (error) {
    return null;
  }
};
