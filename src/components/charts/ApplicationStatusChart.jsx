import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { STATUSES, STATUS_COLORS } from '../../utils/constants';

export default function ApplicationStatusChart({ applications }) {
  const data = STATUSES.map((s) => ({
    name: s,
    value: applications.filter((a) => a.status === s).length,
  })).filter((d) => d.value > 0);

  if (!data.length) return <p className="muted">Apply to a job to see your status split here.</p>;

  return (
    <div className="chart-box" style={{ height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={90} paddingAngle={2}>
            {data.map((d) => (
              <Cell key={d.name} fill={STATUS_COLORS[d.name]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
