import React from "react";

export default function StatsBar({ patients }) {
  const total = patients.length;

  const atRisk = patients.filter(
    (p) => p.glucose >= 126 || p.haemoglobin < 12 || p.cholesterol >= 240
  ).length;

  const borderline = patients.filter(
    (p) =>
      (p.glucose >= 100 && p.glucose < 126) ||
      (p.cholesterol >= 200 && p.cholesterol < 240)
  ).length;

  const normal = total - atRisk - borderline;

  const stats = [
    { label: "Total Patients", value: total, cls: "stat-total", icon: "👥" },
    { label: "Normal", value: Math.max(0, normal), cls: "stat-normal", icon: "✅" },
    { label: "Borderline", value: borderline, cls: "stat-warn", icon: "⚠️" },
    { label: "At Risk", value: atRisk, cls: "stat-danger", icon: "🚨" },
  ];

  return (
    <div className="stats-bar">
      {stats.map((s) => (
        <div key={s.label} className={`stat-card ${s.cls}`}>
          <span className="stat-emoji">{s.icon}</span>
          <div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
