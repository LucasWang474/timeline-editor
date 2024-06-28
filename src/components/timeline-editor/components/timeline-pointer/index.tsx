import { FC, useMemo } from 'react';
import { stopEvent } from '@/utils/event';
import { css, cx } from '@emotion/css';
import { pixelPerSecond, TimelinePaddingLeft } from '@/components/timeline-editor/const';
import { useTimelineTimeContext } from '@/components/timeline-editor/hooks/useTimelineTime';

const HeadSVGWidth = 10;
const LineWidth = 2;
// to make the pointer line center in the svg
const LineLeft = Math.trunc((HeadSVGWidth - LineWidth) / 2);
const LineColor = '#FFA217';

interface TimelinePointerProps {
  className?: string;
}

export const TimelinePointer: FC<TimelinePointerProps> = (props) => {
  const { className } = props;

  const cls = useStyles();

  const { time } = useTimelineTimeContext();

  // For how the pointer is moving, see useTimelineSeek.ts
  return (
    <div
      className={cx(cls.wrap, className)}
      style={{
        transform: `translateX(${time * pixelPerSecond + (TimelinePaddingLeft - LineLeft)}px)`,
      }}
    >
      <div onMouseDown={stopEvent} className={cls.svgWrap}>
        <div>
          <svg
            width="10"
            height="22"
            viewBox="0 0 10 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.5 1C0.5 0.723858 0.723858 0.5 1 0.5H9C9.27614 0.5 9.5 0.723858 9.5 1V7C9.5 9.48528 7.48528 11.5 5 11.5C2.51472 11.5 0.5 9.48528 0.5 7V1Z"
              fill="#FFAA00"
              stroke="url(#paint0_linear_13909_45340)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_13909_45340"
                x1="5"
                y1="0"
                x2="5"
                y2="12"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#F38620" />
                <stop offset="0.578125" stopColor="#FFAA00" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </div>
  );
};

function useStyles() {
  return useMemo(() => {
    return {
      wrap: css({
        zIndex: 9,
        position: 'absolute',
        left: 0,
        top: 0,

        width: 0,
        height: '100%',
        userSelect: 'none',
        pointerEvents: 'none',

        '&::after': {
          content: '""',
          position: 'absolute',
          top: 10,
          left: LineLeft,

          pointerEvents: 'none',

          width: LineWidth,
          height: `calc(100% - 10px)`,
          backgroundColor: LineColor,
        },
      }),
      svgWrap: css({
        width: 10,
        position: 'relative',
      }),
    };
  }, []);
}
