import { CircularProgress } from "@material-ui/core";
import useEthRPCStore from "../stores/useEthRPCStore";
import * as React from "react";
import BlockView from "../components/BlockView";
import { Block as IBlock } from "@etclabscore/ethereum-json-rpc";

export default function Block(props: any) {
  const { match: { params: { hash } } } = props;
  const [block, setBlock] = React.useState<IBlock>();
  const [erpc] = useEthRPCStore();

  React.useEffect(() => {
    if (erpc === undefined) { return; }
    erpc.eth_getBlockByHash(hash, true).then((b) => {
      if (b === null) { return; }
      setBlock(b);
    }, (reject) => {
      console.warn(reject[0]);
      if (reject[0].name === "ParameterValidationError") {
        alert('Invalid block hash');
      }
      props.history.push("/");
    });
  }, [hash, erpc, props.history]);

  if (!block) { return (<CircularProgress />); }
  return (<BlockView block={block} />);
}
