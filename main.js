document.addEventListener('DOMContentLoaded', () => {
  const stepRequest = document.getElementById('step-request');
  const stepVerify = document.getElementById('step-verify');
  const stepSuccess = document.getElementById('step-success');

  const btnSendOtp = document.getElementById('btn-send-otp');
  const btnVerifyOtp = document.getElementById('btn-verify-otp');
  const btnBack = document.getElementById('btn-back');
  
  const phoneNumberInput = document.getElementById('phone-number');
  const otpInputs = document.querySelectorAll('.otp-digit');
  const demoCodeDisplay = document.getElementById('demo-code');

  let generatedOTP = '1234';

  // Clean phone input to allow numbers only
  phoneNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
  });

  // Step 1 -> Step 2
  btnSendOtp.addEventListener('click', () => {
    const phoneVal = phoneNumberInput.value.trim();
    if (phoneVal.length < 10) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    // Generate a clean 4-digit mock OTP code for demo purposes
    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();
    demoCodeDisplay.textContent = generatedOTP;

    stepRequest.classList.remove('active');
    stepVerify.classList.add('active');

    // Focus on the first OTP digit after transition
    setTimeout(() => otpInputs[0].focus(), 150);
  });

  // Handle the automatic focus jumps for sequential OTP input boxes
  otpInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
      
      // If user typed a number, advance focus to the next field
      if (e.target.value !== '' && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
    });

    // Handle backspace focus behavior
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
        otpInputs[index - 1].focus();
      }
    });
  });

  // Step 2 -> Step 3 (Verification Check)
  btnVerifyOtp.addEventListener('click', () => {
    let enteredOTP = '';
    otpInputs.forEach(input => enteredOTP += input.value);

    if (enteredOTP.length < 4) {
      alert('Please enter the full 4-digit code.');
      return;
    }

    if (enteredOTP === generatedOTP) {
      stepVerify.classList.remove('active');
      stepSuccess.classList.add('active');
      
      // Real-world Integration Note:
      // If using this with a real hotspot controller (like MikroTik, pfSense, etc.)
      // you would normally submit a POST request to the router gateway here.
      // E.g., document.forms['login'].submit();
    } else {
      alert('Incorrect code. Please check the code shown in the instructions and try again!');
      // Reset inputs
      otpInputs.forEach(input => input.value = '');
      otpInputs[0].focus();
    }
  });

  // Back navigation
  btnBack.addEventListener('click', () => {
    stepVerify.classList.remove('active');
    stepRequest.classList.add('active');
  });
});