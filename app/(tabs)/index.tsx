import { useEffect, useState } from 'react';
import CompanyList from '@/components/CompanyList';
import { initDatabase } from '@/service/database';

export default function HomeScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initDatabase();
      setReady(true);
    };
    init();
  }, []);

  if (!ready) {
    return null;
  }

  return <CompanyList />;
}