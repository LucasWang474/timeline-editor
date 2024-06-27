export type TrackElement<T extends Record<string, never> = Record<string, never>> = {
  id: string;
  start: number;
  duration: number;

  type: 'color';
  meta?: T;
};

export type TimelineAreaData = {
  elements2d: TrackElement[][];
};
