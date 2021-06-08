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
import { ApiProps } from '@polkadot/react-api/types';
import { ApiContext } from '@polkadot/react-api';
import { animated, useSpring } from 'react-spring';

interface Props {
  className?: string;
}

export default function PublicContent({className = ''}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {platonAccount, hasPlatonAccount, PublishRecords} = useContext(PlatonAccountsContext);
  const publishLength = PublishRecords.length;
  const {hasAccounts, currentAccount, usableBalance} = useContext(PolkadotAccountsContext);
  const [amount, setAmount] = useState<string>('0');
  const {api, isApiReady} = useApi();
  const {queueAction} = useContext(StatusContext);
  const status = {action: 'publish'} as ActionStatus;
  const [charge, setCharge] = useState(0);
  const [isChargeEnough, setIsChargeEnough] = useState<boolean>(true);
  const amountToBigNumber = new BigNumber(amount);
  const {formatProperties} = useContext<ApiProps>(ApiContext);
  const usableBalanceToBigNumber = (new BigNumber(usableBalance)).div(formatProperties ? Math.pow(10, formatProperties.tokenDecimals[0]) : 1e1).toNumber();
  const {currentNetwork, currentCoinType} = useContext(NetWorkContext);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isButtonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<string>('');
  const transitionProps = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 } ,
    config: { duration: 400 }
  })

  useEffect(() => {
    if (!amount) {
      if (currentCoinType.coinName === 'KSM') {
        setCharge(tipInAlaya.toNumber());
      } else if (currentCoinType.coinName === 'DOT') {
        setCharge(tipInPlaton.toNumber());
      } else {
        setCharge(tipInXBTC);
      }
    } else {
      const chargeOfAmount = amountToBigNumber.times(0.001);
      if (currentCoinType.coinName === 'KSM') {
        setCharge(chargeOfAmount.plus(tipInAlaya).toNumber());
      } else if (currentCoinType.coinName === 'DOT') {
        setCharge(chargeOfAmount.plus(tipInPlaton).toNumber());
      } else {
        setCharge(tipInXBTC);
      }
    }
  }, [amount, currentCoinType.coinName]);

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

  useEffect(() => {
    transaction && PublishRecords.unshift({
      from: currentAccount,
      to: platonAccount,
      value: '',
      transactionHash: transaction,
      blockNumber: 0,
    });
  }, [transaction]);

  const displayStatusAndFetchBalance = (formatStatusData: any): void => {
    if (formatStatusData.dispatchInfo) {
      if (formatStatusData.status.inBlock) {
        creatStatusInfo(status, 'success', t('The publish is successful'));
        queueAction(status as ActionStatus);
        setButtonDisabled(false);
        setTransaction(formatStatusData.status.inBlock);
      }
    } else {
      creatStatusInfo(status, 'sending', t('sending...'));
      queueAction(status as ActionStatus);
    }
  };

  const publishEvent = async (): Promise<void> => {
    try {
      setButtonDisabled(true);
      const injector = await web3FromAddress(currentAccount);
      const amountToPrecision = amountToBigNumber.times(Math.pow(10, formatProperties.tokenDecimals[0])).toNumber();
      api.setSigner(injector.signer);
      let param: any;
      if (currentCoinType.coinName === 'XBTC') {
        param = [
          api.tx.xAssets.transfer('5F3NgH5umL6dg6rmtKEm6m7z75YZwkBkyTybksL9CZfXxvPT', 1, amountToPrecision),
          api.tx.system.remark(platonAccount)
        ];
      } else {
        let remarkParams;
        currentNetwork.name === 'PlatON'? remarkParams = '4,002': remarkParams = '2,000'
        param = [
          api.tx.balances.transferKeepAlive('5F3NgH5umL6dg6rmtKEm6m7z75YZwkBkyTybksL9CZfXxvPT', amountToPrecision),
          api.tx.system.remark(`${remarkParams},${platonAccount}`)
        ];
        console.log(`${remarkParams},${platonAccount}`)
      }
      api.tx.utility.batch(param)
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

  const publish = (): void => {
    if (hasAccounts && amountToBigNumber.toNumber() && platonAccount && isChargeEnough && (amountToBigNumber.toNumber() > charge)) {
      publishEvent();
    }
  };

  return (
    <Wrapper style={transitionProps} className={`contentWrapper ${className}`}>
      {hasPlatonAccount && hasAccounts && isApiReady ? (
          <Card className='left' title={`${t('Publish')} ${currentCoinType.coinName}`}>
            <CardContent
              tokenName={currentCoinType.coinName}
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
          title={`${t('Publish')} ${currentCoinType.coinName ? currentCoinType.coinName : ''}`}/>}
      <Records className="right" title={t('Publish record')} records={PublishRecords} recordLength={publishLength}
               arrows={true} isReverse={false}/>
    </Wrapper>
  );
}

const Wrapper = styled(animated.div)`
  display: flex;
  justify-content: space-between;
  .left {
    width: 636px;
  }
  .right {
    width: 308px;
  }
`;
