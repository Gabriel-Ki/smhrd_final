// routes/userRouter.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, addUser, findUserByEmail } = require('');

const router = express.Router();
const SECRET_KEY = 'your_secret_key'; // 비밀 키

// 사용자 회원가입
router.post('/signup', async (req, res) => {
    const { username, phone, email, password, address } = req.body;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User(username, phone, email, hashedPassword, address);
    addUser(newUser);
    
    res.json({ message: "회원가입 성공", user_id: newUser.user_id });
});

// 사용자 로그인
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = findUserByEmail(email);
    
    if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign({ user_id: user.user_id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});

module.exports = router;
