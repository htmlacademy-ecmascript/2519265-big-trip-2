import dayjs from 'dayjs';
import {MINUTES_IN_HOUR} from './const.js';
import {MINUTES_IN_DAY} from './const.js';

export const getRundomArrayElement = (items) => items[Math.floor(Math.random() * items.length)];

export default function humanizeDueDay(dueDay, DAY_FORMAT) {
  return dueDay ? dayjs(dueDay).format(DAY_FORMAT) : '';
}

export function differentTime(dateStart, dateEnd) {
  return dayjs(dateEnd).diff(dayjs(dateStart), 'minute');
}

export function getTotalTime(date) {
  let minutes = '';
  let hours = '';
  let days = '';

  if(date > MINUTES_IN_DAY) {
    days = Math.floor(date / MINUTES_IN_DAY);
  }
  if(date > MINUTES_IN_DAY) {
    hours = Math.floor(date / MINUTES_IN_HOUR);
  }
  if(date > MINUTES_IN_HOUR) {
    minutes = date - (Math.floor(date / MINUTES_IN_HOUR) * MINUTES_IN_HOUR);
  }
  return (`${days > 0 ? ` ${days}D` : ''} ${hours > 0 ? ` ${hours}H` : ''} ${minutes > 0 ? ` ${minutes}m` : ''}`);
}

