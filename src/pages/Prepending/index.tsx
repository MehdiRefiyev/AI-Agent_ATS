import { useLocation } from 'react-router-dom';
import styles from './Prepending.module.css';

// sabah typescript istifade ederek api.ts ucun get post methodlarini yazmaq lazimdi cunki biz sual gondermeliyik ve response almaliyiq onuda
// oz yazacaqimiz lahiyede istifade edeceyik 

// import { GoogleGenAI } from "@google/genai";

export default function Prepending() {

  // const ai = new GoogleGenAI({ apiKey: "" });

  // async function main() : Promise<void> {
  //   const response = await ai.models.generateContent({
  //     model: "gemini-2.0-flash",
  //     contents: "Explain how AI works in a few words",
  //   });
  //   console.log(response.text);
  // }

  // main();


  const location = useLocation();

  const { text } = location.state || {};

  console.log(text);

  return (
    <div className={styles.preloderContainer}>
      <span className={styles.loader}></span>
      <p className={styles.statusText}>Processing</p>
    </div>
  )
}
