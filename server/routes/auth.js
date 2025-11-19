import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { validateRegistration, validateLogin } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validateRegistration, async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return res.status(400).json({
        message: 'Registration failed',
        details: authError.message
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: authData.user.id,
          username: username.trim(),
          email
        }
      ])
      .select()
      .single();

    if (profileError) {
      return res.status(400).json({
        message: 'Profile creation failed',
        details: profileError.message
      });
    }

    const token = jwt.sign(
      {
        userId: authData.user.id,
        username: profile.username,
        email: profile.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: profile.id,
        username: profile.username,
        email: profile.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return res.status(401).json({
        message: 'Authentication failed',
        details: 'Invalid email or password'
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      return res.status(404).json({
        message: 'Profile not found',
        details: 'User profile does not exist'
      });
    }

    const token = jwt.sign(
      {
        userId: profile.id,
        username: profile.username,
        email: profile.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: profile.id,
        username: profile.username,
        email: profile.email
      }
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      details: error.message
    });
  }
});

export default router;
