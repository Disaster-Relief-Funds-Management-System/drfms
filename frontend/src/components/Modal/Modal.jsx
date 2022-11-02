import styles from "./Modal.module.css";

const Card = ({ className, children }) => {
  return <div className={`${styles["card"]} ${className}`}>{children}</div>;
};

const Button = ({ type, onClick, children, autoFocus }) => {
  return (
    <button
      className={styles["button"]}
      type={type || "button"}
      onClick={onClick}
      autoFocus={autoFocus}
    >
      {children}
    </button>
  );
};

const Backdrop = ({ dismissModalHandler }) => {
  return <div className={styles["backdrop"]} onClick={dismissModalHandler} />;
};

const ModalOverlay = ({ title, message, dismissModalHandler }) => {
  return (
    <Card className={styles["modal"]}>
      <header className={styles["header"]}>
        <h2>{title}</h2>
      </header>
      <div className={styles["content"]}>
        <p>{message}</p>
      </div>
      <footer className={styles["actions"]}>
        <Button onClick={dismissModalHandler} autoFocus={true}>
          Dismiss
        </Button>
      </footer>
    </Card>
  );
};

const Modal = ({ dismissModal, title, message }) => {
  const dismissHandler = () => {
    dismissModal(undefined);
  };
  return (
    <>
      <Backdrop dismissModalHandler={dismissHandler} />

      <ModalOverlay
        title={title}
        message={message}
        dismissModalHandler={dismissHandler}
      />
    </>
  );
};

export default Modal;
