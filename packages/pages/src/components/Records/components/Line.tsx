import React, { useContext, useEffect, useRef, useState } from 'react';
import Hash from './Hash';
import { Account, Detail, Header, Label, Line, Sequence, StatusText } from './Detail';
import { useOutsideClick } from '../hooks';
import { useApi } from '@polkadot/react-hooks';
import moment from 'moment';
import { PlatonAccountsContext } from '../../PlatonAccountsProvider';
import { PolkadotAccountsContext } from '../../PolkadotAccountsProvider';
import { TransferItem } from '@polkadot/pages/hooks/useTransferList';
import { useTranslation } from '@polkadot/pages/components/translate';
import { blockNumberToDate } from '@polkadot/pages/helper/helper';

interface Props {
  record: TransferItem;
  num: number;
  arrows: boolean;
  isReverse?: boolean;
}

export default function ({record, num, arrows, isReverse}: Props): React.ReactElement<Props> {
  const {t} = useTranslation();
  const {isApiReady} = useApi();
  const [open, setOpen] = useState(false);
  const {platonAccount, RecordsList} = useContext(PlatonAccountsContext);
  const {currentAccount} = useContext(PolkadotAccountsContext);
  const wrapper = useRef(null);
  const [date, setDate] = useState<string>('');
  const [completeStatus, setCompleteStatus] = useState<boolean>(true)
  useOutsideClick(wrapper, () => {
    setOpen(false);
  });

  useEffect(() => {
    RecordsList.find(item =>
      item.transactionHash === record.transactionHash
    )? setCompleteStatus(true): setCompleteStatus(false)
  }, [RecordsList, record.transactionHash])

  useEffect(() => {
    record.blockNumber? blockNumberToDate(record.blockNumber).then((timestamp: number) =>
      setDate(moment(timestamp).format('YYYY/MM/DD HH:mm:ss'))
    ): setDate(moment(new Date()).format('YYYY/MM/DD HH:mm:ss'))
  }, [record.blockNumber]);

  return (
    <Line className='publishandredeem' onClick={() => setOpen(!open)} ref={wrapper}>
      <Header>
        <Sequence className='txNum'>{date}</Sequence>
        <StatusText className={`${completeStatus? 'completed': 'underway'}`}>
          {completeStatus? t('Completed'): t('Underway')}
        </StatusText>
      </Header>
      <Account>
        {
          isReverse ?
            <>
              <Hash hash={platonAccount} className='address'/>
              {arrows ? <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/18/00/4d497fcd-6ed6-4e18-b66d-af2b754908b8.svg' alt='Arrow'
                             className='arrow'/> : ''}
              <Hash hash={currentAccount} className='address'/>
            </> :
            <>
              <Hash hash={currentAccount} className='address'/>
              {arrows ? <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/18/00/4d497fcd-6ed6-4e18-b66d-af2b754908b8.svg' alt='Arrow'
                             className='arrow'/> : ''}
              <Hash hash={platonAccount} className='address'/>
            </>
        }
      </Account>
      {isApiReady && open ? (
        <Detail className={`detail lineDetail${num}`}>
          <div className='hashVal'>
            <Label>{t('Transaction hash')}</Label>
            <Hash hash={record.transactionHash} className='hash'/>
          </div>
        </Detail>
      ) : null}
    </Line>
  );
}
