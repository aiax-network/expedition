import {
  AppBar,
  CssBaseline,
  Toolbar,
  Typography,
  IconButton,
  Grid,
  InputBase,
  Tooltip,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/styles";
import Link from "@material-ui/core/Link";
import React, {
  Dispatch,
  ChangeEvent,
  KeyboardEvent,
  useState,
  useEffect,
} from "react";
import { Link as RouterLink, Router, Route, Switch } from "react-router-dom";
import useDarkMode from "use-dark-mode";
import "./App.css";
import "./main.css";
import Address from "./containers/Address";
import Block from "./containers/Block";
import Dashboard from "./containers/Dashboard";
import NodeView from "./containers/NodeView";
import Transaction from "./containers/Transaction";
import { darkTheme, lightTheme } from "./themes/jadeTheme";
import useInterval from "use-interval";
import ETHJSONSpec from "@etclabscore/ethereum-json-rpc-specification/openrpc.json";
import { useTranslation } from "react-i18next";
import { createBrowserHistory } from "history";
import ChainDropdown from "./components/ChainDropdown/ChainDropdown";
import {
  StringParam,
  QueryParamProvider,
  useQueryParams,
} from "use-query-params";
import { createPreserveQueryHistory } from "./helpers/createPreserveHistory";
import BlockRawContainer from "./containers/BlockRawContainer";
import TransactionRawContainer from "./containers/TransactionRawContainer";
import MinerStatsPage from "./containers/MinerStatsPage";
import { IChain as Chain } from "./models/chain";
import useChainListStore from "./stores/useChainListStore";
import useEthRPCStore from "./stores/useEthRPCStore";
import AiaxHeader from "./components/AiaxHeader/AiaxHeader";
import { NetworkWifi } from "@material-ui/icons";

const history = createPreserveQueryHistory(createBrowserHistory, [
  "network",
  "rpcUrl",
])();

function App(props: any) {
  const { t } = useTranslation();
  const darkMode = useDarkMode();
  const [search, setSearch] = useState();
  const [faucetAddress, setFaucetAddress] = useState();
  const theme = darkMode.value ? darkTheme : lightTheme;

  const [selectedChain, setSelectedChain] = useState<Chain>();
  const [chains, setChains] = useChainListStore<[Chain[], Dispatch<Chain[]>]>();
  const [ethRPC, setEthRPCChain] = useEthRPCStore();

  // default the selectedChain once chain list loads
  useEffect(() => {
    if (selectedChain !== undefined) {
      return;
    }
    if (chains === undefined) {
      return;
    }
    if (chains.length === 0) {
      return;
    }
    if (query.rpcUrl) {
      return;
    }

    setSelectedChain(chains[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chains, selectedChain]);

  const [query, setQuery] = useQueryParams({
    network: StringParam,
    rpcUrl: StringParam,
  });

  // when url param is used to pick network,
  // keep things updated once chains list is loaded
  useEffect(() => {
    if (!chains || chains.length === 0) {
      return;
    }
    if (query.rpcUrl) {
      return;
    }

    if (query.network && selectedChain !== undefined) {
      if (query.network === selectedChain.name) {
        return;
      }
    }

    if (chains && query.network) {
      const foundChain = chains.find(
        (chain: Chain) => chain.name === query.network
      );
      setSelectedChain(foundChain);
    } else {
      setSelectedChain(chains[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chains, query.network]);

  // keeps the window.location in sync with selected network
  useEffect(() => {
    if (selectedChain === undefined) {
      return;
    }
    const { name } = selectedChain as Chain;

    if (name !== query.network) {
      setQuery({ network: name });
      history.push({
        pathname: history.location.pathname,
        search: `?network=${name}`,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChain, setQuery]);

  // keep selected chain in sync with the current ethrpc instance
  useEffect(() => {
    if (selectedChain !== undefined) {
      setEthRPCChain(selectedChain);
    }
  }, [selectedChain, setEthRPCChain]);

  React.useEffect(() => {
    if (ethRPC) {
      ethRPC.startBatch();
    }
  }, [ethRPC]);

  useInterval(
    () => {
      if (ethRPC) {
        ethRPC.stopBatch();
        ethRPC.startBatch();
      }
    },
    100,
    true
  );

  const isAddress = (q: string): boolean => {
    const re = new RegExp(ETHJSONSpec.components.schemas.Address.pattern);
    return re.test(q);
  };

  const isKeccakHash = (q: string): boolean => {
    const re = new RegExp(ETHJSONSpec.components.schemas.Keccak.pattern);
    return re.test(q);
  };

  const isBlockNumber = (q: string): boolean => {
    const re = new RegExp(/^-{0,1}\d+$/);
    return re.test(q);
  };

  const handleSearch = async (qry: string | undefined) => {
    if (qry === undefined) {
      return;
    }
    const q = qry.trim();
    if (isAddress(q)) {
      history.push(`/address/${q}`);
    }
    if (isKeccakHash(q)) {
      let transaction;

      try {
        transaction = await ethRPC.eth_getTransactionByHash(q);
      } catch (e) {
        // do nothing
      }

      if (transaction) {
        history.push(`/tx/${q}`);
      }
      let block;
      try {
        block = await ethRPC.eth_getBlockByHash(q, false);
      } catch (e) {
        // do nothing
      }
      if (block) {
        history.push(`/block/${q}`);
      }
    }
    if (isBlockNumber(q)) {
      const block = await ethRPC.eth_getBlockByNumber(
        `0x${parseInt(q, 10).toString(16)}`,
        false
      );
      if (block) {
        history.push(`/block/${block.hash}`);
      }
    }
  };

  const requestFaucet = (address: string | undefined) => {
    if (address === undefined) {
      return;
    }
    const q = address.trim();
    if (isAddress(q)) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      fetch('https://test-rpc.aiax.network/faucet/give/?address=' + q, requestOptions)
        .then(async response => {
          const data = await response.json();
          if (response.ok) {
            console.log('Success faucet, transaction: ' + data.transaction);
            alert('Test coins successfully sent to the address ' + q + '\n\nTransaction: ' + data.transaction);
          } else {
            console.error('Error faucet, details: ' + JSON.stringify(data));
            switch (response.status) {
              case 503: alert('Reached faucet limit, please try later'); break;
              case 400: alert('Invalid address provided'); break;
              default: alert('An error occurred during request to faucet');
            }
          }
        })
        .catch(error => {
          console.error('Fetch error', error);
        });
    }
  };

  return (
    <Router history={history}>
      <ThemeProvider theme={theme}>
        <AppBar position="sticky" color="default" elevation={0} className="site-header">
          <Toolbar style={{ width: "100%", padding: 0, minHeight: "80px" }}>
            <AiaxHeader />
          </Toolbar>
        </AppBar>
        {/* Below main explorer content */}
        <div className="site-content">
          <QueryParamProvider ReactRouterRoute={Route}>
            <CssBaseline />
            {selectedChain ? (
              <ChainDropdown
                chains={chains}
                onChange={setSelectedChain}
                selected={selectedChain}
                buttonStyle={{marginTop: "-50px"}}
              />
            ) : (
              <>
                {query && query.rpcUrl && (
                  <Tooltip title={query.rpcUrl}>
                    <IconButton >
                      <NetworkWifi />
                    </IconButton>
                  </Tooltip>
                )}
                {!query.rpcUrl && <CircularProgress />}
              </>
            )}
            <Grid container className="section" justify="space-between" spacing={2}>
              <Grid item xs={6} className="search">
                <InputBase
                  placeholder={t(
                    "Enter an Address, Transaction Hash or Block Number"
                  )}
                  onKeyDown={(event: KeyboardEvent<HTMLInputElement>) => {
                    if (event.keyCode === 13) {
                      handleSearch(search);
                    }
                  }}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value) {
                      const { value } = event.target;
                      setSearch(value as any);
                    }
                  }}
                  className={"textfield"}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} className="faucet">
                <InputBase
                  placeholder="Enter an address to get test coins"
                  className={"textfield"}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    if (event.target.value) {
                      const { value } = event.target;
                      setFaucetAddress(value as any);
                    }
                  }}
                />
                <Button
                  color="primary"
                  variant="outlined"
                  size="small"
                  onClick={() => requestFaucet(faucetAddress)}
                >Get Coins</Button>
              </Grid>
            </Grid>
            <Switch>
              <Route path={"/"} component={Dashboard} exact={true} />
              <Route
                path={"/stats/miners"}
                component={MinerStatsPage}
                exact={true}
              />
              <Route path={"/stats/miners/:block"} component={MinerStatsPage} />
              <Route path={"/block/:hash/raw"} component={BlockRawContainer} />
              <Route path={"/block/:hash"} component={Block} />
              <Route path={"/blocks/:number"} component={NodeView} />
              <Route
                path={"/tx/:hash/raw"}
                component={TransactionRawContainer}
              />
              <Route path={"/tx/:hash"} component={Transaction} />
              <Route path={"/address/:address/:block"} component={Address} />
              <Route path={"/address/:address"} component={Address} />
            </Switch>
          </QueryParamProvider>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
