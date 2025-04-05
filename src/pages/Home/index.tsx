import { JSX, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.css'
import * as pdfjsLib from 'pdfjs-dist';

// Manually specify the worker location
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();


export default function Home() {

  const inputRef = useRef<HTMLInputElement | null>(null);

  const [fileName, setFileName] = useState<string>('');

  const navigate = useNavigate();

  function startRender() {
    const readPfdFile = () => {
      return new Promise((resolve, reject) => {
        if (inputRef.current && inputRef.current.files && inputRef.current.files[0]) {
          const file = inputRef.current.files[0];
          const fileReader = new FileReader();

          fileReader.onload = async () => {
            try {
              const arrayBuffer = fileReader.result as ArrayBuffer;
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              const numPages = pdf.numPages;

              let fullText = '';
              for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                  .map((item) => ('str' in item ? item.str : ''))
                  .join(' ');
                fullText += `Page ${pageNum}: ${pageText}\n`;
              }

              resolve(fullText); // Resolve with the extracted text
            } catch (error) {
              console.error('Error reading PDF:', error);
              reject(error); // Reject on error
            }
          };

          fileReader.onerror = () => {
            reject(new Error('File reading failed'));
          };

          fileReader.readAsArrayBuffer(file);
        } else {
          console.log('No file selected');
          resolve(undefined); // Resolve with null if no file
        }
      });
    };

    readPfdFile()
      .then((pdfText) => {
        navigate('/prepending', {
          state: {
            text: pdfText || 'No content extracted',
          },
        });
      })
      .catch((error) => {
        console.error('Navigation failed:', error);
        // Optionally handle navigation on error
        navigate('/prepending', {
          state: {
            text: 'Error processing PDF',
          },
        });
      });
  }

  function stateBtn(): JSX.Element | null {
    if (fileName !== '') {
      return <button className={styles.btnStart} onClick={startRender}>Start</button>
    }
    return null
  }


  function getFileName() {

    if (inputRef.current) {
      let value: string | undefined = inputRef.current.value;
      setFileName(value);
    }

  }


  return (
    <>
      <div className={styles.container}>
        <h1 className={styles.title}>Please upload your PDF resume file so that it can be rewritten to meet the standards for Applicant Tracking Systems (ATS) used in HR resume evaluations.</h1>
        <div className={styles.inputContainer}>
          <input className={styles.customFileInput} type="file" accept=".pdf" ref={inputRef} onInput={getFileName} />
          <p className={styles.fileCustomName}>{fileName || 'Selected file : '}</p>
          {stateBtn()}
        </div>
      </div>
    </>
  )
}
