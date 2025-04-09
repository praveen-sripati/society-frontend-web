import dayjs from 'dayjs';

export const dateTimeUtils = {
  disabledPreviousDate: (current: dayjs.Dayjs) => {
    // Can not select days before today
    return current && current < dayjs().startOf('day');
  },
};