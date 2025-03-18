// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [buttonValue, setButtonValue] = useState('');
  const [isTargeting, setIsTargeting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('서버에 연결됨. 버튼을 입력해주세요.');
  
  const handleButtonValueChange = (e) => {
    setButtonValue(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('요청 처리 중...');
    
    try {
      console.log("Sending button value:", buttonValue);  // buttonValue가 올바르게 전달되고 있는지 확인
      const response = await axios.post('http://localhost:5000/set_target_button', {
        button_value: buttonValue
      });
      console.log("response.data : ", response.data);
      if (response.data.status === 'success') {
        setIsTargeting(buttonValue !== '');
        if (buttonValue !== '') {
          setStatusMessage(`버튼 ${buttonValue} 탐지 중입니다. 서버 화면을 확인하세요.`);
        } else {
          setStatusMessage('모든 버튼을 탐지 중입니다. 서버 화면을 확인하세요.');
        }
      }
    } catch (error) {
      console.error('Error setting target button:', error);
      setStatusMessage('서버 연결 오류! 서버가 실행 중인지 확인하세요.  ${error.message}');
    }
  };
  
  const handleReset = async () => {
    setStatusMessage('요청 처리 중...');
    
    try {
      await axios.post('http://localhost:5000/set_target_button', {
        button_value: ''
      });
      setButtonValue('');
      setIsTargeting(false);
      setStatusMessage('모든 버튼을 탐지 중입니다. 서버 화면을 확인하세요.');
    } catch (error) {
      console.error('Error resetting target button:', error);
      setStatusMessage('서버 연결 오류! 서버가 실행 중인지 확인하세요.');
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>엘리베이터 버튼 탐지 시스템</h1>
      </header>
      
      <main className="app-content">
        <div className="control-panel">
          <div className="status-display">
            <h2>상태</h2>
            <div className={`status-message ${isTargeting ? 'targeting' : ''}`}>
              {statusMessage}
            </div>
          </div>
          
          <div className="input-panel">
            <h2>버튼 선택</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <input
                  type="text"
                  value={buttonValue}
                  onChange={handleButtonValueChange}
                  placeholder="찾고 싶은 버튼 번호 입력"
                />
              </div>
              <div className="button-group">
                <button type="submit" className="primary-button">
                  검색
                </button>
                {isTargeting && (
                  <button type="button" onClick={handleReset} className="secondary-button">
                    모든 버튼 탐지로 복귀
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="instructions">
            <h2>사용 방법</h2>
            <ol>
              <li>Flask 서버를 실행하세요. 서버에서 카메라 영상이 표시됩니다.</li>
              <li>위 입력창에 찾고자 하는 버튼 번호를 입력하세요.</li>
              <li>"검색" 버튼을 클릭하면 해당 버튼만 탐지합니다.</li>
              <li>"모든 버튼 탐지로 복귀" 버튼을 클릭하면 모든 버튼을 탐지합니다.</li>
              <li>서버 화면의 영상 창에서 탐지 결과를 확인하세요.</li>
              <li>영상 창에서 'q' 키를 누르면 영상 보기를 종료할 수 있습니다.</li>
            </ol>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>엘리베이터 버튼 탐지 시스템 © 2025</p>
      </footer>
    </div>
  );
}

export default App;