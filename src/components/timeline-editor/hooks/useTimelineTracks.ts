import { useContext } from 'react';
import { TimelineTracksContext } from '@/components/timeline-editor/context/tracks';
import { useMemoizedFn } from 'ahooks';
import { TrackElement } from '@/components/timeline-editor/type';

export const useTimelineElementsContext = () => {
  return useContext(TimelineTracksContext);
};

export function useTimelineElements2dController() {
  const { tracks, setTracks } = useTimelineElementsContext();

  const onUpdateElement = useMemoizedFn((data: { id: string } & Partial<TrackElement>) => {
    setTracks((prev) => {
      return prev.map((track) => {
        return {
          ...track,
          elements: track.elements.map((element) => {
            if (element.id === data.id) {
              return {
                ...element,
                ...data,
              };
            }
            return element;
          }),
        };
      });
    });
  });

  return {
    tracks,
    setTracks,

    onUpdateElement,
    onUpdatedElement: onUpdateElement,
  };
}
