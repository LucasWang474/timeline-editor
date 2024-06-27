import { RefObject, useState } from 'react';
import { useMemoizedFn } from 'ahooks';
import { pixelPerSecond, totalDuration } from '@/components/timeline-editor/const';
import { useTimelineTimeContext } from '@/components/timeline-editor/hooks/useTimelineTimeContext';

export function useTimelineSeekAndDrag(refContainer: RefObject<HTMLElement>) {
  const { setTime } = useTimelineTimeContext();

  const [moving, setMoving] = useState(false);

  const onTimelineClick = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scrollX = window.scrollX;
    const actualXToLeftSideOfContainer = e.pageX - rect.x - scrollX;

    let newTime = actualXToLeftSideOfContainer / pixelPerSecond;
    newTime = Math.max(0, Math.min(totalDuration, newTime));
    setTime(newTime);
  });

  const onMouseMove = useMemoizedFn((e: MouseEvent) => {
    const container = refContainer.current;
    if (!container) return;

    setMoving(true);
    const rect = container.getBoundingClientRect();
    const scrollX = window.scrollX;
    const actualXToLeftSideOfContainer = e.pageX - rect.x - scrollX;

    let newTime = actualXToLeftSideOfContainer / pixelPerSecond;
    newTime = Math.max(0, Math.min(totalDuration, newTime));
    setTime(newTime);
  });
  const onMouseUp = useMemoizedFn(() => {
    setMoving(false);

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  });

  const onClick = useMemoizedFn((e: React.MouseEvent<HTMLDivElement>) => {
    onTimelineClick(e);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  return {
    moving,
    onTimelineClick: onClick,
  };
}
