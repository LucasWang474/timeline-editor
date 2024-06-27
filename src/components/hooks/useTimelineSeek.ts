import { RefObject, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import {
  pixelPerSecond,
  TimelinePaddingLeft,
  totalDuration,
} from '@/components/timeline-editor/const';
import { useTimelineTimeContext } from '@/components/context/time';

export function useTimelineSeekAndDrag(refContainer: RefObject<HTMLElement>) {
  const { setTime } = useTimelineTimeContext();

  const [moving, setMoving] = useState(false);

  const onTimelineClick = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    const dom = e.currentTarget;
    if (!dom) return;

    const rect = dom.getBoundingClientRect();
    const x = e.pageX - rect.x - TimelinePaddingLeft;
    let time = x / pixelPerSecond;
    time = Math.max(0, Math.min(totalDuration, time));
    setTime(time);
  });

  const onMove = useMemoizedFn((e: MouseEvent) => {
    const dom = refContainer.current;
    if (!dom) return;

    setMoving(true);
    const rect = dom.getBoundingClientRect();
    const x = e.pageX - rect.x - TimelinePaddingLeft;
    let time = x / pixelPerSecond;
    time = Math.max(0, Math.min(totalDuration, time));
    setTime(time);
  });
  const onUp = useMemoizedFn(() => {
    setMoving(false);
    document.removeEventListener('mousemove', onMove);
    document.removeEventListener('mouseup', onUp);
  });

  const onClick = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    console.log('>>> e', e);
    onTimelineClick(e);

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  return {
    moving,
    onTimelineClick: onClick,
  };
}
