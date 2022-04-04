import { CircularProgress, Typography } from "@material-ui/core";
import useEthRPCStore from "../stores/useEthRPCStore";
import * as React from "react";
import BlockRaw from "../components/BlockRaw";
import { Block as IBlock } from "@etclabscore/ethereum-json-rpc";
import { useTranslation } from "react-i18next";

export default function BlockRawContainer(props: any) {
  const { match: { params: { hash } } } = props;
  const [erpc] = useEthRPCStore();
  const [block, setBlock] = React.useState<IBlock | null>();
  const { t } = useTranslation();

  React.useEffect(() => {
    if (!erpc) { return; }
    erpc.eth_getBlockByHash(hash, true).then((b) => {
      setBlock(b);
    }, (reject) => {
      console.warn(reject[0]);
      if (reject[0].name === "ParameterValidationError") {
        alert('Invalid block hash');
      }
      props.history.push("/");
    });
  }, [hash, erpc, props.history]);

  if (block === undefined) { return (<CircularProgress />); }
  if (block === null) { return (<Typography>{t("Block not found")}</Typography>); }
  return (<BlockRaw block={block} />);
}
