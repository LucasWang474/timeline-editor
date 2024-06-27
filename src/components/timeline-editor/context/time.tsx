import { createContext, FC, ReactNode, useState } from 'react';
import { TimelineDefaultTime } from '@/components/timeline-editor/const';

interface TimelineTimeContextProps {
  time: number;
  setTime: (time: number) => void;
}

export const TimelineTimeContext = createContext<TimelineTimeContextProps>({
  time: TimelineDefaultTime,
  setTime: () => {},
});

export const TimelineTimeContextProvider: FC<{ children: ReactNode }> = (props) => {
  const { children } = props;

  const [time, setTime] = useState(TimelineDefaultTime);

  const contextProps: TimelineTimeContextProps = {
    time: time,
    setTime: setTime,
  };

  return (
    <TimelineTimeContext.Provider value={contextProps}>{children}</TimelineTimeContext.Provider>
  );
};
