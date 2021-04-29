import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Records } from '@polkadot/pages/components';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';
import { PolkadotAccountsContext } from '@polkadot/pages/components/PolkadotAccountsProvider';
import EmptyCard from '../components/PdotCards/EmptyCard';
import { StatusContext, CardContent } from '@polkadot/pages/components';
import { ActionStatus } from '@polkadot/pages/components/Status/types';
import { creatStatusInfo, tipInAlaya, tipInPlaton, tipInXBTC } from '@polkadot/pages/helper/helper';
import { createDepositTransactionParameters, createApproveTransactionParameters } from '../contract';
import BigNumber from 'bignumber.js';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { useTranslation } from '@polkadot/pages/components/translate';
import Card from '@polkadot/pages/components/Card/Card';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  className?: string;
}

export default function RedeemContent({className}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {isApiReady} = useApi();
  const {currentAccount, hasAccounts} = useContext(PolkadotAccountsContext);
  const {platonAccount, hasPlatonAccount, RedeemRecords, pdotAmount, fetchTransfers} = useContext(PlatonAccountsContext);
  const redeemLength = RedeemRecords.length;
  const [amount, setAmount] = useState<string>('0');
  const {queueAction} = useContext(StatusContext);
  const status = {action: 'redeem'} as ActionStatus;
  const [charge, setCharge] = useState(0);
  const pdotAmountToBigNumber = (new BigNumber(pdotAmount)).div(1e18).toNumber();
  const amountToBigNumber = new BigNumber(amount);
  const [isChargeEnough, setIsChargeEnough] = useState<boolean>(true);
  const {platonUnit, netName, localCoin} = useContext(NetWorkContext);
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (!amount) {
      if(localCoin.coinName === 'KSM'){
        setCharge(tipInAlaya.toNumber())
      }else if(localCoin.coinName === 'DOT'){
        setCharge(tipInPlaton.toNumber())
      }else{
        setCharge(tipInXBTC)
      }
    } else {
      const chargeOfAmount = amountToBigNumber.times(0.001);
      if(localCoin.coinName === 'KSM'){
        setCharge(chargeOfAmount.plus(tipInAlaya).toNumber())
      }else if(localCoin.coinName === 'DOT'){
        setCharge(chargeOfAmount.plus(tipInPlaton).toNumber())
      }else{
        setCharge(tipInXBTC)
      }
    }
  }, [amount, netName]);

  useEffect(() => {
    setIsChargeEnough(pdotAmountToBigNumber > charge && pdotAmountToBigNumber >= amountToBigNumber.toNumber());
  }, [pdotAmount, charge]);

  useEffect(() => {
    if (!isChargeEnough) {
      setErrorMessage(t('The balance is insufficient'));
    } else if (amountToBigNumber.toNumber() <= charge) {
      setErrorMessage(t('The input amount should be greater than the handling fee'));
    } else if (amountToBigNumber.toNumber() >= 1000) {
      setErrorMessage(t('The amount cannot exceed 1000'));
    } else {
      setErrorMessage('');
    }
  }, [isChargeEnough, amountToBigNumber, t, charge]);

  const sendErrorStatus = (error) => {
    creatStatusInfo(status, 'error', error.message);
    queueAction(status as ActionStatus);
  };

  const redeem = () => {
    if (platonAccount && amountToBigNumber.toNumber() && isChargeEnough && (amountToBigNumber.toNumber() > charge)) {
      try {
        setButtonDisabled(true);
        const amountToPrecision: BigNumber = amountToBigNumber.times(1e18);
        alaya.request({
          method: 'platon_sendTransaction',
          params: [createApproveTransactionParameters(platonAccount, amountToPrecision)]
        }).then(() =>
          alaya.request({
            method: 'platon_sendTransaction',
            params: [createDepositTransactionParameters(platonAccount, currentAccount, amountToPrecision)]
          })
            .then(result => {
              creatStatusInfo(status, 'success', `${t('Transaction hash')}: ${result}`);
              queueAction(status as ActionStatus);
              fetchTransfers(platonAccount);
              setButtonDisabled(false);
            })
            .catch(error => {
              sendErrorStatus(error);
              setButtonDisabled(false);
            })
        ).catch(error => {
          sendErrorStatus(error);
          setButtonDisabled(false);
        });
      } catch (err) {
        console.log(err);
        setButtonDisabled(false);
      }
    }
  };

  return (
    <Wrapper className={`contentWrapper ${className}`}>
      {hasPlatonAccount && hasAccounts && isApiReady ? (
          <Card className='left' title={`${t('Redeem')} ${platonUnit}`}>
            <CardContent
              tokenName={platonUnit}
              tipLabel={t('Redeem amount')}
              charge={charge}
              onClick={redeem}
              buttonText={t('Confirm Redeem')}
              isButtonDisabled={isButtonDisabled}
              setAmount={setAmount}
              errorMessage={errorMessage}
              isReverse/>
          </Card>) :
        <EmptyCard
          title={`${t('Redeem')} ${platonUnit ? platonUnit : ''}`}/>}

      <Records className="right" title={t('Redeem record')} records={RedeemRecords} recordLength={redeemLength}
               arrows={true} isReverse={true}/>
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
