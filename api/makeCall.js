async function makeCall() {
  const phoneNumber = document.getElementById('phoneNumber').value.trim();
  const phoneError = document.getElementById('phoneError');
  const message = document.getElementById('voiceMessageContent').dataset.message || 'Default message if no voice input';

  // Validate the phone number
  if (!phoneNumber) {
      phoneError.textContent = 'Please enter a phone number.';
      return;
  } else if (!isValidPhoneNumber(phoneNumber)) {
      phoneError.textContent = 'Please enter a valid phone number with up to 12 characters, including only numbers and the "+" symbol.';
      return;
  } else {
      phoneError.textContent = ''; // Clear any previous error
  }

  try {
      const response = await fetch('/api/makeCall', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ phoneNumber, message })
      });

      // Check if response is OK (status in the range 200-299)
      if (!response.ok) {
          const errorText = await response.text(); // Get response as text for debugging
          console.error('Error response:', errorText);
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Attempt to parse the response as JSON
      const data = await response.json();
      console.log('Response data:', data);
  } catch (error) {
      // Handle the error
      console.error('Error making the call:', error);
      alert('An error occurred: ' + error.message);
  }
}
