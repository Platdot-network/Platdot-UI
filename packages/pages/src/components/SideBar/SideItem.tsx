import React from "react";
import { NavLink } from "react-router-dom";
import { NodeItem } from "./index";
interface Props {
  node: NodeItem;
  pathname: string;
}

function SideItem({ node, pathname }: Props): React.ReactElement<Props> {

  return (
    <li className={`navItem ${pathname.toString() === node.link ? "statusRisk" : ""}`}>
      <NavLink to={node.link} exact activeClassName="selected">
        {pathname.toString() === node.link ? <>{node.icon_after}</> : <>{node.icon}</>}
        <span>{node.nodeName}</span>
      </NavLink>
    </li>
  );
}

export default SideItem;
