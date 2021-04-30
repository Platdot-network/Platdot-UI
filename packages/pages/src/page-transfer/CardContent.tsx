import React, { useContext, useState } from 'react';
import { AddressJudge, AmountAndAddress, TransfersCard } from '@polkadot/pages/components/PdotCards/components';
import InputDex from '@polkadot/pages/components/Input/InputDex';
import { Icon, StatusContext } from '@polkadot/pages/components';
import Input from '@polkadot/pages/components/Input/Input';
import Button from '@polkadot/pages/components/Button';
import { useTranslation } from '@polkadot/pages/components/translate';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { createTransferTransactionParameters } from '@polkadot/pages/contract';
import { creatStatusInfo } from '@polkadot/pages/helper/helper';
import { ActionStatus } from '@polkadot/pages/components/Status/types';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';

function CardContent(): React.ReactElement{
  const {t} = useTranslation();
  const [warning, setWarning] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const status = {action: 'transfer'} as ActionStatus;
  const {platonUnit, netName} = useContext(NetWorkContext);
  const {platonAccount} = useContext(PlatonAccountsContext);
  const {queueAction} = useContext(StatusContext);
  const [targetAddress, setTargetAddress] = useState<string>('');

  const confirmTransfer = () => {
    if (platonAccount && amount && targetAddress) {
      try {
        setWarning('');
        alaya.request({
          method: 'platon_sendTransaction',
          params: [createTransferTransactionParameters(platonAccount, amount, targetAddress)]
        })
          .then(result => {
            creatStatusInfo(status, 'success', `${t('Transaction hash')}: ${result}`);
            queueAction(status as ActionStatus);
          })
          .catch(error => {
            creatStatusInfo(status, 'error', error.message);
            queueAction(status as ActionStatus);
          });

      } catch (err) {
        setWarning(err.coderType);
        console.log(err);
      }
    }
  };

  return (
    <TransfersCard className={`ui-Transfers`}>
      <AmountAndAddress className='amountTit'>{t('Number of transfers')}</AmountAndAddress>
      <AddressJudge>
        <InputDex className='bgcolor' tokenName={platonUnit}
                  placeholder={t('Enter the number of {{platonUnit}}', {replace: {platonUnit}})}
                  onChange={setAmount}/>
        {warning === 'uint256' ? <Icon icon='times' className='warning redColor' size='2x'/> : null}
      </AddressJudge>
      <AmountAndAddress className='addressTit'>{t('Receiving address')}</AmountAndAddress>
      <AddressJudge className='judge'>
        <Input className='bgcolor iptAddress'
               placeholder={t('Enter the {{netName}} destination account address', {replace: {netName}})}
               onChange={setTargetAddress}/>
        {warning === 'address' ? <Icon icon='times' className='warning redColor' size='2x'/> : null}
      </AddressJudge>
      <Button className="isConfirm" onClick={confirmTransfer} text={t('Confirm Transfer')}/>
    </TransfersCard>
  )
}

export default CardContent
