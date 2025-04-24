import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Toast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      toastClassName="!bg-white dark:!bg-neutral-900 !text-emerald-900 dark:!text-emerald-100 !border !border-emerald-200 dark:!border-emerald-800 !rounded-lg !shadow-lg"
      progressClassName="!bg-emerald-500"
      closeButton={false}
    />
  );
}
