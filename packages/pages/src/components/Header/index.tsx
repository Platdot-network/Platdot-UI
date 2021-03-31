import React, {useContext} from 'react';
import styled from 'styled-components';
import Network from './icons/network.svg';
import Endpoints from './Endpoints';
import PolkadotAccount from './PolkadotAccount';
import PlatonAccount from './PlatonAccount';
import {NetWorkContext} from '../NetWorkProvider';
import { useTranslation } from '@polkadot/pages/components/translate';

interface Props {
  className?: string;
}

function Header({className}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {netWork} = useContext(NetWorkContext)

  return (
    <div className={className}>
      <h2>{t('Welcome to Platdot!')}</h2>
      <div className="cardListWrapper">
        <PolkadotAccount/>
        <PlatonAccount/>
        <Endpoints className="blueCard" iconNode={Network} title={t('The current network')} content={netWork.name} btnLabel={t('Switch network')}/>
      </div>
    </div>
  );
}

export default React.memo(styled(Header)`
  flex-grow: 1;
  overflow: hidden auto;
  padding: 2.5rem 0 1rem 0;
  width: 100%;

  h2 {
    font-size: 32px;
    font-weight: bold;
    color: #444c5e;
    line-height: 48px;
  }

  .cardListWrapper {
    display: inline-flex;
    width: 100%;
    padding: 20px 0;
  }
`);
