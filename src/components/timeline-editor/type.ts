export type BaseTrackElement = {
  id: string;
  start: number;
  duration: number;
};

export type ColorTrackElement = BaseTrackElement & {
  type: 'color';
  color: string;
};

export type TrackElement = ColorTrackElement;

export type TimelineAreaData = {
  tracks: TimelineTrack[];
};

export type TimelineTrack = {
  id: string;
  elements: TrackElement[];
};
