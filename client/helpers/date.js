/**
 * calculateTimeLeft
 * @param {Date} from
 */
export const calculateTimeLeft = (from) => {
  const timeleft = from.getTime() - Date.now();

  // const days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
  // const hours = Math.floor(
  //   (timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  // );
  // const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
  // const seconds = Math.floor((timeleft % (1000 * 60)) / 1000);

  // return `${days} d ${hours} h ${minutes} min ${seconds} s`;
  return timeleft;
};
