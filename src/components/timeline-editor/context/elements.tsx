import { createContext, FC, ReactNode, useState } from 'react';
import { TrackElement } from '@/components/timeline-editor/type';

interface TimelineElementsContextProps {
  elements2d: TrackElement[][];
  setElements2d: (elements2d: TrackElement[][]) => void;
}

export const TimelineElementsContext = createContext<TimelineElementsContextProps>({
  elements2d: [],
  setElements2d: () => {},
});

export const TimelineElementsContextProvider: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;

  const [elements2d, setElements2d] = useState<TrackElement[][]>([]);

  const contextProps: TimelineElementsContextProps = {
    elements2d: elements2d,
    setElements2d: setElements2d,
  };

  return (
    <TimelineElementsContext.Provider value={contextProps}>
      {children}
    </TimelineElementsContext.Provider>
  );
};
