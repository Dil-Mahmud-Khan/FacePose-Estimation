import React, { useState, useRef } from 'react';
import opencv from 'opencv.js';

const FaceDetection = () => {
  const videoRef = useRef(null);
  const [gazeAngles, setGazeAngles] = useState({ yaw: 0, pitch: 0 });

  const startStream = () => {
    const video = videoRef.current;
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      video.srcObject = stream;
      video.play();

      // Initialize OpenCV and start face detection
      const mat = opencv.readVideoStream(video);
      const faceCascade = new opencv.CascadeClassifier();
      faceCascade.load('haarcascade_frontalface_default.xml');

      const detectFaces = () => {
        const frame = mat.read();
        const gray = opencv.cvtColor(frame, cv2.COLOR_RGBA2GRAY);
        const faces = faceCascade.detectMultiScale(gray);

        // For each detected face, extract gaze angles
        for (const face of faces) {
          const eyeRoi = frame.roi(face);
          const gazeEstimator = new opencv.GazeEstimator();
          const gazeAngles = gazeEstimator.predict(eyeRoi);

          // Update gaze angles state and log to console
          setGazeAngles({ yaw: gazeAngles[0], pitch: gazeAngles[1] });
          console.log('Gaze Angles: Yaw =', gazeAngles[0], 'Pitch =', gazeAngles[1]);
        }

        // Request the next frame
        window.requestAnimationFrame(detectFaces);
      };

      detectFaces();
    }).catch((error) => {
      console.error('Failed to access webcam:', error);
    });
  };

  return (
    <div>
      <video ref={videoRef} />
    </div>
  );
};

export default FaceDetection;
