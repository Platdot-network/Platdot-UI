import React  from 'react';
import { Wrapper, Title, Content, Nodata } from './components'
import { useTranslation } from '@polkadot/pages/components/translate';

interface dataProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  noDataMsg?: string;
}

export default function EmptyCard({ noDataMsg, title, className = '' }: dataProps): React.ReactElement<dataProps> {
  const {t} = useTranslation();

  return (
    <Wrapper className={`ui-card ${className}`}>
      <Title className={`ui-card-title`}>{title}</Title>
      <Content className="pdotCon">
        <Nodata className='nodata'>
          <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/17/59/b7f37e1f-2d60-49d7-8e8b-00cf606c0cb9.svg' alt=''/>
          <p>{noDataMsg? noDataMsg: t('Please login to your Polkadot and PlatON accounts first')}</p>
        </Nodata>
      </Content>
    </Wrapper>
  );
}
