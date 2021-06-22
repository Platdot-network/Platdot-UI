import { Loading } from '@polkadot/pages/components';
import { useApi } from '@polkadot/react-hooks';
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import PublicContent from './page-publish';
import RedeemContent from './page-redeem';
import TransferContent from './page-transfer';
import {platonWssConnect} from './contract';

function Contents(): React.ReactElement {
  const {isApiReady} = useApi()

  return (
    <>
      <main className='accounts--App'>
        <Header/>
        <Switch>
          <Route path="/redeem" exact component={RedeemContent}/>
          <Route path="/transfer" exact component={TransferContent}/>
          <Route path="/"  component={PublicContent}/>
        </Switch>
        {(!isApiReady) && <Loading />}
      </main>
    </>
  );
}

export default Contents;
