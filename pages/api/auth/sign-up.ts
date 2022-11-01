import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connectDb from '../../../lib/mongo';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }
    const db = await connectDb();
    const users = db.collection('users');
    const userAlreadyExists = await users.findOne({ email: req.body.email });
    if (!userAlreadyExists) {
      res.status(500).json({ error: 'User already exists.' });
      return;
    }

    const user = bcrypt.hash(password, 10).then(async (hash: string) => {
      const result = await users.insertOne({
        name: name,
        password: hash,
        email: email,
      });
      jwt.sign(
        { id: result.insertedId },
        process.env.JWT_KEY,
        {},
        function (err: Error, token: string) {
          res.setHeader('Set-Cookie', [`user_token=${token}`]);
          res.status(201).json({ user_token: token });
          return;
        }
      );
    });
  } catch (e) {
    res.status(500).json({ error: 'Something went wrong, try again.' });
  }
}
