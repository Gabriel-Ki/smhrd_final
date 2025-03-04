use mysql;

create database js_db;
create user js_user@localhost identified by '1234';
create user js_user@'192.168.219.*' identified by '1234';
create user js_user@'%' identified by '1234';
grant all privileges on js_db.* to js_user@localhost;
grant all privileges on js_db.* to js_user@'192.168.219.*';
grant all privileges on js_db.* to js_user@'192.168.219.*';
flush privileges;
CREATE TABLE js_admin
(
    `admin_id`    VARCHAR(50)     NOT NULL    COMMENT '관리자 아이디', 
    `admin_pw`    VARCHAR(128)    NOT NULL    COMMENT '관리자 비밀번호', 
    `admin_name`  VARCHAR(50)     NOT NULL    COMMENT '관리자 이름', 
    `created_at`  TIMESTAMP       NOT NULL    COMMENT '관리자 등록일자', 
     PRIMARY KEY (admin_id)
);

-- 테이블 Comment 설정 SQL - js_admin
ALTER TABLE js_admin COMMENT '관리자';


-- js_robot Table Create SQL
-- 테이블 생성 SQL - js_robot
CREATE TABLE js_robot
(
    `robot_idx`     INT UNSIGNED     NOT NULL    AUTO_INCREMENT COMMENT '로봇 식별자', 
    `robot_uid`     VARCHAR(50)      NOT NULL    COMMENT '로봇 고유번호(UID)', 
    `battery`       DECIMAL(4, 1)    NOT NULL    COMMENT '배터리 용량', 
    `robot_status`  VARCHAR(50)      NOT NULL    COMMENT '운전 상태', 
    `created_at`    TIMESTAMP        NOT NULL    COMMENT '등록 일자', 
    `admin_id`      VARCHAR(50)      NOT NULL    COMMENT '관리자 아이디', 
     PRIMARY KEY (robot_idx)
);

-- 테이블 Comment 설정 SQL - js_robot
ALTER TABLE js_robot COMMENT '로봇 정보';

-- Foreign Key 설정 SQL - js_robot(admin_id) -> js_admin(admin_id)
ALTER TABLE js_robot
    ADD CONSTRAINT FK_js_robot_admin_id_js_admin_admin_id FOREIGN KEY (admin_id)
        REFERENCES js_admin (admin_id) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - js_robot(admin_id)
-- ALTER TABLE js_robot
-- DROP FOREIGN KEY FK_js_robot_admin_id_js_admin_admin_id;


-- js_delivery Table Create SQL
-- 테이블 생성 SQL - js_delivery
CREATE TABLE js_delivery
(
    `deli_idx`        INT UNSIGNED      NOT NULL    AUTO_INCREMENT COMMENT '배달 식별자', 
    `robot_idx`       INT UNSIGNED      NOT NULL    COMMENT '로봇 식별자', 
    `st_nm`           VARCHAR(255)      NOT NULL    COMMENT '출발지 명', 
    `st_x`            DECIMAL(12, 3)    NOT NULL    COMMENT '출발지 x좌표', 
    `st_y`            DECIMAL(12, 3)    NOT NULL    COMMENT '출발지 y좌표', 
    `ed_nm`           VARCHAR(255)      NOT NULL    COMMENT '도착지 명', 
    `ed_x`            DECIMAL(12, 3)    NOT NULL    COMMENT '도착지 x좌표', 
    `ed_y`            DECIMAL(12, 3)    NOT NULL    COMMENT '도착지 y좌표', 
    `deli_done_time`  TIMESTAMP         NOT NULL    COMMENT '배달 완료 시간', 
    `deli_req_time`   TIMESTAMP         NOT NULL    COMMENT '배달 요청 시간', 
    `deli_status`     VARCHAR(50)       NOT NULL    COMMENT '배달 상태', 
     PRIMARY KEY (deli_idx)
);

-- 테이블 Comment 설정 SQL - js_delivery
ALTER TABLE js_delivery COMMENT '배달 정보';

-- Foreign Key 설정 SQL - js_delivery(robot_idx) -> js_robot(robot_idx)
ALTER TABLE js_delivery
    ADD CONSTRAINT FK_js_delivery_robot_idx_js_robot_robot_idx FOREIGN KEY (robot_idx)
        REFERENCES js_robot (robot_idx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - js_delivery(robot_idx)
-- ALTER TABLE js_delivery
-- DROP FOREIGN KEY FK_js_delivery_robot_idx_js_robot_robot_idx;


-- js_env Table Create SQL
-- 테이블 생성 SQL - js_env
CREATE TABLE js_env
(
    `env_idx`     INT UNSIGNED      NOT NULL    AUTO_INCREMENT COMMENT '환경 식별자', 
    `env_type`    VARCHAR(50)       NOT NULL    COMMENT '센서 타입', 
    `env_value`   DECIMAL(12, 3)    NOT NULL    COMMENT '센서 값', 
    `created_at`  TIMESTAMP         NOT NULL    COMMENT '등록 일자', 
    `robot_idx`   INT UNSIGNED      NOT NULL    COMMENT '로봇 식별자', 
     PRIMARY KEY (env_idx)
);

-- 테이블 Comment 설정 SQL - js_env
ALTER TABLE js_env COMMENT '환경 정보';

-- Foreign Key 설정 SQL - js_env(robot_idx) -> js_robot(robot_idx)
ALTER TABLE js_env
    ADD CONSTRAINT FK_js_env_robot_idx_js_robot_robot_idx FOREIGN KEY (robot_idx)
        REFERENCES js_robot (robot_idx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - js_env(robot_idx)
-- ALTER TABLE js_env
-- DROP FOREIGN KEY FK_js_env_robot_idx_js_robot_robot_idx;


-- js_deli_log Table Create SQL
-- 테이블 생성 SQL - js_deli_log
CREATE TABLE js_deli_log
(
    `log_idx`      INT UNSIGNED    NOT NULL    AUTO_INCREMENT COMMENT '로그 식별자', 
    `deli_log`     INT UNSIGNED    NOT NULL    COMMENT '배달 식별자', 
    `deli_status`  VARCHAR(255)    NOT NULL    COMMENT '배달 상태', 
    `created_at`   TIMESTAMP       NOT NULL    COMMENT '등록 일자', 
     PRIMARY KEY (log_idx)
);

-- 테이블 Comment 설정 SQL - js_deli_log
ALTER TABLE js_deli_log COMMENT '배달 로그 기록';

-- Foreign Key 설정 SQL - js_deli_log(deli_log) -> js_delivery(deli_idx)
ALTER TABLE js_deli_log
    ADD CONSTRAINT FK_js_deli_log_deli_log_js_delivery_deli_idx FOREIGN KEY (deli_log)
        REFERENCES js_delivery (deli_idx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - js_deli_log(deli_log)
-- ALTER TABLE js_deli_log
-- DROP FOREIGN KEY FK_js_deli_log_deli_log_js_delivery_deli_idx;


-- js_event Table Create SQL
-- 테이블 생성 SQL - js_event
CREATE TABLE js_event
(
    `event_idx`      INT UNSIGNED    NOT NULL    AUTO_INCREMENT COMMENT '이벤트 식별자', 
    `robot_idx`      INT UNSIGNED    NOT NULL    COMMENT '로봇 식별자', 
    `event_type`     VARCHAR(50)     NOT NULL    COMMENT '이벤트 종류', 
    `event_content`  TEXT            NOT NULL    COMMENT '이벤트 내용', 
    `created_at`     TIMESTAMP       NOT NULL    COMMENT '등록 일자', 
     PRIMARY KEY (event_idx)
);

-- 테이블 Comment 설정 SQL - js_event
ALTER TABLE js_event COMMENT '로봇 이벤트';

-- Foreign Key 설정 SQL - js_event(robot_idx) -> js_robot(robot_idx)
ALTER TABLE js_event
    ADD CONSTRAINT FK_js_event_robot_idx_js_robot_robot_idx FOREIGN KEY (robot_idx)
        REFERENCES js_robot (robot_idx) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- Foreign Key 삭제 SQL - js_event(robot_idx)
-- ALTER TABLE js_event
-- DROP FOREIGN KEY FK_js_event_robot_idx_js_robot_robot_idx;


-- js_location Table Create SQL
-- 테이블 생성 SQL - js_location
CREATE TABLE js_location
(
    `loc_idx`     INT UNSIGNED      NOT NULL    AUTO_INCREMENT COMMENT '위치 식별자', 
    `robot_idx`   INT UNSIGNED      NOT NULL    COMMENT '로봇 식별자', 
    `x`           DECIMAL(12, 3)    NOT NULL    COMMENT '위치_x', 
    `y`           DECIMAL(12, 3)    NOT NULL    COMMENT '위치_y', 
    `created_at`  TIMESTAMP         NOT NULL    COMMENT '등록 일자', 
     PRIMARY KEY (loc_idx)
);

-- 테이블 Comment 설정 SQL - js_location
ALTER TABLE js_location COMMENT '로봇 위치';

-- Foreign Key 설정 SQL - js_location(robot_idx) -> js_robot(robot_idx)
ALTER TABLE js_location
    ADD CONSTRAINT FK_js_location_robot_idx_js_robot_robot_idx FOREIGN KEY (robot_idx)
        REFERENCES js_robot (robot_idx) ON DELETE RESTRICT ON UPDATE RESTRICT;
