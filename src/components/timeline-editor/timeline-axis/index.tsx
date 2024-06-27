import classNames from 'classnames';
import { FC, useMemo } from 'react';
import { formatSeconds } from '@/utils/time';
import { css } from '@emotion/css';

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

  const totalTime = 40; // 10s
  const boldStep = 5; // 5s
  const lines: LineItem[] = useMemo(() => {
    const res: LineItem[] = [];

    let curTime = 0;
    while (curTime <= totalTime) {
      res.push({
        time: curTime,
        bold: curTime % boldStep === 0,
      });
      curTime++;
    }

    return res;
  }, []);

  return (
    <div className={classNames(cls.wrap, className)}>
      <div className={cls.linesWrap}>
        {lines.map((line) => {
          return (
            <div
              key={line.time}
              className={classNames(cls.line, { [cls.bold]: line.bold })}
              data-time={line.bold ? formatSeconds(line.time) : void 0}
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
        width: '98%',
      }),
      linesWrap: css({
        width: '100%',
        minWidth: '600px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        cursor: 'pointer',
      }),
      line: css({
        height: '4px',
        width: '1px',
        background: 'var(--textDisabled)',
        position: 'relative',
        fontSize: '12px',
        '&::after': {
          content: 'attr(data-time)',
          position: 'absolute',
          left: '4px',
          top: '-9px',
          fontSize: '20px',
          transform: 'scale(0.5)',
          transformOrigin: 'left center',
          color: 'var(--textSupport)',
        },
      }),
      bold: css({
        background: 'var(--textSupport)',
        height: '12px',
      }),
    };
  }, []);
}
