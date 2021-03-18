// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from "react";
import styled from "styled-components";
// import { useTranslation } from '../translate';

import PdotCard from "@polkadot/react-components-chainx/PdotCards/PdotCard";
import { Records } from "@polkadot/react-components-chainx/Records";

interface Props {
  className?: string;
}

export default function RedeemContent({ className }: Props): React.ReactElement<Props> {
  //   const { t } = useTranslation();

  return (

    <Wrapper className={`contentWrapper ${className}`}>
        <PdotCard className = "left" title="赎回 PDOT" component="RedeemCard" isBasic/>
        <Records className = "right" title="赎回记录" />
      </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0rem 7rem 2.5rem 3rem;
  width: 97.1%;
  padding-right: 50px;
  .left{
    width: 636px;
  }
  .right{
    width: 308px;
  }
`;
