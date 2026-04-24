import React, { useEffect, useRef, useState } from "react";
import { detect, init} from '../utils/utils'
import "./FaceExpression.scss"

export default function FaceExpression({ onClick }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Detecting...");

  useEffect(() => {

    init({ landmarkerRef, videoRef, streamRef });

    return () => {    
      if (landmarkerRef.current) {
        landmarkerRef.current.close();
      }
   
      if (videoRef.current ?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);



  async function handleClick() {
    const expression = detect({ landmarkerRef, videoRef, setExpression })
    
    if (onclick) {
      onclick(expression)
    }
  }
  
  return (
    // <div style={{ textAlign: "center" }}>
    //   <video 
    //     ref={videoRef}
    //     style={{ width: "400px", borderRadius: "12px"}}
    //     playsInline
    //     />
    //   <h2>Emotion: {expression}</h2>
    //   <button onClick={handleClick} >Detect expression</button>
    // </div>

    
    <div className="container">
      <h1 className="title">AI Emotion Detector 🤖</h1>

      <div className="video-container">
        <video ref={videoRef} autoPlay playsInline />
        <div className="overlay"></div>
      </div>

      <div className="card">
        <h2>Emotion: {expression}</h2>
      </div>

      <button className="detect-btn" onClick={handleClick}>
        Detect Expression
      </button>
    </div>

  );

}
