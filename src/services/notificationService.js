import { toast } from 'react-toastify';

function init() {
  toast.configure();
}

export default {
  init,
  info: toast.info,
  warn: toast.warn,
  error: toast.error,
  success: toast.success
};
