import React, { useContext } from 'react';
import AccountCard from '@polkadot/pages/components/AccountCard';
import Card from '../Card';
import { PlatonAccountsContext } from '@polkadot/pages/components/PlatonAccountsProvider';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { useTranslation } from '@polkadot/pages/components/translate';

function PlatonAccount() {
  const {t} = useTranslation();
  const {platonAccount, setPlatonAccount, pdotAmount} = useContext(PlatonAccountsContext);
  const {netWork, netName, platonUnit} = useContext(NetWorkContext);

  const openSamurai = () => {
    if (typeof window.alaya !== 'undefined') {
      alaya.request({method: 'platon_requestAccounts'})
        .then((platonAccounts: string[]) => setPlatonAccount(platonAccounts[0]));
    } else {
      window.location.href = netName === 'Alaya'?
        'https://singapore-chainx.oss-ap-southeast-1.aliyuncs.com/platdot/Samurai/samurai-devnet-chrome-8.0.11.zip?versionId=CAEQDhiBgICdg4ykxhciIGI4YTZmNDZlYzRjZTRhY2JhNDk0OGIxNGY4NWJjYjNh':
        'https://singapore-chainx.oss-ap-southeast-1.aliyuncs.com/platdot/Samurai/samurai-chrome-8.0.11.zip?versionId=CAEQDhiBgMCdg4ykxhciIGNiZTk3ODA5YTdmYzQ2M2E5OTVkN2Y5ZGI0YWMyMzli';
    }
  };

  return (
    <>
      {platonAccount ?
        <AccountCard
          className="greenCard"
          accountName={netName === 'Alaya'? t('Alaya account'): t('PlatON account')}
          accountAddress={platonAccount}
          accountAmount={pdotAmount ? pdotAmount : 0}
          iconNode={netWork.name.trim() === 'Alaya' ? 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/28/14/38/1d2811ff-3fe4-45c8-9e80-e56fd16d3920.svg' : 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/20/953c21a0-41fb-4f46-a58c-66b71f72d2f3.svg'}
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
