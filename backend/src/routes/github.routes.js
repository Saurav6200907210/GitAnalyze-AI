import express from 'express';
import { getAudit, getProfile, getRepos, getRateLimit, refreshAudit } from '../controllers/github.controller.js';

const router = express.Router();

router.get('/audit/:username', getAudit);
router.get('/profile/:username', getProfile);
router.get('/repos/:username', getRepos);
router.get('/rate-limit', getRateLimit);
router.post('/refresh/:username', refreshAudit);

export default router;
