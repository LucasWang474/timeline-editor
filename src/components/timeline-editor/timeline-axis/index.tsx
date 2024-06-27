import classNames from 'classnames';
import { FC, useMemo } from 'react';
import './index.css';
import { formatSeconds } from '@/utils/time';

type LineItem = {
  time: number;
  bold?: boolean;
};

interface TimelineAxisProps {
  children?: React.ReactNode;
  className?: string;
}

export const TimelineAxis: FC<TimelineAxisProps> = (props) => {
  const { className } = props;

  const totalTime = 10; // 10s
  const boldStep = 10; // 5s
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

  console.log('>>> formatSeconds', formatSeconds);

  return (
    <div className={classNames('wrap', className)}>
      <div></div>

      <div className="linesWrap">
        {lines.map((line) => {
          return (
            <div
              key={line.time}
              className={classNames('line', { bold: line.bold })}
              data-time={line.bold ? formatSeconds(line.time) : void 0}
            />
          );
        })}
      </div>
    </div>
  );
};
