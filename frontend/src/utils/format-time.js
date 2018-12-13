import moment from 'moment';

export const formatToDay = time => {
  return moment(time).format('dddd, Do, MMMM YYYY'); // "Sunday, February 14th 2010, 3:25:50 pm"
};
