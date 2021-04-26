import React, { createContext, FC, useEffect, useState } from 'react';

export interface NetWorkProviderData {
  netWork: NetWorkInfo;
  setNetWork: React.Dispatch<NetWorkInfo>;
  localNet: NetWorkInfo
  platonUnit: string;
  netName: string;
  localCoin: CoinInfo;
  setCoin: React.Dispatch<CoinInfo>;
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

export const NetWorkContext = createContext<NetWorkProviderData>({} as NetWorkProviderData);

export const NetWorkProvider: FC = ({children}) => {
  const defaultNet: NetWorkInfo = JSON.parse(window.localStorage.getItem('netWork') || '{}');
  const defaultCoin: CoinInfo = JSON.parse(window.localStorage.getItem('coinInfo') || '{}');
  const [localNet, setLocalNet] = useState<NetWorkInfo>({
    name: defaultNet.name,
    polkadotNetUrl: defaultNet.polkadotNetUrl,
    platonNetUrl: defaultNet.platonNetUrl,
  });
  const [localCoin, setLocalCoin] = useState<CoinInfo>({
    coinName: defaultCoin.coinName,
    whiteIcon: defaultCoin.whiteIcon,
    matchingNode: defaultCoin.matchingNode,
  });
  const polkadotSetting = JSON.parse(window.localStorage.getItem('settings')!);
  const [platonUnit, setPlatonUnit] = useState('AKSM');
  const [netName, setNetName] = useState('Alaya');
  const [coin, setCoin] = useState<CoinInfo>({
    coinName: localCoin.coinName,
    whiteIcon: localCoin.whiteIcon,
    matchingNode: localCoin.matchingNode
  });
  const [netWork, setNetWork] = useState<NetWorkInfo>({
    name: localNet.name,
    polkadotNetUrl: localNet.polkadotNetUrl,
    platonNetUrl: localNet.platonNetUrl,
  });

  useEffect(() => {
    if (polkadotSetting.apiUrl === 'wss://supercube.pro/ws') {
      setNetWork({
        name: 'Alaya',
        polkadotNetUrl: polkadotSetting.apiUrl,
        platonNetUrl: 'https://platonnet.chainx.org/',
      });
      setCoin({
        coinName: 'KSM',
        whiteIcon: 'http://lc-XLoqMObG.cn-n1.lcfile.com/7f0b4956f9dd593c01ef.svg',
        matchingNode: 'wss://supercube.pro/ws'
      });
    } else if (polkadotSetting.apiUrl === 'wss://polkadot.elara.patract.io') {
      setNetWork({
        name: 'PlatON',
        polkadotNetUrl: polkadotSetting.apiUrl,
        platonNetUrl: '',
      });
      setCoin({
        coinName: 'DOT',
        whiteIcon: 'http://lc-XLoqMObG.cn-n1.lcfile.com/519b3e5ce282616f1cd7.svg',
        matchingNode: 'wss://polkadot.elara.patract.io'
      });
    } else if (polkadotSetting.apiUrl === 'wss://chainx.supercube.pro/ws') {
      setCoin({
        coinName: 'XBTC',
        whiteIcon: 'http://lc-XLoqMObG.cn-n1.lcfile.com/e19d81cbc3ad30b636cd.svg',
        matchingNode: 'wss://chainx.supercube.pro/ws'
      });
      setNetWork({
        ...netWork,
        polkadotNetUrl: polkadotSetting.apiUrl
      });
    }
  }, [polkadotSetting.apiUrl]);

  useEffect(() => {
    window.localStorage.setItem('netWork', JSON.stringify(netWork));
    window.localStorage.setItem('coinInfo', JSON.stringify(coin));
    setLocalNet(JSON.parse(window.localStorage.getItem('netWork') || '{}'));
    setLocalCoin(JSON.parse(window.localStorage.getItem('coinInfo') || '{}'));
  }, [netWork, coin]);

  useEffect(() => {
    setNetName(localNet.name);
    if (localNet.name === 'Alaya') {
      setPlatonUnit('AKSM');
      if (localCoin.coinName === 'XBTC') {
        setPlatonUnit('ABTC');
      }
    } else if (localNet.name === 'PlatON') {
      setPlatonUnit('PDOT');
      if (localCoin.coinName === 'XBTC') {
        setPlatonUnit('PBTC');
      }
    }

  }, [localNet.name, localCoin.coinName]);

  return (
    <NetWorkContext.Provider value={{
      netWork,
      setNetWork,
      localNet,
      platonUnit,
      netName,
      localCoin,
      setCoin
    }}>
      {children}
    </NetWorkContext.Provider>
  );
};
