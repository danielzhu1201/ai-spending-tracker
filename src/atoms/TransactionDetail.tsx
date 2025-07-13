import styles from "./TransactionDetail.module.css";

interface TransactionDetailProps {
  icon: React.ReactNode;
  merchant: string;
  date: string;
  amount: number;
  type: string; //TODO: update as an enum
}

const TransactionDetail = ({
  icon,
  merchant,
  amount,
  type,
}: TransactionDetailProps) => {
  return (
    <div className={styles.TransactionDetailContainer}>
      <div className={styles.LeftContainer}>
        <div>{icon}</div>
        <div className={styles.TextContainer}>
          <div>{merchant}</div>
          <div>{type}</div>
        </div>
      </div>

      <div>
        {amount.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}
      </div>
    </div>
  );
};

export default TransactionDetail;
