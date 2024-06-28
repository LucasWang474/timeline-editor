import type { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useTimelineElements2dController } from '@/components/timeline-editor/hooks/useTimelineTracks';
import { TimelineTrackElement } from '@/components/timeline-editor/components/timeline-track-element';
import { useElementDrag } from '@/components/timeline-editor/hooks/useElementDrag';
import { totalDuration } from '@/components/timeline-editor/const';

interface TimelineAreaProps {
  className?: string;
}

export const TimelineArea: FC<TimelineAreaProps> = (props) => {
  const { className } = props;
  const cls = useStyles();

  const { onUpdatedElement } = useTimelineElements2dController();

  const { tracks } = useTimelineElements2dController();
  const { onMouseLeave, onMouseEnter, onMouseDown } = useElementDrag({
    onTimeUpdate: ({ result }) => {
      if (!result.length) return;
      onUpdatedElement(result[0]);
    },
    onTimeUpdated: ({ result }) => {
      if (!result.length) return;
      onUpdatedElement(result[0]);
    },
    getDragLimit: () => {
      return {
        limitStart: 0,
        limitEnd: totalDuration,
        minDuration: 1,
        maxDuration: totalDuration,
      };
    },
  });

  return (
    <div className={cx(cls.wrap, className)}>
      {tracks.map((track) => {
        const { elements, id } = track;
        return (
          <div key={id}>
            {elements.map((element) => {
              return (
                <TimelineTrackElement
                  key={element.id}
                  data={element}
                  onMouseDown={onMouseDown}
                  onMouseEnter={onMouseEnter}
                  onMouseLeave={onMouseLeave}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

function useStyles() {
  return {
    wrap: css({
      position: 'relative',
    }),
  };
}
