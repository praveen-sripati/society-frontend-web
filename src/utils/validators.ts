import { FormInstance } from 'antd';
import dayjs from 'dayjs';

interface ValidationFunctions {
  getFieldValue: FormInstance['getFieldValue'];
}

export const validators = {
  validateDepartureTime: ({ getFieldValue }: ValidationFunctions) => ({
    validator: (_: any, value: dayjs.Dayjs | null) => {
      const arrivalTime = getFieldValue('arrival_time');
      if (!arrivalTime || !value) {
        return Promise.resolve();
      }
  
      if (value.isAfter(arrivalTime)) {
        return Promise.resolve();
      }
      return Promise.reject(new Error('Departure time must be after arrival time!'));
    },
  }),
}