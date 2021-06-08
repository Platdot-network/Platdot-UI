import { useEffect, useState } from 'react';
import { erc20_minter_contract } from '@polkadot/pages/contract';
import { interval } from '@polkadot/x-rxjs';
import { toBech32Address } from 'web3/packages/web3-utils';
import { EventData } from 'web3/packages/web3-eth-contract';
import { fromPromise } from 'rxjs/internal-compatibility';
import { switchMap } from '@polkadot/x-rxjs/operators';

interface TransferResultItem {
  returnValues: TransferItem;
  transactionHash: string;
  blockNumber: number;
}

export interface TransferItem {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
  blockNumber: number;
}

interface AllRecords {
  PublishRecords: TransferItem[];
  RedeemRecords: TransferItem[];
  Transfers: TransferItem[];
  RecordsList: TransferItem[];
}

const mapNewRecords = (RecordsList: TransferResultItem[]): TransferItem[] => {
  return RecordsList.map((item: TransferResultItem) => ({
    from: item.returnValues.from,
    to: item.returnValues.to,
    value: item.returnValues.value,
    transactionHash: item.transactionHash,
    blockNumber: item.blockNumber
  })).reverse();
};

export const formatAddress = (hexAddress: string): string => {
  //@ts-ignore
  if (Number(window.alaya.chainId) === 210309) {
    return toBech32Address('lat', hexAddress);
    //@ts-ignore
  } else if (Number(window.alaya.chainId) === 201030) {
    return toBech32Address('atp', hexAddress);
  } else {
    return '';
  }
};

export default function useTokenTransferList(currentAccount: string) {
  const [state, setState] = useState<AllRecords>({
    PublishRecords: [],
    RedeemRecords: [],
    Transfers: [],
    RecordsList: []
  });
  const [publishRecordsLength, setPublishRecordsLength] = useState<number>(-1);
  const [redeemRecordsLength, setRedeemRecordsLength] = useState<number>(-1);

  const fetchTransfers = (account: string) => {
    erc20_minter_contract.getPastEvents('Transfer', {fromBlock: 0},
      (error: Error, events: any) => {
        const PublishRecords: TransferItem[] = mapNewRecords(
          events.filter((element: EventData) =>
            element.returnValues.from === '0x0000000000000000000000000000000000000000' &&
            formatAddress(element.returnValues.to).toLowerCase() === account.toLowerCase())
        );
        const RedeemRecords: TransferItem[] = mapNewRecords(
          events.filter((element: EventData) =>
            formatAddress(element.returnValues.from).toLowerCase() === account.toLowerCase() &&
            element.returnValues.to === '0x0000000000000000000000000000000000000000')
        );
        const Transfers: TransferItem[] = mapNewRecords(
          events.filter((element: EventData) => (
            (formatAddress(element.returnValues.from).toLowerCase() === account.toLowerCase() &&
              element.returnValues.to !== '0x0000000000000000000000000000000000000000') ||
            (formatAddress(element.returnValues.to).toLowerCase() === account.toLowerCase() &&
              element.returnValues.from !== '0x0000000000000000000000000000000000000000')
          ))
        );
        setState({
          PublishRecords,
          RedeemRecords,
          Transfers,
          RecordsList: events
        });
      });
  };

  useEffect(() => {
    const fetchTransfers$ = interval(1000).pipe(
      switchMap(() =>
        fromPromise(erc20_minter_contract.getPastEvents('Transfer', {fromBlock: 0}))
      ),
    ).subscribe((result: any) => {
        const publishRecords = result.filter((event: EventData) =>
          event.returnValues.from === '0x0000000000000000000000000000000000000000' &&
          formatAddress(event.returnValues.to).toLowerCase() === currentAccount.toLowerCase());
        const redeemRecords = result.filter((event: EventData) =>
          formatAddress(event.returnValues.from).toLowerCase() === currentAccount.toLowerCase() &&
          event.returnValues.to === '0x0000000000000000000000000000000000000000');
        setPublishRecordsLength(publishRecords.length);
        setRedeemRecordsLength(redeemRecords.length);
      }
    );

    return () => {
      fetchTransfers$.unsubscribe();
    };
  }, [currentAccount]);

  useEffect(() => {
    fetchTransfers(currentAccount);
  }, [publishRecordsLength, redeemRecordsLength]);

  return {state, fetchTransfers};
}
