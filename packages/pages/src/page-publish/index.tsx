import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Records } from '@polkadot/pages/components';
import { PolkadotAccountsContext } from '@polkadot/pages/components/PolkadotAccountsProvider';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';
import PdotNodata from '../components/PdotCards/PdotNodata';
import PublishAndRedeemCard from '../components/PdotCards/PublishAndRedeemCard';
import { web3FromAddress } from '@polkadot/extension-dapp';
import { useApi } from '@polkadot/react-hooks';
import { StatusContext } from '@polkadot/pages/components';
import { ActionStatus } from '@polkadot/pages/components/Status/types';
import { creatStatusInfo } from '@polkadot/pages/helper/helper';
import BigNumber from 'bignumber.js';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { useTranslation } from '@polkadot/pages/components/translate';

interface Props {
  className?: string;
}

export default function PublicContent({className}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {hasPlatonAccount, platonAccount, PublishRecords, pdotAmount, fetchTransfers} = useContext(PlatonAccountsContext);
  const publishLength = PublishRecords.length;
  const {hasAccounts, currentAccount, getPolkadotBalances, usableBalance} = useContext(PolkadotAccountsContext);
  const [amount, setAmount] = useState<string>('0');
  const {api} = useApi();
  const {queueAction} = useContext(StatusContext);
  const status = {action: 'publish'} as ActionStatus;
  const pdotAmountToBigNumber = (new BigNumber(pdotAmount)).div(1e18).toNumber();
  const [charge, setCharge] = useState(0.3);
  const [isChargeEnough, setIsChargeEnough] = useState<boolean>(true);
  const amountToBigNumber = new BigNumber(amount) ;
  const usableBalanceToBigNumber = (new BigNumber(usableBalance)).div(1e12).toNumber()
  const {platonUnit} = useContext(NetWorkContext);

  useEffect(() => {
    if (!amount) {
      setCharge(0.3);
    } else {
      const chargeOfAmount = amountToBigNumber.times(0.001).toNumber();
      setCharge(chargeOfAmount + 0.3);
    }
  }, [amount]);

  useEffect(() => {
    setIsChargeEnough(pdotAmountToBigNumber > charge && usableBalanceToBigNumber > amountToBigNumber.toNumber());
  }, [pdotAmount, charge, usableBalance]);

  const displayStatusAndFetchBalance = (formatStatusData: any) => {
    if (formatStatusData.status.inBlock) {
      creatStatusInfo(status, 'success', t('The publish is successful'));
      queueAction(status as ActionStatus);
      getPolkadotBalances(currentAccount);
      fetchTransfers(platonAccount)
    } else {
      creatStatusInfo(status, 'sending', t('sending...'));
      queueAction(status as ActionStatus);
    }
  };

  const publish = () => {
    async function publishEvent() {
      if (hasAccounts && amount && platonAccount && isChargeEnough) {
        try {
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
      {hasPlatonAccount && hasAccounts ?
        <PublishAndRedeemCard
          className="left"
          title={t('Publish')}
          unit={platonUnit}
          isReverse={false}
          onClick={publish}
          charge={charge}
          setAmount={setAmount}
          isChargeEnough={isChargeEnough}/>
        : <PdotNodata title={`${t('Publish')} ${platonUnit}`} noDataMsg={t('Please login to your Polkadot and PlatON accounts first')}/>
      }
      <Records className="right" title={t('Publish record')} records={PublishRecords} recordLength={publishLength} arrows={true} isReverse={false} />
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
