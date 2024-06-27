import { FC, useMemo, useRef } from 'react';
import { formatSeconds } from '@/utils/time';
import { css, cx } from '@emotion/css';
import { pixelPerSecond } from '@/components/timeline-editor/const';
import { transitions } from 'polished';
import { useSize } from 'ahooks';
import { useTimelineSeekAndDrag } from '@/components/hooks/useTimelineSeek';

type LineItem = {
  time: number;
  bold?: boolean;
};

interface TimelineAxisProps {
  className?: string;
}

export const TimelineAxis: FC<TimelineAxisProps> = (props) => {
  const { className } = props;

  const cls = useStyles();

  const refContainer = useRef<HTMLDivElement>(null);
  const size = useSize(refContainer);
  const totalWidth = size?.width ?? 0;

  const { onTimelineClick } = useTimelineSeekAndDrag(refContainer);

  const boldStep = 5; // 5s
  const lines: LineItem[] = useMemo(() => {
    const res: LineItem[] = [];

    let curSeconds = 0;
    while (curSeconds * pixelPerSecond <= totalWidth) {
      res.push({
        time: curSeconds,
        bold: curSeconds % boldStep === 0,
      });
      curSeconds++;
    }

    return res;
  }, [totalWidth]);

  return (
    <div ref={refContainer} className={cx(cls.wrap, className)} onMouseDown={onTimelineClick}>
      <div className={cls.linesWrap}>
        {lines.map((line) => {
          return (
            <div
              key={line.time}
              className={cx(cls.line, { [cls.bold]: line.bold })}
              data-time={line.bold ? formatSeconds(line.time) : void 0}
              style={{ transform: `translateX(${line.time * pixelPerSecond}px)` }}
            />
          );
        })}
      </div>
    </div>
  );
};

function useStyles() {
  return useMemo(() => {
    return {
      wrap: css({
        cursor: 'pointer',
      }),
      linesWrap: css({
        position: 'relative',
        height: 16,
      }),
      line: css({
        position: 'absolute',
        left: 0,
        zIndex: 1,
        top: '50%',
        width: 1,
        height: 4,
        marginTop: -2,
        background: 'var(--textDisabled)',

        ...transitions(['transform'], '0.1s ease'),

        '&::after': {
          content: 'attr(data-time)',
          position: 'absolute',
          left: 4,
          top: -9,
          fontSize: 20,
          transform: 'scale(0.5)',
          transformOrigin: 'left center',
          color: 'var(--textSupport)',
        },
      }),
      bold: css({
        background: 'var(--textSupport)',
        height: '12px',
        marginTop: -6,
      }),
    };
  }, []);
}
