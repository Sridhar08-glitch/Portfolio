"use client";

export function PanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-adminLine pb-4">
      <div>
        <h2 className="font-display text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-adminMuted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
