# Problem

- Back pain, poor posture
- Body Mindfulness

# Solution

- Provide users an accessible webapp to track their body posture while working at a computer with a webcam

# Aang, our epic avatar will fix your back pain

# Business Plan

- Free (with ads)
  - Advertisements based on self-improvement, fitness, mental health
  - Goes well with the theme of healthy living

# Usage

1. Calibrate your start position (stay still with good posture for 10 frames!)
2. Tracking dots will appear on your screen. After calibration, they will stay in your "optimal" position
3. Whenever you stray too far from your initial position, after a brief delay the model will highlight the affected body part

# Features

- Detect changes in posture
- Displays whether the user is too far, neutral, or too close to the screen
- All in the browser to preserve user privacy
  - No pose data ever leaves the user's computer

## Technical Details

- Tensorflow.js (posenet model)
- React.js

# Plans for the future

- Future features: Eye strain (blinking), notifications to take breaks
- Mobile/Desktop app
- UI Impovements
- Smart Mirror integration
