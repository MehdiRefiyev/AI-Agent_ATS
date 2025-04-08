import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import styles from './Prepending.module.css';
import { post } from '../../utils/api';

export default function Prepending() {
  const location = useLocation();
  const { text } = location.state || {};

  const [newCv, setNewCv] = useState('');

  useEffect(() => {
    async function fetchAtsContext() {
      const result = await post(`
        ${text}
        
        Analyze the following resume content and determine if it meets ATS (Applicant Tracking System) standards.
        If it is not rewrite for me and I dont need ANY explanation like 'I understand you'  , PAGE NUMBERs , ONLY context!!!!. 
        Also without ** symbols like that . Additional information for you Ə is E in Latin.
      `);
      setNewCv(result ?? ''); // Use nullish coalescing to default to empty string
    }
    fetchAtsContext();
  }, [text]);

  const navigate = useNavigate();

  useEffect(() => {
    if (newCv !== '') {
      navigate('/response', {
        state: {
          text: newCv,
        },
      });
    }
  }, [newCv, navigate]);

  return (
    <div className={styles.preloderContainer}>
      <span className={styles.loader}></span>
      <p className={styles.statusText}>Processing</p>
    </div>
  );
}