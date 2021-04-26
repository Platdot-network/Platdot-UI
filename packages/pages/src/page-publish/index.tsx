import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Records } from '@polkadot/pages/components';
import { PolkadotAccountsContext } from '@polkadot/pages/components/PolkadotAccountsProvider';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useApi } from '@polkadot/react-hooks';
import { StatusContext } from '@polkadot/pages/components';
import { ActionStatus } from '@polkadot/pages/components/Status/types';
import { creatStatusInfo, tipInAlaya, tipInPlaton, tipInXBTC } from '@polkadot/pages/helper/helper';
import BigNumber from 'bignumber.js';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { useTranslation } from '@polkadot/pages/components/translate';
import Card from '@polkadot/pages/components/Card/Card';
import { CardContent } from '@polkadot/pages/components';
import EmptyCard from '@polkadot/pages/components/PdotCards/EmptyCard';

interface Props {
  className?: string;
}

export default function PublicContent({className = ''}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {platonAccount, hasPlatonAccount, PublishRecords, fetchTransfers} = useContext(PlatonAccountsContext);
  const publishLength = PublishRecords.length;
  const {hasAccounts, currentAccount, usableBalance} = useContext(PolkadotAccountsContext);
  const [amount, setAmount] = useState<string>('0');
  const {api, isApiReady} = useApi();
  const {queueAction} = useContext(StatusContext);
  const status = {action: 'publish'} as ActionStatus;
  const [charge, setCharge] = useState(0);
  const [isChargeEnough, setIsChargeEnough] = useState<boolean>(true);
  const amountToBigNumber = new BigNumber(amount);
  const usableBalanceToBigNumber = (new BigNumber(usableBalance)).div(1e12).toNumber();
  const {netName, localCoin} = useContext(NetWorkContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);

  useEffect(() => {
    if (!amount) {
      if (localCoin.coinName === 'KSM') {
        setCharge(tipInAlaya.toNumber());
      } else if (localCoin.coinName === 'DOT') {
        setCharge(tipInPlaton.toNumber());
      } else {
        setCharge(0);
      }
    } else {
      const chargeOfAmount = amountToBigNumber.times(0.001);
      setCharge(chargeOfAmount.plus(localCoin.coinName === 'KSM' ? tipInAlaya : localCoin.coinName === 'DOT' ? tipInPlaton: tipInXBTC).toNumber());
    }
  }, [amount, netName]);

  useEffect(() => {
    setIsChargeEnough(usableBalanceToBigNumber > charge && usableBalanceToBigNumber > amountToBigNumber.toNumber() + charge);
  }, [charge, usableBalance, amountToBigNumber]);

  useEffect(() => {
    if (!isChargeEnough) {
      setErrorMessage(t('The balance is insufficient'));
    } else if (amountToBigNumber.toNumber() <= charge) {
      setErrorMessage(t('The input amount should be greater than the handling fee'));
    } else {
      setErrorMessage('');
    }
  }, [isChargeEnough, t, amount, charge]);

  const displayStatusAndFetchBalance = (formatStatusData: any) => {
    if (formatStatusData.dispatchInfo) {
      if (formatStatusData.status.inBlock) {
        creatStatusInfo(status, 'success', t('The publish is successful'));
        queueAction(status as ActionStatus);
        fetchTransfers(platonAccount);
        setButtonDisabled(false);
      }
    } else {
      creatStatusInfo(status, 'sending', t('sending...'));
      queueAction(status as ActionStatus);
    }
  };

  const publish = () => {
    async function publishEvent() {
      if (hasAccounts && amountToBigNumber.toNumber() && platonAccount && isChargeEnough && (amountToBigNumber.toNumber() > charge)) {
        try {
          setButtonDisabled(true);
          const injector = await web3FromAddress(currentAccount);
          const amountToPrecision = amountToBigNumber.times(1e12).toNumber();
          api.setSigner(injector.signer);
          api.tx.utility.batch([
            api.tx.balances.transferKeepAlive('5F3NgH5umL6dg6rmtKEm6m7z75YZwkBkyTybksL9CZfXxvPT', amountToPrecision),
            api.tx.system.remark(platonAccount)
          ])
            .signAndSend(
              currentAccount,
              {signer: injector.signer},
              (statusData) => {
                const formatStatusData = JSON.parse(JSON.stringify(statusData));
                displayStatusAndFetchBalance(formatStatusData);
              })
            .then(result => {
              console.log('result', result);
            })
            .catch(error => {
              creatStatusInfo(status, 'error', (error as Error).message);
              queueAction(status as ActionStatus);
              setButtonDisabled(false);
            });
        } catch (err) {
          console.log(err);
        }
      }
    }

    publishEvent();
  };


  return (
    <Wrapper className={`contentWrapper ${className}`}>
      {hasPlatonAccount && hasAccounts && isApiReady ? (
          <Card className='left' title={`${t('Publish')} ${localCoin.coinName}`}>
            <CardContent
              tokenName={localCoin.coinName}
              tipLabel={t('Publish amount')}
              charge={charge}
              onClick={publish}
              buttonText={t('Confirm Publish')}
              isButtonDisabled={isButtonDisabled}
              setAmount={setAmount}
              errorMessage={errorMessage}
              isReverse={false}/>
          </Card>) :
        <EmptyCard
          title={`${t('Publish')} ${localCoin.coinName ? localCoin.coinName : ''}`}/>}
      <Records className="right" title={t('Publish record')} records={PublishRecords} recordLength={publishLength}
               arrows={true} isReverse={false}/>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  .left {
    width: 636px;
  }
  .right {
    width: 308px;
  }
`;
