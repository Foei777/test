import React, { useState, useRef } from 'react';
import './ver.css'; // Import CSS file for styling

function App() {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [response, setResponse] = useState('');

  const pinInputs = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedToken = localStorage.getItem('token');
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ pin: pin.join(''), token: storedToken })
      };

      const result = await fetch('https://verify-277af9cf1cd5.herokuapp.com/verify-otp', options);
      if (!result.ok) {
        throw new Error('Failed to verify OTP');
      }
      const data = await result.json();
      setResponse(data);
    } catch (error) {
      console.error('Error:', error);
      setResponse({ error: error.message });
    }
  };

  const handlePinChange = (e, index) => {
    const newPin = [...pin];
    newPin[index] = e.target.value;

    if (index < 5 && e.target.value !== '') {
      pinInputs.current[index + 1].focus();
    }

    setPin(newPin);
  };

  const handleKeyDown = (e, index) => {
    // ถ้าผู้ใช้กดปุ่มลบ (backspace) และค่าในช่อง input ว่างเปล่า
    if (e.key === 'Backspace' && pin[index] === '') {
      const newPin = [...pin];
      if (index > 0) {
        newPin[index - 1] = ''; // ลบค่า pin ในช่องก่อนหน้า
        pinInputs.current[index - 1].focus(); // โฟกัสไปที่ช่องก่อนหน้า
      }
      setPin(newPin);
    }
  };

  return (
    <div className="container">
      <h1>Verify OTP</h1>
      <form onSubmit={handleSubmit}>
        <div className="pin-input">
          {pin.map((value, index) => (
            <input
              ref={(el) => (pinInputs.current[index] = el)}
              key={index}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handlePinChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)} // เพิ่มการตรวจสอบเหตุการณ์ onKeyDown
              autoComplete="off" // เพิ่ม autocomplete="off" เพื่อปิดคำแนะนำอัตโนมัติ
            />
          ))}
        </div>
        <button type="submit">Verify OTP</button>
      </form>
      {response && (
        <div className="response-container">
          <h2>Response:</h2>
          {response.error ? (
            <p>Error: {response.error}</p>
          ) : (
            <p>{JSON.stringify(response)}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
