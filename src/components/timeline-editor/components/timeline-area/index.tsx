import type { FC } from 'react';
import { css, cx } from '@emotion/css';

interface TimelineAreaProps {
  children?: React.ReactNode;
  className?: string;
}

export const TimelineArea: FC<TimelineAreaProps> = (props) => {
  const { className } = props;
  const cls = useStyles();

  return <div className={cx(cls.wrap, className)}>TimelineArea</div>;
};

function useStyles() {
  return {
    wrap: css({}),
  };
}
