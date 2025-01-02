import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Data } from "./data";

const ROW_HEIGHT_PX = 40;

const getPageSize = (height?: number) => {
  return height ? Math.abs(Math.floor(height / ROW_HEIGHT_PX) - 1) : 10;
};

const useScrollPosition = (
  dataLength: number,
  pageSize: number
): [number, Dispatch<SetStateAction<number>>] => {
  const [scrollPosition, _setScrollPosition] = useState(0);
  const setScrollPosition: Dispatch<SetStateAction<number>> = useCallback(
    (prevState) => {
      _setScrollPosition((pos) => {
        let position;
        if (typeof prevState === "function") {
          position = prevState(pos);
        } else {
          position = prevState;
        }
        if (position < 0) return 0;
        if (position >= dataLength - pageSize) return dataLength - pageSize;
        return position;
      });
    },
    [dataLength, pageSize]
  );

  return [scrollPosition, setScrollPosition] as const;
};

export const Table = ({ data }: { data: Data[] }) => {
  const tableRef = useRef<HTMLTableSectionElement | null>(null);
  const [pageSize, setPageSize] = useState(() =>
    getPageSize(tableRef.current?.clientHeight)
  );

  const updateCount = useCallback(() => {
    setPageSize(getPageSize(window.innerHeight));
  }, []);

  const [scrollPosition, setScrollPosition] = useScrollPosition(
    data.length,
    pageSize
  );

  useEffect(() => {
    setPageSize(getPageSize(window.innerHeight));
    window.addEventListener("resize", updateCount);
    return () => window.removeEventListener("resize", updateCount);
  }, [updateCount]);

  const visibleRows = useMemo(() => {
    console.log(`from: ${scrollPosition} to: ${pageSize}`);
    return data.slice(scrollPosition, pageSize + scrollPosition);
  }, [scrollPosition, pageSize, data]);

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    console.debug(e);
    console.log(e.deltaY);

    setScrollPosition((pos) => pos + e.deltaY);
  };

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTableSectionElement>) => {
      if (event.key === " ") {
        console.log("firedd");
        setScrollPosition((pos) =>
          event.shiftKey ? pos - pageSize : pos + pageSize
        );
      } else if (event.key === "ArrowUp") {
        console.log("firedd");
        setScrollPosition((pos) => pos - 1);
      } else if (event.key === "ArrowDown") {
        console.log("firedd");
        setScrollPosition((pos) => pos + 1);
      } else if (event.key === "PageUp") {
        console.log("firedd");
        setScrollPosition((pos) => pos - pageSize);
      } else if (event.key === "PageDown") {
        console.log("firedd");
        setScrollPosition((pos) => pos + pageSize);
      }
    },
    [pageSize, setScrollPosition]
  );

  return (
    <div className="overflow-hidden h-[100dvh] w-[dvw] overscroll-none">
      <table className="table bg-yellow-200 h-[100dvh] w-full">
        <thead>
          <tr className="h-10">
            <th>#</th>
            <th>UUID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody
          ref={tableRef}
          className="flex flex-col h-[calc(100lvh-2.rem)] w-full"
          onWheel={handleWheel}
          onKeyDown={handleKeyDown}
          tabIndex={-1}
        >
          {visibleRows.map(({ id, uuid, date }) => {
            return (
              <tr
                key={String(id)}
                className="h-10 w-full border-b border-amber-700"
              >
                <td className="font-bold">{id}</td>
                <td>{uuid}</td>
                <td>{date}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
