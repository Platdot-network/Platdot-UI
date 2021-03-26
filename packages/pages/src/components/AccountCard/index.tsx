// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React, {useState} from 'react';
import styled from 'styled-components';
import SelectMore from './icons/selectMore.svg';
import Button from '../Button';
import ToolTipConfig from '../ToolTipConfig';
import {toPrecision} from '@polkadot/pages/helper/helper';
import BigNumber from 'bignumber.js';

export interface AccountAndAddress{
  account: string;
  accountName: string;
}

interface AccountCardProps {
  children?: React.ReactNode;
  className?: string;
  isBasic?: boolean;
  accountName?: string;
  accountAddress?: string;
  accountAmount: number;
  allAccounts?: AccountAndAddress[];
  iconNode?: any;
  unit?: string;
  onClick?: () => void | Promise<void>;
  accountType: 'polkadot' | 'platon';
}

const formatAccountAmount = (amount: number, precision: number): string => {
  const formatAmount = new BigNumber(toPrecision(amount, precision))
  return formatAmount.toFixed(4)
}

function AccountCard({ children, className = '', isBasic, accountName, accountAddress, accountAmount, iconNode, onClick, allAccounts, unit, accountType}: AccountCardProps): React.ReactElement<AccountCardProps> {
  const [isAccountListOpen, setIsAccountListOpen] = useState<boolean>(false);
  const _toggleAccountList = (): void => setIsAccountListOpen(true);

  return (
    <div className={`ui-accountCard ${className} ${isBasic ? ' isBasic' : ''}  `}>
      <img className={`ui-accountContent`} src={iconNode} alt={iconNode}/>
      <div className={`ui-accountAmount accountItem`}>
        <div className="accountName">
          <span>{accountName ? accountName : '-'}</span>
          {allAccounts ? 
          <Button
            className="ui--Account"
            icon={SelectMore}
            onClick={_toggleAccountList}
          /> 
          : null}
        </div>
        <div className="address">{accountAddress}</div>
      </div>
      <div className="balance">可用余额</div>
      <div className="amounts">{accountType === 'polkadot' ? formatAccountAmount(accountAmount, 12): formatAccountAmount(accountAmount, 18)} {unit}</div>
      {children}{' '}
      {(isAccountListOpen && (
        <ToolTipConfig
          isOpen={isAccountListOpen}
          setIsOpen={setIsAccountListOpen}
          list={allAccounts!}
          listType='accountList'
        />))
      }
    </div>
  );
}

export default React.memo(styled(AccountCard)`
  min-width: 308px;
  max-width: 308px;
  height: 152px;
  font-size: 12px;
  color: #ffffff;
  display: grid;
  grid-template-columns: 1fr 2.5fr;
  grid-template-rows: 2fr 1fr;

  background: transparent;
  border-radius: 10px;
  border: none;
  padding: 20px;
  &.isBasic {
  }
  img {
    padding-top: 2px;
  }
  .accountItem {
    .accountName {
      font-size: 16px;
    }
    .address {
      width: 192px;
      font-weight: 300;
      word-break: break-word;
      letter-spacing: 0.2px;
    }
  }

  .balance {
    align-self: end;
    margin-left: 6px;
  }

  .amounts {
    font-size: 20px;
    align-self: end;
  }

  &.pinkCard {
    background-image: linear-gradient(135deg, #c33379 0%, #ed449d 100%);
    margin-right: 20px;
  }

  &.greenCard {
    background-image: linear-gradient(135deg, #428a8b 0%, #58bbbd 100%);
  }
`);
