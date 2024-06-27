import { useContext } from 'react';
import { TimelineTimeContext } from '@/components/timeline-editor/context/time';

export const useTimelineTimeContext = () => {
  return useContext(TimelineTimeContext);
};
