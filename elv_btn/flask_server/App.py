import warnings
warnings.filterwarnings("ignore")

from flask import Flask, request, jsonify
import cv2
import torch
import numpy as np
import pathlib
import platform
import threading
import sys
import os
import requests
import torchvision.transforms as transforms
from PIL import Image
from flask_cors import CORS
import time
import torchvision.models as models
import torch.nn as nn

# Windows에서 PosixPath 문제 해결
if platform.system() == 'Windows':
    temp = pathlib.PosixPath
    pathlib.PosixPath = pathlib.WindowsPath

# YOLOv5 및 PyTorch 모델 경로 설정
yolov5_path = 'yolov5'  # YOLOv5 경로
cnn_model_path = 'btn_state_model.pth'  # MobileNetV2 PyTorch 모델 경로

if yolov5_path not in sys.path:
    sys.path.append(yolov5_path)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # 모든 요청 허용

# 전역 변수로 타겟 버튼 설정 (기본값은 None으로 모든 버튼 탐지)
target_button = None

running = True  # 영상 처리 상태

# 🔹 YOLOv5 모델 로드
def load_yolo_model():
    model_path = 'best.pt'  # YOLOv5 모델 파일
    if not os.path.exists(model_path):
        print(f"⚠ 모델 파일을 찾을 수 없습니다: {model_path}")
        return None
    try:
        model = torch.hub.load(yolov5_path, 'custom', path=model_path, source='local', force_reload=True)
        model.conf = 0.8  # 신뢰도 임계값 (감지 기준)
        model.iou = 0.8   # NMS IoU 임계값
        return model
    except Exception as e:
        print(f"⚠ YOLO 모델 로드 중 오류 발생: {e}")
        return None

# 🔹 MobileNetV2 모델 로드 (전체 모델 로드 방식)
def load_cnn_model():
    try:
        if not os.path.exists(cnn_model_path):
            print(f"❌ 모델 파일을 찾을 수 없습니다: {cnn_model_path}")
            return None

        # 🔥 전체 모델 로드
        model = torch.load(cnn_model_path, map_location=torch.device('cpu'))
        model.eval()  # 추론 모드

        print("✅ MobileNetV2 모델 로드 완료")
        return model
    except Exception as e:
        print(f"⚠ MobileNetV2 모델 로드 오류: {e}")
        return None

# 🔹 CNN 예측 함수 (MobileNetV2)
transform = transforms.Compose([
    transforms.Resize((224, 224)),  # CNN 모델의 학습 크기와 맞춤
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])  # 학습 시 Normalize 적용
])

def predict_button_state(image, model):
    try:
        # 🔹 OpenCV (BGR) → PIL (RGB) 변환
        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
        image_pil = Image.fromarray(image_rgb)

        # 🔹 CNN 입력 전처리 적용 (Resize + Normalize)
        image = transform(image_pil).unsqueeze(0)  # (1, 3, 224, 224)
        image = image.to(torch.device('cpu'))  # CPU에서 실행

        # 🔹 MobileNetV2 모델 추론
        with torch.no_grad():
            output = model(image)

            # 🔹 출력 차원 확인
            print(f"🔹 모델 출력 크기: {output.shape}")  # 디버깅

            # 🔹 `output`이 (1,2) 또는 (1,1) 형태인지 확인
            if output.shape[-1] == 2:  
                # 🔹 Softmax 기반 다중 클래스 모델인 경우
                prob = torch.softmax(output, dim=1)[0][1].item()  # ON 클래스 확률
            else:
                # 🔹 Sigmoid 기반 이진 분류 모델인 경우
                prob = torch.sigmoid(output[0]).item()

        print(f"🔹 예측 확률: {prob:.9f}")  # 디버깅용

        # 🔹 0.5를 기준으로 ON/OFF 판별
        return "ON" if prob >= 0.00001 else "OFF"

    except Exception as e:
        print(f"⚠ MobileNetV2 예측 오류: {e}")
        return 'OFF'

# 🔹 카메라 초기화 (연결 재시도)
def initialize_camera():
    for attempt in range(5):  # 최대 5번 재시도
        cap = cv2.VideoCapture(0)  # 웹캠 사용 (기본: 0)
        if cap.isOpened():
            print(f"✅ 카메라 연결 성공 (시도 {attempt+1}/5)")
            return cap
        print(f"⚠ 카메라 연결 실패 (시도 {attempt+1}/5), 2초 후 재시도...")
        time.sleep(2)  # 2초 대기 후 재시도
    print("❌ 카메라를 열 수 없습니다. 프로그램을 종료합니다.")
    sys.exit()  # 카메라 연결 실패 시 프로그램 종료

cap = initialize_camera()

# 🔹 카메라 재연결 (끊겼을 때)
def reset_camera():
    global cap
    cap.release()  # 기존 연결 해제
    print("⚠ 카메라 연결이 끊어졌습니다. 다시 연결 시도 중...")
    cap = initialize_camera()  # 재연결 시도
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
    
# 🔹 실시간 영상 처리
def process_video():
    global running,target_button
    
    # 모델 로드
    yolo_model = load_yolo_model()
    cnn_model = load_cnn_model()
    if not yolo_model or not cnn_model:
        print("❌ 모델 로드 실패. 종료합니다.")
        return

    print("✅ 실시간 영상 시작. 'q' 키를 누르면 종료됩니다.")

    while running:
        ret, frame = cap.read()
        if not ret:
            print("⚠ 카메라 프레임을 읽을 수 없습니다.")
            reset_camera()
            continue
                
        results = yolo_model(frame)
        detections = results.pandas().xyxy[0]
        
        # 타겟 버튼 필터링
        if target_button is not None:
            # 필터링 로직 (모델에 따라 수정 필요)
            filtered_detections = detections[detections['name'] == str(target_button)]

            for _, detection in filtered_detections.iterrows():
                x1, y1, x2, y2 = int(detection['xmin']), int(detection['ymin']), int(detection['xmax']), int(detection['ymax'])
                name = detection['name']  # 탐지된 객체 이름
                
                # 🔹 버튼 영역 잘라서 CNN 모델에 입력
                cropped = frame[y1:y2, x1:x2]
                state = predict_button_state(cropped, cnn_model)
                
                # 🔹 ON/OFF에 따라 바운딩 박스 색상 변경
                color = (0, 0, 255) if state == 'ON' else (255, 0, 0)
                
                # 🔹 바운딩 박스 그리기
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f"{name} ({state})", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        else:
            for _, detection in detections.iterrows():
                x1, y1, x2, y2 = int(detection['xmin']), int(detection['ymin']), int(detection['xmax']), int(detection['ymax'])
                name = detection['name']  # 탐지된 객체 이름
                
                # 🔹 버튼 영역 잘라서 CNN 모델에 입력
                cropped = frame[y1:y2, x1:x2]
                state = predict_button_state(cropped, cnn_model)
                
                # 🔹 ON/OFF에 따라 바운딩 박스 색상 변경
                color = (0, 0, 255) if state == 'ON' else (255, 0, 0)
                
                # 🔹 바운딩 박스 그리기
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                cv2.putText(frame, f"{name} ({state})", (x1, y1 - 10),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        # 화면에 출력
        cv2.imshow('Elevator Button Detection', frame)
        
        if cv2.waitKey(1) == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

@app.route('/set_target_button', methods=['POST'])
def set_target_button():
    global target_button
    try:
        data = request.get_json()

        # 데이터 유효성 검사
        if not data or 'button_value' not in data:
            raise ValueError("button_value is missing in the request body")

        button_value = data.get('button_value')
        print('button_value: ',button_value)
        if button_value == '':
            target_button = None  # 빈 값이면 모든 버튼 탐지
        else:
            target_button = button_value  # 특정 버튼만 탐지
        
        print(f"타겟 버튼 설정: {target_button}")
        return jsonify({"status": "success", "target_button": target_button})

    except Exception as e:
        print(f"오류 발생: {e}")  # 오류 발생 시 메시지 출력
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # 영상 처리 스레드 시작
    video_thread = threading.Thread(target=process_video)
    video_thread.daemon = True
    video_thread.start()
    
    # Flask 서버 실행
    try:
        print("Flask 서버 시작. 리액트 앱에서 버튼 값을 전송할 수 있습니다.")
        app.run(debug=False, host='0.0.0.0', port=5000)
    except KeyboardInterrupt:
        print("프로그램 종료 중...")
    finally:
        running = False
        video_thread.join(timeout=1.0)
        print("프로그램이 종료되었습니다.")


# 🔹 Flask API 실행
# if __name__ == '__main__':
#     video_thread = threading.Thread(target=process_video)
#     video_thread.daemon = True
#     video_thread.start()
    
#     app.run(debug=False, host='0.0.0.0', port=5000)
