import bcrypt from 'bcrypt';
import { User } from '../models/User.model.js';
import { generateToken, setTokenCookie } from '../utils/jwt.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body ?? {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'name, email and password are required' });
    }

    if (typeof password !== 'string' || password.length < 8) {
      return res.status(400).json({ success: false, error: 'password must be at least 8 characters' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, error: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = generateToken({
      sub: user._id.toString(),
      email: user.email
    });

    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
}

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken({
      sub: user._id.toString(),
      email: user.email
    });

    setTokenCookie(res, token);

    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    return next(error);
  }
}
