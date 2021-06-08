import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Button from '../Button';
import { useTranslation } from '@polkadot/pages/components/translate';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import CoinInfoList from '@polkadot/pages/components/Header/CoinInfoList';

interface EndpointProps {
  className?: string;
}

export interface CoinItem {
  name: string;
  matchingNode: string;
  CoinIcon: string;
  whiteIcon: string;
}

function Endpoints({className = ''}: EndpointProps): React.ReactElement<EndpointProps> {
  const [isEndpoints, setIsEndpoints] = useState<boolean>(false);
  const {t} = useTranslation();
  const {currentCoinType, currentNetwork} = useContext(NetWorkContext)

  const _toggleEndpoints = (): void => setIsEndpoints(true);

  const coinList: CoinItem[] = currentNetwork.name ==='Alaya' ? [
    {
      name: `KSM`,
      matchingNode: 'wss://supercube.pro',
      CoinIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/10/57/9c680d8b-3eab-45b5-9cbe-4c4f9dd1d870.svg',
      whiteIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/06/0ba15d9b-95c7-49b4-bda3-67ae2461e90e.svg'
    },
    // {
    //   name: `XBTC`,
    //   matchingNode: 'wss://chainx.supercube.pro/ws',
    //   CoinIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/10/57/3c14ff90-3900-4a8a-9ae5-13923df6f118.svg',
    //   whiteIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/06/a17d958b-e182-48d0-b090-1bb1e19ce4cf.svg'
    // },
  ]: [
    {
      name: `DOT`,
      matchingNode: 'wss://dot.supercube.pro',
      CoinIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/10/57/5a3086a0-6ca5-4bc0-bbe4-8bbb2ffaad76.svg',
      whiteIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/06/d3b55f7e-0679-480b-8f2c-ba90beb8d18b.svg'
    },
    // {
    //   name: `XBTC`,
    //   matchingNode: 'wss://chainx.supercube.pro/ws',
    //   CoinIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/10/57/3c14ff90-3900-4a8a-9ae5-13923df6f118.svg',
    //   whiteIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/06/a17d958b-e182-48d0-b090-1bb1e19ce4cf.svg'
    // },
  ];

  return (
    <div className={`isBasic ${className}`}>
      <div className='coinInfo'>
        <div className="leftIcon">
          <img src={currentCoinType.whiteIcon} alt={currentCoinType.coinName}/>
        </div>
        <div className="rightCon">
          <div className="title">{t('The current currency')}</div>
          <p className="tabEndpoints">{currentCoinType.coinName}</p>
        </div>
      </div>

      <Button className="ui-tabEndpoint" isBasic label={t('Switch currency')} onClick={_toggleEndpoints}/>
      {isEndpoints && (
        <CoinInfoList setIsOpen={setIsEndpoints} list={coinList}/>
      )}
    </div>
  );
}

export default React.memo(styled(Endpoints)`
  min-width: 308px;
  height: 152px;
  color: #ffffff;
  background: transparent;
  border-radius: 10px;
  border: none;
  padding: 20px 0 0 22px;
  margin: 0 0 0 20px;

  &.isBasic {
    display: flex;
    flex-direction: column;
    .coinInfo{
      display: flex;
      .rightCon {
        display: flex;
        flex-direction: column;
        margin-left: 22px;
        .title {
          font-size: 16px;
          margin-bottom: 6px;
        }
        .tabEndpoints {
          font-size: 20px;
          margin-bottom: 20px;
        }
      }
    }
  }

  .ui-tabEndpoint {
    padding: 8px 16px;
    min-height: 36px;
    border: 1px solid #ffffff;
    border-radius: 4px;
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #ffffff;
    margin: 0 auto;
    transform: translateX(-22%);
  }

  &.blueCard {
    background-image: linear-gradient(-45deg, #45b2ea 0%, #2394ce 100%);
  }
`);
