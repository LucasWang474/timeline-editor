import { FC, useRef } from 'react';
import { css, cx } from '@emotion/css';
import type { TrackElement } from '@/components/timeline-editor/type';
import { pixelPerSecond } from '@/components/timeline-editor/const';
import { useHover, useMemoizedFn } from 'ahooks';
import { stopEvent } from '@/utils/event';

export type ElementDragType = 'left' | 'right' | 'move';

interface TimelineTrackElementProps {
  className?: string;
  data: TrackElement;
  onMouseEnter?: (type: ElementDragType, e: React.MouseEvent) => void;
  onMouseLeave?: (type: ElementDragType, e: React.MouseEvent) => void;
  onMouseDown?: (type: ElementDragType, element: TrackElement, e: React.MouseEvent) => void;
}

export const TimelineTrackElement: FC<TimelineTrackElementProps> = (props) => {
  const { className, data, onMouseEnter, onMouseLeave, onMouseDown } = props;
  const cls = useStyles();

  const refContainer = useRef<HTMLDivElement | null>(null);
  const isHover = useHover(refContainer);

  const renderDraggable = useMemoizedFn((type: ElementDragType) => {
    return (
      <div
        className={cx(cls.drag, cls.hide, {
          [cls.visible]: isHover,
          [cls.dragLeft]: type === 'left',
          [cls.dragRight]: type === 'right',
        })}
        onMouseEnter={(e) => onMouseEnter?.(type, e)}
        onMouseLeave={(e) => onMouseLeave?.(type, e)}
        onMouseDown={(e) => {
          stopEvent(e);
          onMouseDown?.(type, data, e);
        }}
      />
    );
  });

  return (
    <div
      className={cx(cls.wrap, className)}
      style={{
        background: data.color,
        width: data.duration * pixelPerSecond,
        transform: `translateX(${data.start * pixelPerSecond}px)`,
      }}
      ref={refContainer}
      onMouseDown={(e) => {
        onMouseDown?.('move', data, e);
      }}
    >
      {renderDraggable('left')}
      {renderDraggable('right')}
    </div>
  );
};

function useStyles() {
  return {
    wrap: css({
      position: 'absolute',
      left: 0,
      top: 0,

      height: 28,
      background: 'var(--orangeLighter)',
      // ...transitions(['width', 'transform'], 'ease 0.1s'),

      borderRadius: 6,
    }),

    drag: css({
      position: 'absolute',
      zIndex: 3,
      top: 0,

      width: 10,
      height: '100%',

      userSelect: 'none',
      cursor: 'ew-resize',

      '&::after': {
        content: '""',

        position: 'absolute',
        zIndex: 2,
        top: '50%',
        left: '50%',

        width: 2,
        height: 8,
        marginLeft: -1,
        marginTop: -4,
        backgroundColor: 'var(--orange)',
        borderRadius: 1,
      },
    }),

    dragLeft: css({
      left: 0,
    }),
    dragRight: css({
      right: 0,
    }),

    hide: css({
      opacity: 0,
      visibility: 'hidden',
    }),
    visible: css({
      opacity: 1,
      visibility: 'visible',
    }),
  };
}
