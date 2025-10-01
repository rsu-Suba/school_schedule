import type { GASArrayType } from "@/scripts/Data/type";

const CACHE_KEY = 'scheduleCache';
const CACHE_DURATION_HOURS = 6;
const CACHE_DURATION_MS = CACHE_DURATION_HOURS * 60 * 60 * 1000;

interface ScheduleCache {
  data: GASArrayType;
  lastUpdated: string;
  expiry: number;
}

export const getScheduleCache = (): ScheduleCache | null => {
  const cachedItem = localStorage.getItem(CACHE_KEY);
  if (!cachedItem) {
    return null;
  }

  try {
    const cache: ScheduleCache = JSON.parse(cachedItem);
    if (new Date().getTime() > cache.expiry) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return cache;
  } catch (error) {
    console.error('Error parsing schedule cache:', error);
    return null;
  }
};

export const setScheduleCache = (data: any): void => {
  const now = new Date();
  const expiry = now.getTime() + CACHE_DURATION_MS;

  const cache: ScheduleCache = {
    data: data,
    lastUpdated: now.toISOString(),
    expiry: expiry,
  };

  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error('Error saving schedule cache:', error);
  }
};

export const clearScheduleCache = (): void => {
  localStorage.removeItem(CACHE_KEY);
};
