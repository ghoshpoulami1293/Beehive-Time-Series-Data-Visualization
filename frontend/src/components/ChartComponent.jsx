import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, BarChart, Bar
} from 'recharts';

const ChartComponent = ({ data, events, vizType }) => {
  if (!data || data.length === 0) {
    return <p>No data available to display.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      {vizType === 'minmax' ? (
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="temperature" fill="#8884d8" name="Temperature" />
        </BarChart>
      ) : (
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="temperature" stroke="#8884d8" activeDot={{ r: 8 }} name="Temperature" />
          {(vizType === 'normal' || vizType === 'dailyavg' || vizType === 'monthlyavg') && (
            <Line type="monotone" dataKey="humidity" stroke="#82ca9d" name="Humidity" />
          )}
          {vizType === 'normal' && Array.isArray(events) && events.map((event, index) => (
            <ReferenceLine
              key={index}
              x={event.date}
              stroke="red"
              label={{
                value: event.event,
                angle: -90,
                position: 'insideTop',
                fontSize: 12,
                fontWeight: 'bold'
              }}
            />
          ))}
        </LineChart>
      )}
    </ResponsiveContainer>
  );
};

export default ChartComponent;
