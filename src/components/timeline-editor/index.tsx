import { FC, useMemo } from 'react';
import { TimelineAxis } from './timeline-axis';
import { TimelinePointer } from '@/components/timeline-editor/time-pointer';
import { css, cx } from '@emotion/css';
import { TimelinePaddingLeft } from '@/components/timeline-editor/const';

interface TimelineEditorProps {
  className?: string;
}

export const TimelineEditor: FC<TimelineEditorProps> = (props) => {
  const { className } = props;

  const cls = useStyles();

  return (
    <div className={cx(cls.wrap, className)}>
      <div className={cls.inner}>
        <TimelineAxis />
        <TimelinePointer />
      </div>
    </div>
  );
};

function useStyles() {
  return useMemo(() => {
    return {
      wrap: css({
        position: 'relative',

        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',

        background: '#fff',
        width: '100vw',
        minWidth: '720px',
        height: '100vh',
        minHeight: '500px',
      }),
      inner: css({
        overflow: 'hidden',
        position: 'relative',

        minHeight: '400px',
        margin: '0 48px',
        padding: `6px ${TimelinePaddingLeft}px 0 24px`,

        flex: 1,
        display: 'flex',
        flexDirection: 'column',

        borderTop: '1px solid var(--line)',
        boxShadow: 'var(--boxShadow2)',
      }),
    };
  }, []);
}
