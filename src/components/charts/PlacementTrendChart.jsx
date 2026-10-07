import { useState } from 'react';
import {
  Bar, BarChart, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';

export default function PlacementTrendChart({ trends }) {
  const [view, setView] = useState('yearly');

  return (
    <div>
      <div className="seg" role="tablist" aria-label="Trend view">
        {['yearly', 'monthly'].map((v) => (
          <button key={v} role="tab" aria-selected={view === v} className={view === v ? 'on' : ''} onClick={() => setView(v)}>
            {v === 'yearly' ? 'By year' : 'This season'}
          </button>
        ))}
      </div>
      <div className="chart-box" style={{ height: 270 }}>
        <ResponsiveContainer width="100%" height="100%">
          {view === 'yearly' ? (
            <ComposedChart data={trends.yearly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde3ee" />
              <XAxis dataKey="year" tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} unit="L" />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar yAxisId="left" dataKey="placed" name="Students placed" fill="#2b59e0" radius={[4, 4, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="avgPackage" name="Avg package (LPA)" stroke="#c77d00" strokeWidth={2.5} dot={{ r: 3 }} />
            </ComposedChart>
          ) : (
            <BarChart data={trends.monthly} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde3ee" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar dataKey="offers" name="Offers made" fill="#14804f" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
