import { useEffect, useState } from 'react';
import { erc20_minter_contract, web3 } from '@polkadot/pages/contract';
import { interval } from 'rxjs';
import { toBech32Address } from 'web3/packages/web3-utils';
import { EventData } from 'web3/packages/web3-eth-contract';
import moment from 'moment';

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
  PublishRecords: TransferItem[],
  RedeemRecords: TransferItem[],
  Transfers: TransferItem[],
}

// const blockNumberToTime = async (blockNumber: number) => {
//   const time = await web3.platon.getBlock(blockNumber);
//   const timeFormat = moment(time.timestamp).format('YYYY-MM-DD HH:mm:ss');
//   se
// };
// blockNumberToTime(3984774);

const mapNewRecords = (RecordsList: TransferResultItem[]): TransferItem[] => {

  return RecordsList.map((item: TransferResultItem) => ({
    from: item.returnValues.from,
    to: item.returnValues.to,
    value: item.returnValues.value,
    transactionHash: item.transactionHash,
    blockNumber: item.blockNumber
  })).reverse();
};

export const hexAddressToATP = (hexAddress: string) => {
  return toBech32Address('atp', hexAddress);
};

export default function useTokenTransferList(currentAccount: string) {
  const [state, setState] = useState<AllRecords>({PublishRecords: [], RedeemRecords: [], Transfers: []});

  const fetchTransfers = (account: string) => {
    erc20_minter_contract.getPastEvents('Transfer', {fromBlock: 0},
      (error: Error, events: any) => {
        const PublishRecords: TransferItem[] = mapNewRecords(
          events.filter((element: EventData) =>
            element.returnValues.from === '0x0000000000000000000000000000000000000000' &&
            hexAddressToATP(element.returnValues.to).toLowerCase() === account.toLowerCase())
        );
        const RedeemRecords: TransferItem[] = mapNewRecords(
          events.filter((element: EventData) =>
            hexAddressToATP(element.returnValues.from).toLowerCase() === account.toLowerCase() &&
            element.returnValues.to === '0x0000000000000000000000000000000000000000')
        );
        const Transfers: TransferItem[] = mapNewRecords(
          events.filter((element: EventData) => (
            (hexAddressToATP(element.returnValues.from).toLowerCase() === account.toLowerCase() &&
              element.returnValues.to !== '0x0000000000000000000000000000000000000000') ||
            (hexAddressToATP(element.returnValues.to).toLowerCase() === account.toLowerCase() &&
              element.returnValues.from !== '0x0000000000000000000000000000000000000000')
          ))
        );
        setState({
          PublishRecords,
          RedeemRecords,
          Transfers,
          // transferCompletion
        });
      });
  };


  useEffect((): () => void => {
    const fetchTransfers$ = interval(1000).subscribe(() => fetchTransfers(currentAccount));

    return () => fetchTransfers$.unsubscribe();
  }, [currentAccount]);

  return {state, fetchTransfers};
}
