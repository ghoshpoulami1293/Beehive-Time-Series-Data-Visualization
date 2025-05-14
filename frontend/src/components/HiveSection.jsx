import React, { useEffect, useState } from 'react';
import { fetchReadings, fetchAverages, fetchMonthlyAverages, fetchMinMax } from '../api';
import ChartComponent from './ChartComponent';

const HiveSection = ({ hiveId, location }) => {
  const [dailyAvg, setDailyAvg] = useState([]);
  const [monthlyAvg, setMonthlyAvg] = useState([]);
  const [rawReadings, setRawReadings] = useState([]);
  const [minMax, setMinMax] = useState([]);

  useEffect(() => {
    const params = { hive_id: hiveId, location };

    fetchAverages(params).then(data => {
      const formatted = data.map(item => ({
        timestamp: item.date,
        temperature: item.avg_temperature,
        humidity: item.avg_humidity
      }));
      setDailyAvg(formatted);
    });

    fetchMonthlyAverages(params).then(data => {
      const formatted = data.map(item => ({
        timestamp: item.month,
        temperature: item.avg_temperature,
        humidity: item.avg_humidity
      }));
      setMonthlyAvg(formatted);
    });

    fetchReadings(params).then(data => {
      const formatted = data.map(item => ({
        ...item,
        timestamp: item.timestamp.split(' ')[0]
      }));
      setRawReadings(formatted);
    });

    fetchMinMax(params).then(data => {
      setMinMax([
        { timestamp: data.highest_temperature_day._id, temperature: data.highest_temperature_day.max_temp },
        { timestamp: data.lowest_temperature_day._id, temperature: data.lowest_temperature_day.min_temp }
      ]);
    });
  }, [hiveId, location]);

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2>{hiveId.toUpperCase()} - {location}</h2>

      <h3>Daily Average</h3>
      <ChartComponent data={dailyAvg} vizType="dailyavg" />

      <h3>Monthly Average</h3>
      <ChartComponent data={monthlyAvg} vizType="monthlyavg" />

      {rawReadings.length > 0 && (
        <>
            <h3>Raw Readings</h3>
            <ChartComponent data={rawReadings} vizType="normal" />
        </>
        )}

      <h3>Min/Max Temperatures</h3>
      <ChartComponent data={minMax} vizType="minmax" />
    </div>
  );
};

export default HiveSection;
