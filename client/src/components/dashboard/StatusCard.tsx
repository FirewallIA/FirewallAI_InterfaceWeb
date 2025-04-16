import React from 'react';

interface StatusCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconColor: string;
  statusBadge?: {
    text: string;
    color: string;
  };
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconColor,
  statusBadge
}) => {
  return (
    <div className="bg-[#11131a] border border-[#1a1d25] rounded-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-400">{title}</h3>
        {statusBadge && (
          <span className={`bg-${statusBadge.color}-500/20 text-${statusBadge.color}-400 text-xs px-2 py-1 rounded-full`}>
            {statusBadge.text}
          </span>
        )}
      </div>
      <div className="flex items-center">
        <i className={`${icon} text-${iconColor}-500 text-3xl mr-3`}></i>
        <div>
          <p className="text-2xl font-bold text-white">{value}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusCard;
