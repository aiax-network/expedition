import { CircularProgress } from "@material-ui/core";
import * as React from "react";
import TxView from "../components/TxView";
import useEthRPCStore from "../stores/useEthRPCStore";
import {
  Transaction as ITransaction,
  TransactionReceiptOrNull as ITransactionReceipt,
} from "@etclabscore/ethereum-json-rpc";

export default function TransactionContainer(props: any) {
  const hash = props.match.params.hash;
  const [erpc] = useEthRPCStore();
  const [transaction, setTransaction] = React.useState<ITransaction>();
  const [receipt, setReceipt] = React.useState<ITransactionReceipt>();

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_getTransactionByHash(hash).then((tx) => {
      if (tx === null) { return; }
      setTransaction(tx);
    }, (reject) => {
      console.warn(reject[0]);
      if (reject[0].name === "ParameterValidationError") {
        alert('Invalid transaction hash');
      }
      props.history.push("/");
    });
  }, [hash, erpc, props.history]);

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_getTransactionReceipt(hash).then((r) => {
      if (r === null) { return; }
      setReceipt(r);
    }, (reject) => {
      console.warn(reject[0]);
      if (reject[0].name === "ParameterValidationError") {
        alert('Invalid transaction hash');
      }
      props.history.push("/");
    });
  }, [hash, erpc, props.history]);

  if (!transaction || !receipt) {
    return (<CircularProgress />);
  }

  return (<TxView tx={transaction} receipt={receipt} />);
}
