import React, { useContext, useEffect, useState } from 'react';
import AccountCard from '@polkadot/pages/components/AccountCard';
import Card from '../Card';
import { PolkadotAccountsContext, PolkadotAccountsData } from '@polkadot/pages/components/PolkadotAccountsProvider';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';
import { isWeb3Injected } from '@polkadot/extension-dapp';
import { useApi } from '@polkadot/react-hooks';
import { useTranslation } from '@polkadot/pages/components/translate';

function PolkadotAccount(): React.ReactElement {
  const {t} = useTranslation();
  const {currentAccount, hasAccounts, accountName, usableBalance, addressAndName} = useContext<PolkadotAccountsData>(PolkadotAccountsContext);
  const {currentCoinType} = useContext(NetWorkContext);
  const {hasInjectedAccounts} = useApi();
  const [promptMessage, setPromptMessage] = useState(t('Sign in your Polkadot{.js} the Polkadot plugin'));

  const _clickPolkadot = (): void => {
    if (!isWeb3Injected) {
      window.location.href = 'https://chrome.google.com/webstore/detail/polkadot%7Bjs%7D-extension/mopnmbcafieddcagagdcbnhejhlodfdd';
    }
  };

  useEffect(() => {
    if (isWeb3Injected) {
      if (!hasInjectedAccounts) {
        setPromptMessage(t('The extension is detected, please grant the plugin access to the account related permissions'));
      }
    }
  }, [isWeb3Injected, hasInjectedAccounts, t]);

  return (
    <>
      {
        hasAccounts ?
          <AccountCard
            className="pinkCard"
            accountName={accountName}
            accountAddress={currentAccount}
            accountAmount={usableBalance ? usableBalance : 0}
            iconNode={currentCoinType.coinName === 'KSM' ?
              'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/06/0ba15d9b-95c7-49b4-bda3-67ae2461e90e.svg' :
              currentCoinType.coinName === 'XBTC' ?
                'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/06/a17d958b-e182-48d0-b090-1bb1e19ce4cf.svg' :
                'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/06/d3b55f7e-0679-480b-8f2c-ba90beb8d18b.svg'}
            allAccounts={addressAndName}
            unit={currentCoinType.coinName}
            accountType='polkadot'
          /> :
          <Card isBasic className="pinkCard" label={promptMessage}
                iconNode='https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/11/10/5396ff31-0665-4ccc-a83c-fa621b492c50.svg'
                onClick={_clickPolkadot}/>
      }
    </>
  );
}

export default PolkadotAccount;
