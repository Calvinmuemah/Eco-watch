import { Router } from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { register, login, getMe, oauthCallback, logout } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validate } from '../middlewares/validate.js';

const authRouter = Router();

const registerValidation = [
  body('name').trim().notEmpty().withMessage('name is required'),
  body('email').isEmail().withMessage('please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('password must be at least 6 characters long'),
  body('role')
    .optional()
    .isIn(['user', 'authority', 'admin'])
    .withMessage('invalid role')
];

const loginValidation = [
  body('email').isEmail().withMessage('please provide a valid email'),
  body('password').notEmpty().withMessage('password is required')
];

authRouter.post('/register', authLimiter, registerValidation, validate, register);
authRouter.post('/login', authLimiter, loginValidation, validate, login);
authRouter.post('/logout', protect, logout);
authRouter.get('/me', protect, getMe);

authRouter.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

authRouter.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/error' }),
  oauthCallback
);

// router.get(
//   '/github',
//   passport.authenticate('github', { scope: ['user:email'], session: false })
// );

// router.get(
//   '/github/callback',
//   passport.authenticate('github', { session: false, failureRedirect: '/auth/error' }),
//   oauthCallback
// );

// router.get(
//   '/facebook',
//   passport.authenticate('facebook', { scope: ['email'], session: false })
// );

// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', { session: false, failureRedirect: '/auth/error' }),
//   oauthCallback
// );

export default authRouter;