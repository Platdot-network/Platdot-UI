import React, { useEffect, useState } from 'react';
import { useIsMounted } from './hooks';
import { LoadingWrapper, RecordDetail, Title, Wrapper } from './components/Detail';
import MiniLoading from './MiniLoading';
import Line from './components/Line';
import Lines from './components/Lines';
import Empty from './Empty';
import { useTranslation } from '@polkadot/pages/components/translate';
import { TransferItem } from '@polkadot/pages/hooks/useTransferList';

interface RecordsProps {
  children?: React.ReactNode;
  className?: string;
  title: string;
  recordLength: number;
  records: TransferItem[];
  arrows: boolean;
  isReverse?: boolean;
}

export default function Records({ children, className = '', title, records, recordLength, arrows, isReverse }: RecordsProps): React.ReactElement<RecordsProps> {
  const [loading, setLoading] = useState(true);
  const mounted = useIsMounted();
  const {t} = useTranslation();

  useEffect(() => {
    setLoading(true);
  }, [mounted]);

  useEffect(() => {
    if (mounted.current) {
      setLoading(false);
    }
  });

  const RecordsElement = arrows ? records.map((record: TransferItem, index: number) => {
    return <Line key={index} record={record} num={index} arrows={arrows} isReverse={isReverse} />;
  }) : records.map((record: TransferItem, index: number) => {
    return <Lines key={index} record={record} num={index} arrows={arrows} />;
  });

  if (loading) {
    return (
      <LoadingWrapper>
        <MiniLoading />
      </LoadingWrapper>
    );
  }

  return (
    <Wrapper className={`ui-record ${className} `}>
      <Title className='ui-record-title'>{title}</Title>
      <RecordDetail className={ recordLength === 1 ?  'normal' : 'overflow' }>
        {(records || []).length > 0 ? ( RecordsElement ) : (<Empty text={t('No data')} />)}
      </RecordDetail>
    </Wrapper>
  );
}
