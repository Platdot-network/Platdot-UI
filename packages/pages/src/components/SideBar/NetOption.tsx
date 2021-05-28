import React, { useContext } from 'react';
import styled from 'styled-components';
import uiSettings from '@polkadot/ui-settings';
import { saveAndReload } from '@polkadot/pages/components/ToolTipConfig/components/Cell/Cell';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { NetWorkInfo } from '@polkadot/pages/components/SideBar/NetWorkList';

interface Props {
  netList: NetWorkInfo[];
}

const OptionWrapper = styled.div`
  background: #fefefe;
  cursor: pointer;
  position: absolute;
  border: 1px solid #EFEFEF;
  box-shadow: 0 4px 12px 0 rgba(0,0,0,0.12);
  border-radius: 10px;
  top: 50px;
  left: -1px;
  .netItem{
    display: flex;
    align-items: center;
    padding: 20px;

    img{
      margin-right: 20px;
    }
    span{
      font-family: PingFangSC-Semibold monospace;
      font-size: 16px;
      color: #3F3F3F;
      line-height: 24px;
      font-weight: 600;
    }
    &.isSelected{
      background: #f1f4f4;
    }
  }
`;

function NetOption({netList}: Props): React.ReactElement<Props> {
  const {localNet, setNetWork, setCoin, localCoin} = useContext(NetWorkContext);
  const handleOnClick = (item: NetWorkInfo): void => {
    setNetWork({
      name: item.title.slice(0, -3),
      polkadotNetUrl: item.polkadotNetUrl,
      platonNetUrl: item.platOnNetUrl,
    });

    saveAndReload({...uiSettings.get(), apiUrl: item.polkadotNetUrl});
  };

  return (
    <OptionWrapper>
      {netList.map((item: NetWorkInfo) =>
        <div key={item.title} className={`netItem ${item.title.slice(0, -3) === localNet.name? 'isSelected': ''}`} onClick={() => handleOnClick(item)}>
          <img src={item.iconUrl} alt={item.title}/>
          <span>{item.title}</span>
        </div>)}
    </OptionWrapper>
  );
}

export default NetOption;
