import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const secret = process.env.JWT_SECRET

if(!secret) {
    throw new Error("JWT_SECRET TOKEN ERROR");
}

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        res.status(400).json({ message: 'All fields are required.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Invalid email format.' });
    }

    // Password strength validation
    if (password.length < 8) {
    res.status(400).json({ message: 'Password must be at least 8 characters long.' });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'Email is already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { fullName, email, password: hashedPassword },
        });

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            secret,
            { expiresIn: '1h' }
        );

        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }
  
    try {
      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ message: 'Invalid email or password.' });
        return;
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid email or password.' });
        return;
      }
  
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET || 'fallback-secret-key',
        { expiresIn: '1h' }
      );
  
      res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      console.error('Error logging in user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
};