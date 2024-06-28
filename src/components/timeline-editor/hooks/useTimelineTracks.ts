import { useContext } from 'react';
import { TimelineTracksContext } from '@/components/timeline-editor/context/tracks';

export const useTimelineElementsContext = () => {
  return useContext(TimelineTracksContext);
};

export function useTimelineElements2dController() {
  const { tracks, setTracks } = useTimelineElementsContext();

  return {
    tracks,
    setTracks,
  };
}
