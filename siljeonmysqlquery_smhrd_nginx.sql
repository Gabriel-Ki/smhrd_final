SHOW DATABASES;

USE campus_24IS_IOT2_p3_2;

# DB 생성
-- CREATE DATABASE js_db;
-- 이미 위에 campus_24IS_IOT2_p3_2 DB가 존재해서 그곳에 테이블 만들기로 함

# DB 접근 권한이 있는 유저 생성
CREATE USER js_user@localhost IDENTIFIED BY '1234';
# 접근 가능한 IP 범위 지정
CREATE USER js_user@'192.168.219.*' IDENTIFIED BY '1234';
CREATE USER js_user@'%' IDENTIFIED BY '1234';

# 권한 부여
GRANT ALL PRIVILEGES ON js_db.* TO js_user@localhost;
GRANT ALL PRIVILEGES ON js_db.* TO js_user@'192.168.219.*';
GRANT ALL PRIVILEGES ON js_db.* TO js_user@'%';

# 권한 설정
FLUSH PRIVILEGES;

# 관리자 테이블
CREATE TABLE js_admin (
    admin_id VARCHAR(50) NOT NULL COMMENT '관리자 아이디',
    admin_pw VARCHAR(128) NOT NULL COMMENT '관리자 비밀번호',
    admin_name VARCHAR(50) NOT NULL COMMENT '관리자 이름',
    created_at TIMESTAMP NOT NULL COMMENT '관리자 등록일자',
    PRIMARY KEY (admin_id)
);
ALTER TABLE js_admin COMMENT '관리자 정보';

# 유저 테이블 (회원가입)
CREATE TABLE js_user (
    user_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '사용자 식별자',
    username VARCHAR(50) NOT NULL COMMENT '사용자 이름',
    phone VARCHAR(20) UNIQUE NOT NULL COMMENT '전화번호',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '이메일',
    password VARCHAR(255) NOT NULL COMMENT '비밀번호',
    address TEXT COMMENT '주소',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '등록 일자'
);
ALTER TABLE js_user COMMENT '사용자 정보';

# 로봇 정보 
CREATE TABLE js_robot (
    robot_idx INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '로봇 식별자',
    robot_uid VARCHAR(50) NOT NULL COMMENT '로봇 고유번호(UID)',
    battery DECIMAL(4, 1) NOT NULL COMMENT '배터리 용량',
    robot_status VARCHAR(50) NOT NULL COMMENT '운전 상태',
    created_at TIMESTAMP NOT NULL COMMENT '등록 일자',
    admin_id VARCHAR(50) NOT NULL COMMENT '관리자 아이디',
    FOREIGN KEY (admin_id) REFERENCES js_admin(admin_id) ON DELETE RESTRICT ON UPDATE RESTRICT
);
ALTER TABLE js_robot COMMENT '로봇 정보';

# 배달정보
CREATE TABLE js_delivery (
    deli_idx INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '배달 식별자',
    user_id INT UNSIGNED NOT NULL COMMENT '사용자 ID',
    robot_idx INT UNSIGNED NOT NULL COMMENT '로봇 식별자',
    st_nm VARCHAR(255) NOT NULL COMMENT '출발지 명',
    st_x DECIMAL(12, 3) NOT NULL COMMENT '출발지 x좌표',
    st_y DECIMAL(12, 3) NOT NULL COMMENT '출발지 y좌표',
    ed_nm VARCHAR(255) NOT NULL COMMENT '도착지 명',
    ed_x DECIMAL(12, 3) NOT NULL COMMENT '도착지 x좌표',
    ed_y DECIMAL(12, 3) NOT NULL COMMENT '도착지 y좌표',
    deli_done_time TIMESTAMP NULL COMMENT '배달 완료 시간',
    deli_req_time TIMESTAMP NOT NULL COMMENT '배달 요청 시간',
    deli_status VARCHAR(50) NOT NULL COMMENT '배달 상태',
    FOREIGN KEY (user_id) REFERENCES js_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (robot_idx) REFERENCES js_robot(robot_idx) ON DELETE RESTRICT ON UPDATE RESTRICT
);
ALTER TABLE js_delivery COMMENT '배달 정보';

CREATE TABLE js_deli_status_log (
    status_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '상태 로그 식별자',
    deli_idx INT UNSIGNED NOT NULL COMMENT '배달 식별자',
    prev_status VARCHAR(50) COMMENT '이전 상태',
    new_status VARCHAR(50) NOT NULL COMMENT '변경된 상태',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '변경 시간',
    FOREIGN KEY (deli_idx) REFERENCES js_delivery(deli_idx) ON DELETE CASCADE
);

ALTER TABLE js_deli_status_log COMMENT '배달 상태 변경 이력';

CREATE TABLE js_deli_log (
    log_idx INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '로그 식별자',
    deli_idx INT UNSIGNED NOT NULL COMMENT '배달 식별자',
    deli_status VARCHAR(255) NOT NULL COMMENT '배달 상태',
    created_at TIMESTAMP NOT NULL COMMENT '등록 일자',
    FOREIGN KEY (deli_idx) REFERENCES js_delivery(deli_idx) ON DELETE CASCADE
);

ALTER TABLE js_deli_log COMMENT '배달 로그 기록';


CREATE TABLE js_delivery_request (
    request_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '배달 요청 식별자',
    user_id INT UNSIGNED NOT NULL COMMENT '사용자 ID',
    st_nm VARCHAR(255) NOT NULL COMMENT '출발지 명',
    st_x DECIMAL(12, 3) NOT NULL COMMENT '출발지 x좌표',
    st_y DECIMAL(12, 3) NOT NULL COMMENT '출발지 y좌표',
    ed_nm VARCHAR(255) NOT NULL COMMENT '도착지 명',
    ed_x DECIMAL(12, 3) NOT NULL COMMENT '도착지 x좌표',
    ed_y DECIMAL(12, 3) NOT NULL COMMENT '도착지 y좌표',
    request_status VARCHAR(50) NOT NULL DEFAULT '승인 대기' COMMENT '요청 상태',
    request_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '요청 시간',
    admin_id VARCHAR(50) DEFAULT NULL COMMENT '승인한 관리자 ID',
    approve_time TIMESTAMP NULL COMMENT '승인 시간',
    FOREIGN KEY (user_id) REFERENCES js_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES js_admin(admin_id) ON DELETE SET NULL
);

ALTER TABLE js_delivery_request COMMENT '배달 요청 정보';


CREATE TABLE js_delivery (
    deli_idx INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '배달 식별자',
    request_id INT UNSIGNED NOT NULL COMMENT '배달 요청 ID',
    user_id INT UNSIGNED NOT NULL COMMENT '사용자 ID',
    robot_idx INT UNSIGNED DEFAULT NULL COMMENT '로봇 식별자',
    deli_status VARCHAR(50) NOT NULL DEFAULT '승인 대기' COMMENT '배달 상태',
    deli_done_time TIMESTAMP NULL COMMENT '배달 완료 시간',
    deli_req_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '배달 승인 시간',
    FOREIGN KEY (request_id) REFERENCES js_delivery_request(request_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES js_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (robot_idx) REFERENCES js_robot(robot_idx) ON DELETE SET NULL
);

ALTER TABLE js_delivery COMMENT '배달 정보';


CREATE TABLE js_deli_status_log (
    status_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '상태 로그 식별자',
    deli_idx INT UNSIGNED NOT NULL COMMENT '배달 식별자',
    prev_status VARCHAR(50) COMMENT '이전 상태',
    new_status VARCHAR(50) NOT NULL COMMENT '변경된 상태',
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '변경 시간',
    FOREIGN KEY (deli_idx) REFERENCES js_delivery(deli_idx) ON DELETE CASCADE
);

ALTER TABLE js_deli_status_log COMMENT '배달 상태 변경 이력';

CREATE TABLE js_payment (
    payment_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '결제 ID',
    request_id INT UNSIGNED NOT NULL COMMENT '배달 요청 ID',
    user_id INT UNSIGNED NOT NULL COMMENT '사용자 ID',
    amount DECIMAL(10, 2) NOT NULL COMMENT '결제 금액',
    payment_status VARCHAR(50) NOT NULL DEFAULT '결제 대기' COMMENT '결제 상태',
    payment_time TIMESTAMP NULL COMMENT '결제 시간',
    payment_method VARCHAR(50) NOT NULL COMMENT '결제 방법 (카드, 계좌이체, 포인트 등)',
    FOREIGN KEY (request_id) REFERENCES js_delivery_request(request_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES js_user(user_id) ON DELETE CASCADE
);

ALTER TABLE js_payment COMMENT '결제 정보';

CREATE TABLE js_refund (
    refund_id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '환불 ID',
    payment_id INT UNSIGNED NOT NULL COMMENT '결제 ID',
    user_id INT UNSIGNED NOT NULL COMMENT '사용자 ID',
    refund_amount DECIMAL(10, 2) NOT NULL COMMENT '환불 금액',
    refund_reason TEXT NOT NULL COMMENT '환불 사유',
    refund_status VARCHAR(50) NOT NULL DEFAULT '환불 요청' COMMENT '환불 상태',
    refund_time TIMESTAMP NULL COMMENT '환불 완료 시간',
    FOREIGN KEY (payment_id) REFERENCES js_payment(payment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES js_user(user_id) ON DELETE CASCADE
);

ALTER TABLE js_refund COMMENT '환불 정보';

