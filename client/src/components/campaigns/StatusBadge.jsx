import React from 'react';
import Badge from '../common/Badge';

const StatusBadge = ({ status = 'draft', size = 'md' }) => {
  const normalized = status.toLowerCase();

  const labels = {
    active: 'Active',
    draft: 'Draft',
    paused: 'Paused',
    completed: 'Completed'
  };

  return (
    <Badge variant={normalized} size={size}>
      {labels[normalized] || status}
    </Badge>
  );
};

export default StatusBadge;
