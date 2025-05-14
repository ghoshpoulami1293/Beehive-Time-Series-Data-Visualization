import React from 'react';
import HiveSection from './HiveSection';

const Dashboard = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🐝 Apiary Dashboard</h1>

      <h2>Hive B</h2>
      <HiveSection hiveId="b" location="outside-hive" />
      <HiveSection hiveId="b" location="upper-brood" />

      <h2>Hive C</h2>
      <HiveSection hiveId="c" location="upper-brood" />

      <h2>Hive E</h2>
      <HiveSection hiveId="e" location="outside-hive" />
      <HiveSection hiveId="e" location="upper-brood" />
    </div>
  );
};

export default Dashboard;
