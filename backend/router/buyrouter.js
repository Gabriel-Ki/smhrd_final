const express = require('express');
const router = express.Router();
const pool = require('../db');

const menuTranslation = {
    'jjajangmyeon': '짜장면',
    'jjamppong': '짬뽕',
    'tangsuyuk': '탕수육',
    'yurinji': '유린기',
    'kkansyosaehu': '깐쇼새우'
};

// 주문 생성 (주소 + 위도/경도 + 메뉴)
router.post('/', async (req, res) => {
    try {
        const { destination, coordinates, items, totalPrice ,admin_idx=1} = req.body;

        if (!destination || !coordinates || !items || totalPrice === undefined) {
            return res.status(400).json({ error: '필수 데이터가 부족합니다.' });
        }

    
        // Step 1: `orders` 테이블에 INSERT
        const orderTableSql = `INSERT INTO orders (destination,admin_idx, total_price) VALUES (?,?, ?)`;
        const [orderResult] = await pool.query(orderTableSql, [destination,admin_idx, totalPrice]);
        const orderId = orderResult.insertId;

        console.log(`주문 생성 완료 : orderId=${orderId}`)

        // Step 2: `orders_destination` 테이블에 INSERT
        const destTableSql = `INSERT INTO orders_destination (orders_idx, dst_x_coord, dst_y_coord) VALUES (?, ?, ?)`;
        await pool.query(destTableSql, [orderId, coordinates.lat, coordinates.lng]);

        console.log(`주소 좌표 저장 완료 : lat=${coordinates.lat}, lng=${coordinates.lng}`)

        // Step 3: `orders_items` 테이블에 INSERT (배열 데이터 처리)
        const itemsData = Object.entries(items)
            .filter(([menu, quantity]) => quantity > 0) // 0개 주문은 제외
            .map(([menu, quantity]) =>{
                const koreanMenu = menuTranslation[menu] || menu;
                return [orderId, koreanMenu, quantity, getMenuPrice(koreanMenu)]
            })

        if (itemsData.length === 0) {
            return res.status(400).json({ error: '선택한 메뉴가 없습니다.' });
        }

        const itemsTableSql = `INSERT INTO orders_items (orders_idx, menu_name, quantity, unit_price) VALUES ?`;
        await pool.query(itemsTableSql, [itemsData]);

        res.status(201).json({ message: '주문이 성공적으로 등록되었습니다.', orderId });
    } catch (err) {
        console.error('주문 처리 중 오류 발생:', err);
        res.status(500).json({ error: '주문 등록 중 오류 발생', details: err.message });
    }
});

// 메뉴 가격 가져오기 함수 (오타 수정됨)
function getMenuPrice(menu) {
    const prices = {
        '짜장면': 6000,
        '짬뽕': 7000,
        '탕수육': 18000,
        '유린기': 20000,
        '깐쇼새우': 22000
    };
    return prices[menu] || 0;
}

module.exports = router;
