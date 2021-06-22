import {ActionStatus} from '@polkadot/pages/components/Status/types';
import BigNumber from 'bignumber.js';
import { web3 } from '@polkadot/pages/contract';

const creatStatusInfo = (statusInfo: ActionStatus, status: string,message: string) => {
  statusInfo.status = status
  statusInfo.message = message
}

const toPrecision = (value: number, precision = 0, paddingZero = true): number | string => {
  precision = Number(precision);
  const big = new BigNumber(value).dividedBy(Math.pow(10, precision));

  if (paddingZero) {
    return big.toFixed(precision);
  } else {
    return big.toNumber();
  }
}

const  classes = (...classNames: (boolean | null | string | undefined)[]): string =>  {
  return classNames
    .filter((className): boolean => !!className)
    .join(' ');
}

const blockNumberToDate = async (blockNumber: number) => {
  const {timestamp} = await web3.platon.getBlock(blockNumber);
  return timestamp
};

const tipInAlaya: BigNumber = new BigNumber(0.01)
const tipInPlaton: BigNumber = new BigNumber(0.6)
const tipInXBTC = 0

export {
  creatStatusInfo,
  toPrecision,
  classes,
  tipInAlaya,
  tipInPlaton,
  tipInXBTC,
  blockNumberToDate
}
