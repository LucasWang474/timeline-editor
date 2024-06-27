import classNames from 'classnames';
import type { FC } from 'react';
import { TimelineAxis } from './timeline-axis';
import './index.css';

interface TimelineEditorProps {
  children?: React.ReactNode;
  className?: string;
}

export const TimelineEditor: FC<TimelineEditorProps> = (props) => {
  const { className } = props;

  return (
    <div className={classNames('wrap', className)}>
      <div className="inner">
        <TimelineAxis />
      </div>
    </div>
  );
};
