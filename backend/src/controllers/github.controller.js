import { fetchUserAudit, fetchUserProfile, fetchUserRepos, checkRateLimit, clearUserCache } from '../services/github.service.js';
import { extractUsername } from '../utils/githubUrlParser.js';

const parseUsername = (req) => {
  const param = req.params.username;
  return extractUsername(param);
};

export const getAudit = async (req, res, next) => {
  try {
    const username = parseUsername(req);
    if (!username) {
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }
    const data = await fetchUserAudit(username);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const username = parseUsername(req);
    if (!username) {
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }
    const data = await fetchUserProfile(username);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getRepos = async (req, res, next) => {
  try {
    const username = parseUsername(req);
    if (!username) {
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }
    const data = await fetchUserRepos(username);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getRateLimit = async (req, res, next) => {
  try {
    const data = await checkRateLimit();
    res.json(data);
  } catch (error) {
    next(error);
  }
};

export const refreshAudit = async (req, res, next) => {
  try {
    const username = parseUsername(req);
    if (!username) {
      return res.status(400).json({ success: false, message: 'Invalid username' });
    }
    clearUserCache(username);
    const data = await fetchUserAudit(username);
    res.json({ success: true, message: 'Cache cleared and data refreshed', data });
  } catch (error) {
    next(error);
  }
};
