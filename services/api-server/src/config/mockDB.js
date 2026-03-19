// In-memory data store (no MongoDB needed)
const workers = new Map();
const claims = new Map();
const fraudFlags = new Map();

let workerIdCounter = 1;
let claimIdCounter = 1;
let fraudIdCounter = 1;

export const mockDB = {
  // Workers
  createWorker: (data) => {
    const id = `worker_${workerIdCounter++}`;
    const worker = {
      _id: id,
      ...data,
      isActive: true,
      createdAt: new Date()
    };
    workers.set(id, worker);
    return worker;
  },

  findWorkerByPhone: (phone) => {
    return Array.from(workers.values()).find(w => w.phone === phone);
  },

  findWorkerById: (id) => {
    return workers.get(id);
  },

  updateWorker: (id, data) => {
    const worker = workers.get(id);
    if (worker) {
      Object.assign(worker, data);
      return worker;
    }
    return null;
  },

  getAllWorkers: () => {
    return Array.from(workers.values());
  },

  countWorkers: () => {
    return workers.size;
  },

  // Claims
  createClaim: (data) => {
    const id = `claim_${claimIdCounter++}`;
    const claim = {
      _id: id,
      ...data,
      createdAt: new Date()
    };
    claims.set(id, claim);
    return claim;
  },

  findClaimsByWorkerId: (workerId) => {
    return Array.from(claims.values())
      .filter(c => c.workerId === workerId)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  findClaimById: (id) => {
    return claims.get(id);
  },

  updateClaim: (id, data) => {
    const claim = claims.get(id);
    if (claim) {
      Object.assign(claim, data);
      return claim;
    }
    return null;
  },

  getAllClaims: () => {
    return Array.from(claims.values()).sort((a, b) => b.createdAt - a.createdAt);
  },

  countClaims: () => {
    return claims.size;
  },

  countClaimsByStatus: (status) => {
    return Array.from(claims.values()).filter(c => c.status === status).length;
  },

  getTotalPayouts: () => {
    return Array.from(claims.values())
      .filter(c => c.status === 'approved' || c.status === 'paid')
      .reduce((sum, c) => sum + (c.payoutAmount || 0), 0);
  },

  getRecentClaimsByWorkerId: (workerId, hours) => {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(claims.values())
      .filter(c => c.workerId === workerId && c.createdAt >= cutoff);
  },

  // Fraud Flags
  createFraudFlag: (data) => {
    const id = `fraud_${fraudIdCounter++}`;
    const flag = {
      _id: id,
      ...data,
      resolved: false,
      createdAt: new Date()
    };
    fraudFlags.set(id, flag);
    return flag;
  },

  getUnresolvedFraudFlags: () => {
    return Array.from(fraudFlags.values()).filter(f => !f.resolved);
  },

  countUnresolvedFraudFlags: () => {
    return Array.from(fraudFlags.values()).filter(f => !f.resolved).length;
  },

  updateFraudFlag: (id, data) => {
    const flag = fraudFlags.get(id);
    if (flag) {
      Object.assign(flag, data);
      return flag;
    }
    return null;
  }
};
