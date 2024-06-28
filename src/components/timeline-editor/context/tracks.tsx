import { createContext, FC, ReactNode, useState } from 'react';
import { TimelineTrack } from '@/components/timeline-editor/type';

interface TimelineTracksContextProps {
  tracks: TimelineTrack[];
  setTracks: React.Dispatch<React.SetStateAction<TimelineTrack[]>>;
}

export const TimelineTracksContext = createContext<TimelineTracksContextProps>({
  tracks: [],
  setTracks: () => {},
});

export const TimelineTracksContextProvider: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;

  const [tracks, setTracks] = useState<TimelineTrack[]>([
    {
      id: '1',
      elements: [
        {
          id: 'ele1',
          color: 'pink',
          start: 5,
          duration: 10,
          type: 'color',
        },
      ],
    },
  ]);

  const contextProps: TimelineTracksContextProps = {
    tracks: tracks,
    setTracks: setTracks,
  };

  return (
    <TimelineTracksContext.Provider value={contextProps}>{children}</TimelineTracksContext.Provider>
  );
};
