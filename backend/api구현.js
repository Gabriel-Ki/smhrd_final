// 로그인 API 구현
app.post('/api/auth/admin/login', (req, res) => {
    const { admin_id, admin_pw } = req.body;

    // 관리자 로그인 검증 (예시로 간단한 조건 사용)
    if (admin_id === 'admin' && admin_pw === '1234') {
        // JWT 토큰 생성
        const token = jwt.sign({ admin_id }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    } else {
        return res.status(401).json({ message: 'Invalid credentials' });
    }
});
