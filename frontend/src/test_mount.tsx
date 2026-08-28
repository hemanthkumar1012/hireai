import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { jobsApi } from './services/api';

const TestApp = () => {
  const [res, setRes] = useState('loading');
  useEffect(() => {
    jobsApi.search().then(data => setRes(JSON.stringify(data))).catch(e => setRes(e.message));
  }, []);
  return <div>{res}</div>;
};

createRoot(document.getElementById('root')!).render(<TestApp />);
