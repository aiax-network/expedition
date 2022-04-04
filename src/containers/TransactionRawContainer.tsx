import { CircularProgress, Typography } from "@material-ui/core";
import * as React from "react";
import useEthRPCStore from "../stores/useEthRPCStore";
import TxRaw from "../components/TxRaw/TxRaw";
import {
  Transaction as ITransaction,
  TransactionReceiptOrNull as ITransactionReceipt,
} from "@etclabscore/ethereum-json-rpc";
import { useTranslation } from "react-i18next";

export default function TransactionRawContainer(props: any) {
  const hash = props.match.params.hash;
  const [erpc] = useEthRPCStore();
  const [transaction, setTransaction] = React.useState<ITransaction | null>();
  const [receipt, setReceipt] = React.useState<ITransactionReceipt>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_getTransactionByHash(hash).then((tx) => {
      setTransaction(tx);
    });
  }, [hash, erpc]);

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_getTransactionReceipt(hash).then((r) => {
      if (r === null) { return; }
      setReceipt(r);
    });
  }, [hash, erpc]);

  if (transaction === undefined || !receipt) { return (<CircularProgress />); }
  if (transaction === null) { return (<Typography>{t("Transaction not found")}</Typography>); }

  return (<TxRaw tx={transaction} receipt={receipt} />);
}
