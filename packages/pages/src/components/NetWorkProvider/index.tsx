import React, { createContext, FC, useEffect, useState } from 'react';
import { saveAndReload } from '@polkadot/pages/components/ToolTipConfig/components/Cell/Cell';
import uiSettings from '@polkadot/ui-settings';

export interface NetWorkProviderData {
  currentNetwork: NetWorkInfo;
  setCurrentNetwork: React.Dispatch<NetWorkInfo>;
  platonUnit: string;
  platonNet: PlatonNet;
  currentCoinType: CoinInfo;
  setCurrentCoinType: React.Dispatch<CoinInfo>;
}

export interface NetWorkInfo {
  name: string;
  polkadotNetUrl: string;
  platonNetUrl: string;
}

export interface CoinInfo {
  coinName: string;
  whiteIcon: string;
  matchingNode: string;
}

export interface PlatonNet {
  name: string;
  url: string;
}

export const NetWorkContext = createContext<NetWorkProviderData>({} as NetWorkProviderData);

export const NetWorkProvider: FC = ({children}) => {
  const [currentNetwork, setCurrentNetwork] = useState<NetWorkInfo>({} as NetWorkInfo);
  const [currentCoinType, setCurrentCoinType] = useState<CoinInfo>({} as CoinInfo);
  const polkadotSetting = JSON.parse(window.localStorage.getItem('settings')!);
  const [platonUnit, setPlatonUnit] = useState<string>('AKSM');
  const [platonNet, setPlatonNet] = useState({} as PlatonNet);

  //@ts-ignore
  if (typeof window.alaya !== 'undefined') {
    //@ts-ignore
    alaya.on('chainChanged', (chainId: string) => {
      if(Number(chainId) === 201018){
        saveAndReload({...uiSettings.get(), apiUrl: 'wss://kusama.elara.patract.io'});
      }else if(Number(chainId) === 100){
        saveAndReload({...uiSettings.get(), apiUrl: 'wss://rpc.polkadot.io'});
      }
    });
  }

  useEffect(() => {
    //@ts-ignore
    if(window.alaya){
      if (Number(window.alaya.chainId) === 201018) {
        setPlatonNet({
          name: 'Alaya',
          url: 'ws://chainx.alaya.network'
        });
        //@ts-ignore
      } else if (Number(window.alaya.chainId) === 100) {
        setPlatonNet({
          name: 'PlatON',
          url: 'ws://chainx.platon.network'
        });
      }
    }
  }, [window.alaya]);

  useEffect(() => {
    if (polkadotSetting.apiUrl === 'wss://kusama.elara.patract.io') {
      setCurrentNetwork({
        name: 'Alaya',
        polkadotNetUrl: polkadotSetting.apiUrl,
        platonNetUrl: 'https://platonnet.chainx.org/',
      });
      setCurrentCoinType({
        coinName: 'KSM',
        whiteIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/20/05/efe804ac-ab52-4b31-826c-1abb967464ef.svg',
        matchingNode: 'wss://kusama.elara.patract.io'
      });
    } else if (polkadotSetting.apiUrl === 'wss://rpc.polkadot.io') {
      setCurrentNetwork({
        name: 'PlatON',
        polkadotNetUrl: polkadotSetting.apiUrl,
        platonNetUrl: '',
      });
      setCurrentCoinType({
        coinName: 'DOT',
        whiteIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/20/04/47fc37c2-b813-42c4-9236-86c6e882dbe3.svg',
        matchingNode: 'wss://rpc.polkadot.io'
      });
    } else if (polkadotSetting.apiUrl === 'wss://chainx.supercube.pro/ws') {
      setCurrentCoinType({
        coinName: 'XBTC',
        whiteIcon: 'https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/20/04/baf49e67-d072-4004-a51b-9d7d6447267c.svg',
        matchingNode: 'wss://chainx.supercube.pro/ws'
      });
      setCurrentNetwork({
        name: platonNet.name,
        platonNetUrl: platonNet.url,
        polkadotNetUrl: polkadotSetting.apiUrl
      });
    }
  }, [polkadotSetting.apiUrl, platonNet.name]);

  useEffect(() => {
    if (currentNetwork.name === 'Alaya') {
      setPlatonUnit('AKSM');
      if (currentCoinType.coinName === 'XBTC') {
        setPlatonUnit('ABTC');
      }
    } else if (currentNetwork.name === 'PlatON') {
      setPlatonUnit('PDOT');
      if (currentCoinType.coinName === 'XBTC') {
        setPlatonUnit('PBTC');
      }
    }

  }, [currentNetwork.name, currentCoinType.coinName]);

  return (
    <NetWorkContext.Provider value={{
      currentNetwork,
      setCurrentNetwork,
      platonUnit,
      platonNet,
      currentCoinType,
      setCurrentCoinType
    }}>
      {children}
    </NetWorkContext.Provider>
  );
};
