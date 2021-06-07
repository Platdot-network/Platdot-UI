import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import { Cell } from './components/Cell/Cell';
import { PolkadotAccountsContext } from '@polkadot/pages/components/PolkadotAccountsProvider';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { useTranslation } from '@polkadot/pages/components/translate';

const Wrapper = styled.section`
  position: fixed;
  left: 50%;
  top: 5%;
  transform: translate(-50%);
  z-index: 999;
  max-height: 500px !important;
  overflow: auto;
  background: rgba(255, 255, 255);
  border: 1px solid #efefef;
  box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.12);
  border-radius: 10px;
  width: 312px;

  .header {
    height: 44px;

    img {
      width: 16px;
      height: 16px;
      margin: 20px 20px 8px;
      cursor: pointer;
    }
  }
`;
const Cover = styled.section`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  background-color: rgba(0, 0, 0, 0.3);
  // display: none;
  z-index: 998;
`;

export const Shade = () => {
  return (
    <Cover>
      <div id="cover"/>
    </Cover>
  );
};

interface ToolTipConfigProps {
  list: object[];
  isOpen: boolean;
  setIsOpen: React.Dispatch<boolean>;
  listType: 'coinList' | 'accountList';
}

export default function ToolTipConfig({list, isOpen, setIsOpen, listType}: ToolTipConfigProps): React.ReactElement<ToolTipConfigProps> {
  const {currentAccount} = useContext(PolkadotAccountsContext);
  const {netWork} = useContext(NetWorkContext);
  const _toggle = (): void => setIsOpen(false);
  const {t} = useTranslation();

  const component = (
    <>
      {isOpen && (
        <>
          <Shade/>
          <Wrapper>
            <div className="header">
              <img src='https://z3.ax1x.com/2021/05/26/2900N6.png' onClick={_toggle} alt=""/>
            </div>
            {list.map(function (item: any) {
              return (
                <Cell
                  key={Math.random()}
                  isSelected={currentAccount === item.account || `${netWork.name} ${t('network')}` === item.name}
                  iconUrl={item.iconUrl}
                  title={item.title}
                  accountName={item.accountName}
                  account={item.account}
                  listType={listType}
                  item={item}
                />
              );
            })}
          </Wrapper>
        </>
      )}
    </>
  );

  return ReactDOM.createPortal(component, document.body);
}
