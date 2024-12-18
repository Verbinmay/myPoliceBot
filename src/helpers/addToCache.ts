export const addToCache = async (set: Set<number>, userId: number) => {
  set.add(userId);

  setTimeout(async () => {
    set.delete(userId);
  }, 2000);
};
