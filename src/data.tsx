export type Data = {
  id: number;
  uuid: number;
  date: string;
};

export const makeData = (rows: number = 1000): Data[] => {
  return new Array(rows).fill(undefined).map((_, idx) => ({
    id: idx + 1,
    uuid: Math.random() * 100000000,
    date: new Date().toLocaleString(),
  }));
};
