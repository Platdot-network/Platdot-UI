import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Icon } from '@polkadot/pages/components';
import NetOption from '@polkadot/pages/components/SideBar/NetOption';
import { useTranslation } from '@polkadot/pages/components/translate';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 20px;
  font-family: PingFangSC-Semibold;
  font-size: 14px;
  color: #3F3F3F;
  font-weight: 600;
  white-space: nowrap;
  padding-top: 24px;
  cursor: pointer;
  position: relative;
  width: fit-content;
  margin: 0 auto;
  > span{
    margin-right: 4px;
  }
`

export interface NetWorkInfo {
  title: string;
  iconUrl: string;
  polkadotNetUrl: string;
  platOnNetUrl: string;
}

function NetWorkList(): React.ReactElement{
  const {t} = useTranslation();
  const [isShow, setIsShow] = useState<boolean>(false)
  const {platonNet} = useContext(NetWorkContext);
  const netList: NetWorkInfo[] = [
    {
      title: `Alaya ${t('network')}`,
      iconUrl: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/10/55/5703a7b2-6a4c-47fb-ad47-ae4b7d757ffb.svg',
      polkadotNetUrl: "wss://kusama-rpc.polkadot.io",
      platOnNetUrl: "https://platonnet.chainx.org/"
    },
    {
      title: `PlatON ${t('network')}`,
      iconUrl: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/10/55/0ab5078d-5301-4bca-adcf-4688fa1fb8bb.svg',
      polkadotNetUrl: "wss://rpc.polkadot.io",
      platOnNetUrl: ""
    }
  ];

  return (
    <Wrapper onClick={() => setIsShow(!isShow)}>
      <span>{`${platonNet.name? platonNet.name : ''} ${t('network')}`}</span>
      {/*<Icon icon={`${isShow? 'caret-up': 'caret-down'}`}/>*/}
      {/*{isShow && <NetOption netList={netList}/>}*/}
    </Wrapper>
  )
}

export default NetWorkList
