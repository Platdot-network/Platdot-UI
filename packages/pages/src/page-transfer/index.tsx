// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, { useContext } from 'react';
import styled from 'styled-components';
import {  Records } from '@polkadot/pages/components';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';
import { PolkadotAccountsContext } from '@polkadot/pages/components/PolkadotAccountsProvider';
import EmptyCard from '../components/PdotCards/EmptyCard';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { useTranslation } from '../components/translate';
import Card from '@polkadot/pages/components/Card/Card';
import CardContent from '@polkadot/pages/page-transfer/CardContent';

interface Props {
  className?: string;
}

export default function TransferContent({className= ''}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {hasPlatonAccount, Transfers} = useContext(PlatonAccountsContext);
  const {hasAccounts} = useContext(PolkadotAccountsContext);
  const transferLength = Transfers.length;
  const {platonUnit} = useContext(NetWorkContext);

  return (
    <Wrapper className={`contentWrapper ${className}`}>
      {hasPlatonAccount && hasAccounts ?
        <Card className="left" title={`${platonUnit} ${t('Transfer')}`}>
          <CardContent/>
        </Card>
        : <EmptyCard title={`${platonUnit? platonUnit: ''} ${t('Transfer')}`}/>
      }
      <Records className="right" title={t('Transfer record')} records={Transfers} recordLength={transferLength}
               arrows={false}/>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  .left{
    width: 636px;
  }
  .right{
    width: 308px;
  }
`;
