import type { FC } from 'react';
import { css, cx } from '@emotion/css';
import { useTimelineElements2dController } from '@/components/timeline-editor/hooks/useTimelineTracks';
import { pixelPerSecond } from '@/components/timeline-editor/const';

interface TimelineAreaProps {
  children?: React.ReactNode;
  className?: string;
}

export const TimelineArea: FC<TimelineAreaProps> = (props) => {
  const { className } = props;
  const cls = useStyles();

  const { tracks } = useTimelineElements2dController();

  return (
    <div className={cx(cls.wrap, className)}>
      {tracks.map((track) => {
        const { elements, id } = track;
        return (
          <div key={id}>
            {elements.map((element) => {
              return (
                <div
                  key={element.id}
                  style={{
                    background: element.color,
                    width: element.duration * pixelPerSecond,
                    height: 20,
                  }}
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
    wrap: css({}),
  };
}
