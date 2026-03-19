import { detectFraud } from '../services/fraudService.js';
import { getIPLocation } from '../services/locationService.js';

export const fraudCheck = async (req, res, next) => {
  try {
    const { location } = req.body;
    const ip = req.ip || req.connection.remoteAddress;
    
    const ipLocation = await getIPLocation(ip);
    const fraudResult = await detectFraud(req.userId, location, ipLocation);
    
    req.fraudScore = fraudResult.fraudScore;
    req.fraudFlags = fraudResult.flags;
    
    if (fraudResult.fraudScore > 70) {
      return res.status(403).json({ 
        error: 'Suspicious activity detected',
        fraudScore: fraudResult.fraudScore,
        flags: fraudResult.flags
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};
