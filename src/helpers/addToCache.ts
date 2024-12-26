export const addToCache = async (
  set: Set<any>,
  data: any,
  time: number = 2000
) => {
  try {
    set.add(data);

    setTimeout(async () => {
      set.delete(data);
    }, time);
  } catch (e) {
    console.log(e);
  }
};
