import * as React from "react";
import { Grid } from "@material-ui/core";
import Link from "@material-ui/core/Link";
import aiaxLogo from "../../logo.svg";
import { Link as RouterLink } from "react-router-dom";
import { useHistory, useLocation } from "react-router-dom";

function AiaxHeader() {
  const [showMenu, setShowMenu] = React.useState(false);
  const location = useLocation();
  const history = useHistory();
  return (
    <Grid
      justify="space-between"
      alignItems="flex-start"
      alignContent="flex-start"
      container
    >
      <Grid item>
        <Link
          component={({
            className,
            children,
          }: {
            children: any;
            className: string;
          }) => (
            <RouterLink className={className} to={"/"}>
              {children}
            </RouterLink>
          )}
        >
          <Grid container>
            <Grid>
              <img
                alt="aiax-logo"
                width="170"
                height="32"
                style={{ marginRight: "10px" }}
                src={aiaxLogo}
              />
            </Grid>
          </Grid>
        </Link>
      </Grid>
      <button className="nav-toggler" onClick={() => setShowMenu(!showMenu)}>
        <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="40" height="40" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="currentColor"><rect x="3" y="11" width="18" height="2" rx=".95" ry=".95"/><rect x="3" y="16" width="18" height="2" rx=".95" ry=".95"/><rect x="3" y="6" width="18" height="2" rx=".95" ry=".95"/></g></svg>
      </button>
      <div className={`menu ${showMenu ? 'open' : ''}`}>
        <ul>
            {/* <li><a href="https://aiax-network.medium.com/">Technology</a></li>
            <li><a href="/">Use AIAX</a></li>
            <li><a href="/">Bridge</a></li> 
            <li><a href="https://aiax.exchange/">AIAX DEX</a></li> */}
            <li className={`${location.pathname === '/' ? 'active' : ''}`}><a onClick={() => history.push("/")}>Explorer</a></li>
            <li className={`${location.pathname === '/stats/miners' ? 'active' : ''}`}><a onClick={() => history.push("/stats/miners")}>Stats</a></li>
            <li><a href="https://aiax-network.medium.com/">Blog</a></li>
            <li><a href="/">Community</a></li>
        </ul>
      </div>
    </Grid>
  );
}
export default AiaxHeader;
