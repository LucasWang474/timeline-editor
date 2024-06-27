import React, { FC, useMemo } from 'react';
import { css, cx } from '@emotion/css';
import {
  pixelPerSecond,
  TimelinePaddingLeft,
  totalDuration,
} from '@/components/timeline-editor/const';
import { TimelineTimeContextProvider } from '@/components/timeline-editor/context/time';
import { TimelinePointer } from '@/components/timeline-editor/components/timeline-pointer';
import { TimelineAxis } from '@/components/timeline-editor/components/timeline-axis';

interface TimelineEditorProps {
  className?: string;
}

export const TimelineEditor: FC<TimelineEditorProps> = (props) => {
  const { className } = props;

  const cls = useStyles();

  return (
    <TimelineTimeContextProvider>
      <div className={cx(cls.wrap, className)}>
        <div className={cls.inner}>
          <TimelineAxis className={cls.timelineAxis} />
          <TimelinePointer />
        </div>
      </div>
    </TimelineTimeContextProvider>
  );
};

function useStyles() {
  return useMemo(() => {
    return {
      wrap: css({
        position: 'relative',

        display: 'flex',
        alignItems: 'center',

        background: '#fff',
        width: '100vw',
        height: '100vh',
        minHeight: '500px',
        minWidth: totalDuration * pixelPerSecond + TimelinePaddingLeft,
        padding: '0 48px',
      }),
      inner: css({
        overflow: 'hidden',
        position: 'relative',

        // minHeight: '400px',
        height: 400,
        padding: `22px 0 0 ${TimelinePaddingLeft}px`,

        flex: 1,
        display: 'flex',
        flexDirection: 'column',

        borderTop: '1px solid var(--line)',
        boxShadow: 'var(--boxShadow2)',
      }),

      timelineAxis: css({
        position: 'absolute',
        top: 4,
        left: TimelinePaddingLeft,
        width: '100%',
      }),
    };
  }, []);
}
