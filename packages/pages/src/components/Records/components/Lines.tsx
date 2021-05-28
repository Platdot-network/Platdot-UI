import React, { useContext, useEffect, useRef, useState } from 'react';
import Hash from './Hash';
import { Detail, Header, Account, Label, Line, Sequence, Inout, Amount } from './Detail';
import moment from 'moment';
import { useTranslation } from '@polkadot/pages/components/translate';
import { useOutsideClick } from '../hooks';
import { useApi } from '@polkadot/react-hooks';
import Arrow from './arrow.svg';
import { hexAddressToATP, TransferItem } from '@polkadot/pages/hooks/useTransferList';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';
import BigNumber from 'bignumber.js';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { blockNumberToDate } from '@polkadot/pages/helper/helper';

interface Props {
  record: TransferItem;
  num: number;
  arrows: boolean;
}

export default function ({record, num, arrows}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {isApiReady} = useApi();
  const [open, setOpen] = useState(false);
  const wrapper = useRef(null);
  const {platonAccount} = useContext(PlatonAccountsContext)
  const {platonUnit} = useContext(NetWorkContext)
  const [date, setDate] = useState<string>('');

  useOutsideClick(wrapper, () => {
    setOpen(false);
  });

  useEffect(() => {
    blockNumberToDate(record.blockNumber).then((timestamp: number) =>
      setDate(moment(timestamp).format('YYYY/MM/DD HH:mm:ss'))
    );
  }, [record.blockNumber]);

  return (
    <Line className='transfer' onClick={() => setOpen(!open)} ref={wrapper}>
      <Header>
        <Sequence className='txNum'>{date}</Sequence>
        <Inout>{hexAddressToATP(record.to) === platonAccount ? t('In') : t('Out')}</Inout>
      </Header>
      <Account className='account'>
        <Amount>{(new BigNumber(record.value).div(1e18)).toNumber().toFixed(4)} {platonUnit}</Amount>
        {arrows ? <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/18/00/4d497fcd-6ed6-4e18-b66d-af2b754908b8.svg' alt='Arrow' className='arrow'/> : ''}
        <Hash hash={record.to} className='address'/>
      </Account>
      {isApiReady && open ? (
        <Detail className={`detail  lineDetail${num}`}>
          <div className='hashVal'>
            <Label>{t('Transaction hash')}</Label>
            <Hash hash={record.transactionHash} className='hash'/>
          </div>
        </Detail>
      ) : null}
    </Line>
  );
}
