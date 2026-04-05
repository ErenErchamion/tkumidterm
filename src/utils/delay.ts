export const delay = (ms = 450): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const withDelay = <T>(data: T, ms = 500): Promise<T> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(data), ms);
  });
