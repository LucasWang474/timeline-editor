import { useMemoizedFn, useSetState } from 'ahooks';
import { useMemo, useRef, useState } from 'react';
import { TrackElement } from '@/components/timeline-editor/type';
import { ElementDragType } from '@/components/timeline-editor/components/timeline-track-element';
import { pixelPerSecond } from '@/components/timeline-editor/const';

const defaultDragModeData = {
  left: false,
  right: false,
  move: false,
};

const getValidValueWithinRange = (num: number, range: [number, number]) => {
  const [min, max] = range;
  return Math.min(max, Math.max(min, num));
};

const mergeTime = (
  offset: { start: number; duration: number },
  current: { start: number; duration: number },
) => {
  return {
    start: offset.start + current.start,
    duration: offset.duration + current.duration,
  };
};

type DragResult = {
  id: string;
  start: number;
  duration: number;
};

export function useElementDrag<T extends ElementDragType>(props: {
  onTimeUpdate?: (params: { type: T; result: DragResult[] }) => void;
  onTimeUpdated?: (params: { type: T; result: DragResult[] }) => void;

  getDragLimit: () => {
    limitStart: number;
    limitEnd: number;

    minDuration: number;
    maxDuration: number;
  };
}) {
  const { onTimeUpdate, onTimeUpdated, getDragLimit } = props;

  // The start x when mouse down event triggered
  const refStartX = useRef(0);
  const refElements = useRef<TrackElement[]>([]);

  const [dragResult, setDragResult] = useState<{ id: string; start: number; duration: number }[]>(
    [],
  );
  const [dragModeData, setDragModeData] = useState(defaultDragModeData);
  const [eventMoving, setEventMoving] = useState(false);
  const [dragHover, setDragHover] = useSetState({
    left: false,
    right: false,
  });

  const isDragging = useMemo(() => {
    return dragModeData.left || dragModeData.right;
  }, [dragModeData.left, dragModeData.right]);
  const isMoving = useMemo(() => {
    return dragModeData.move && eventMoving;
  }, [dragModeData.move, eventMoving]);

  const dragType = useMemo(() => {
    const active = (Object.keys(dragModeData) as T[]).filter((key) => dragModeData[key]);
    return active[0] || null;
  }, [dragModeData]);

  const getAbsoluteLimit = useMemoizedFn((params: { start: number; duration: number }) => {
    const { start, duration } = params;

    const { limitEnd, limitStart, minDuration, maxDuration } = getDragLimit();
    if (dragType === 'move') {
      return {
        start: {
          min: limitStart,
          max: limitEnd - duration,
        },
        duration: {
          // this one is unused in move mode, just to keep the same data structure
          min: minDuration,
          max: maxDuration,
        },
      };
    } else if (dragType === 'left') {
      return {
        start: {
          // "start + duration - maxDuration" is used to prevent the element's new
          // duration from exceeding the maxDuration
          min: Math.max(limitStart, start + duration - maxDuration),

          // if "start + duration", then the element will become zero width
          // add a minDuration to prevent this
          max: start + duration - minDuration,
        },
        duration: {
          min: minDuration,
          max: maxDuration,
        },
      };
    } else if (dragType === 'right') {
      return {
        start: {
          // This is not used in right mode, just to keep the same data structure
          min: limitStart,
          max: Infinity,
        },
        duration: {
          min: minDuration,

          // limitEnd - start is used to prevent the element's new end time from exceeding the limitEnd
          max: Math.min(maxDuration, limitEnd - start),
        },
      };
    } else {
      // This should not happen
      // Just to keep the same data structure
      return {
        start: {
          min: limitStart,
          max: Infinity,
        },
        duration: {
          min: minDuration,
          max: maxDuration,
        },
      };
    }
  });

  const getOffsetLimit = useMemoizedFn((params: { start: number; duration: number }) => {
    const { start, duration } = params;
    const limit = getAbsoluteLimit(params);
    return {
      start: {
        min: limit.start.min - start,
        max: limit.start.max - start,
      },
      duration: {
        min: limit.duration.min - duration,
        max: limit.duration.max - duration,
      },
    };
  });

  const onMouseEnter = useMemoizedFn((type: T) => {
    setDragHover({ [type]: true } as never);
  });

  const onMouseLeave = useMemoizedFn((type: T) => {
    setDragHover({ [type]: false } as never);
  });

  const handlerDragMove = useMemoizedFn((e: MouseEvent) => {
    if (!dragType) return;

    setEventMoving(true);
    const movedX = e.pageX - refStartX.current;
    const seconds = movedX / pixelPerSecond;

    const result: { id: string; start: number; duration: number }[] = [];
    refElements.current.forEach((element) => {
      const { start, duration } = element;
      const offset = {
        start: 0,
        duration: 0,
      };
      const offsetLimit = getOffsetLimit({ start, duration });
      if (dragType === 'left') {
        // left: start >= min & <= (duration-minDuration)
        const startSecondsChanged = getValidValueWithinRange(seconds, [
          offsetLimit.start.min,
          offsetLimit.start.max,
        ]);
        // startSecondsChanged < 0 means the element's start time becomes smaller while the duration becomes larger
        offset.start = startSecondsChanged;
        offset.duration = -startSecondsChanged;
      } else if (dragType === 'right') {
        // right: duration limit
        offset.duration = getValidValueWithinRange(seconds, [
          offsetLimit.duration.min,
          offsetLimit.duration.max,
        ]);
      } else if (dragType === 'move') {
        // move: start not limit
        offset.start = getValidValueWithinRange(seconds, [
          offsetLimit.start.min,
          offsetLimit.start.max,
        ]);
      }

      const merged = mergeTime(offset, { start, duration });
      result.push({
        id: element.id,
        ...merged,
      });
    });
    setDragResult(result);
    onTimeUpdate?.({ type: dragType, result: result });
  });

  const handlerDragEnd = useMemoizedFn(() => {
    onTimeUpdated?.({ result: dragResult, type: dragType! });

    setDragModeData(defaultDragModeData);
    setDragResult([]);
    setEventMoving(false);
    refStartX.current = 0;

    document.removeEventListener('mousemove', handlerDragMove);
    document.removeEventListener('mouseup', handlerDragEnd);
  });

  const onMouseDown = useMemoizedFn((type: T, element: TrackElement, event: React.MouseEvent) => {
    // prevent right click, 0: left, 1: middle, 2: right
    if (event.button !== 0) return;

    refElements.current = [element];
    refStartX.current = event.pageX;
    setDragResult([]);
    setDragModeData({ ...defaultDragModeData, [type]: true } as never);

    document.addEventListener('mousemove', handlerDragMove);
    document.addEventListener('mouseup', handlerDragEnd);
  });

  return {
    dragging: dragModeData,
    isDragging,
    isMoving,
    dragHover,
    dragType,
    dragResult,
    onMouseEnter,
    onMouseLeave,
    onMouseDown,
  };
}
