type UndoableNotificationProps = {
  message: string;
  cancelMutation?: () => void;
  closeToast?: () => void;
};

export const UndoableNotification: React.FC<UndoableNotificationProps> = ({
  closeToast,
  cancelMutation,
  message,
}) => {
  return (
    <div>
      <p>{message}</p>
      <button
        type="button"
        onClick={() => {
          cancelMutation?.();
          closeToast?.();
        }}
      >
        Undo
      </button>
    </div>
  );
};
