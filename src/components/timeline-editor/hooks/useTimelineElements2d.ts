import { useContext } from 'react';
import { TimelineElementsContext } from '@/components/timeline-editor/context/elements';

export const useTimelineElementsContext = () => {
  return useContext(TimelineElementsContext);
};
