import React, { createContext, FC, useEffect, useState } from 'react';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';
import useLocalStorage from '@polkadot/pages/hooks/useLocalStorage';
import { usePolkadotAccounts } from '@polkadot/pages/hooks/usePolkadotAccounts';
import { useApi } from '@polkadot/react-hooks';
import BigNumber from 'bignumber.js';
import { interval, Subscription } from '@polkadot/x-rxjs';
import { switchMap } from '@polkadot/x-rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import uiSettings from '@polkadot/ui-settings';

export interface PolkadotAccountsData {
  accountAddress: string[],
  hasAccounts: boolean,
  allAccounts: InjectedAccountWithMeta[],
  isLoading: boolean;
  setLoading: React.Dispatch<boolean>,
  currentAccount: string,
  addressAndName: object[],
  changeAccount: (account: string) => void,
  accountName: string | undefined,
  usableBalance: number,
}

export const PolkadotAccountsContext = createContext<PolkadotAccountsData>({} as PolkadotAccountsData);

export const PolkadotAccountsProvider: FC = ({children}) => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const {accountAddress, addressAndName, hasAccounts, allAccounts} = usePolkadotAccounts();
  const {api, isApiReady} = useApi();
  const [accountName, setAccountName] = useState<string | undefined>('');
  const [usableBalance, setUsableBalance] = useState<number>(0);
  const [storedValue, setValue] = useLocalStorage<string>('currentAccount');
  const [currentAccount, setAccount] = useState<string>(storedValue);

  useEffect(() => {
    let balance$: Subscription;
    if (uiSettings.get().apiUrl === 'wss://chainx.supercube.pro/ws') {
      balance$ = interval(1000).pipe(
        switchMap(() => {
          return fromPromise(api.rpc.xassets.getAssetsByAccount(currentAccount));
        })
      ).subscribe(result => {
        const formatResult = JSON.parse(JSON.stringify(result));
        Object.keys(formatResult).length === 0 ?
          setUsableBalance(0) :
          setUsableBalance(new BigNumber(formatResult[1].Usable).toNumber());
      });
    } else {
      balance$ = interval(1000).pipe(
        switchMap(() => {
          return fromPromise(api.query.system.account(currentAccount));
        })
      ).subscribe(result => {
        const allBalance = JSON.parse(JSON.stringify(result.data));
        const bgFree = new BigNumber(Number(allBalance.free));
        setUsableBalance(bgFree.minus(new BigNumber(allBalance.miscFrozen)).toNumber());
      });
    }


    return () => balance$.unsubscribe();
  });

  window.api = api;

  function changeAccount(account: string) {
    setAccount(account);
  }

  useEffect(() => {
    if (!storedValue) {
      const defaultAccount = accountAddress.length > 0 ? accountAddress[0] : '';
      setValue(defaultAccount);
      changeAccount(defaultAccount);
    }
    if (accountAddress.length !== 0) {
      if (!accountAddress.includes(currentAccount)) {
        const defaultAccount = accountAddress.length > 0 ? accountAddress[0] : '';
        setValue(defaultAccount);
        changeAccount(defaultAccount);
      }
    }
  }, [accountAddress]);

  useEffect(() => {
    const currentAccountInfo = allAccounts?.find(item => item.address === currentAccount);
    const currentName = currentAccountInfo?.meta.name;
    setAccountName(currentName);

  }, [currentAccount, isApiReady, accountName, allAccounts]);

  return (
    <PolkadotAccountsContext.Provider value={{
      accountAddress,
      addressAndName,
      hasAccounts,
      allAccounts,
      isLoading,
      setLoading,
      currentAccount,
      changeAccount,
      accountName,
      usableBalance,
    }}>
      {children}
    </PolkadotAccountsContext.Provider>
  );
};
