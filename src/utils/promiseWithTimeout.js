export default function promiseWithTimeOut(value, milliSeconds = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, milliSeconds);
  });
}
