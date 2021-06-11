import React, { useContext } from 'react';
import AccountCard from '@polkadot/pages/components/AccountCard';
import Card from '../Card';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { useTranslation } from '@polkadot/pages/components/translate';

function PlatonAccount() {
  const {t} = useTranslation();
  const {platonAccount, setPlatonAccount, pdotAmount} = useContext(PlatonAccountsContext);
  const {currentNetwork, platonUnit} = useContext(NetWorkContext);

  const openSamurai = () => {
    if (typeof window.alaya !== 'undefined') {
      alaya.request({method: 'platon_requestAccounts'})
        .then((platonAccounts: string[]) => setPlatonAccount(platonAccounts[0]));
    } else {
      window.location.href = 'https://singapore-chainx.oss-ap-southeast-1.aliyuncs.com/platdot/samurai-chrome-8.1.0 (1).zip?versionId=CAEQERiBgMDjlfnpzxciIGRjOWRkYThkZGJhZjRmNzRiMjUzNjJjNDFiZTE3YmU4'
    }
  };

  return (
    <>
      {platonAccount ?
        <AccountCard
          className="greenCard"
          accountName={currentNetwork.name === 'Alaya'? t('Alaya account'): t('PlatON account')}
          accountAddress={platonAccount}
          accountAmount={pdotAmount ? pdotAmount : 0}
          iconNode={currentNetwork.name.trim() === 'Alaya' ? 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/28/14/38/1d2811ff-3fe4-45c8-9e80-e56fd16d3920.svg' : 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/20/953c21a0-41fb-4f46-a58c-66b71f72d2f3.svg'}
          unit={platonUnit}
          accountType='platon'
        /> :
        <Card isBasic className="greenCard" label={t('Sign in your PlatON account with the Samurai plugin')} iconNode='https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/10/fa4d9217-dc05-4081-8fd8-fad2e1d6e17b.svg'
              onClick={openSamurai}/>
      }
    </>
  );
}

export default PlatonAccount;
