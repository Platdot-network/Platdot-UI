import React, { useContext, useEffect, useState } from 'react';
import { NetWorkContext } from '../../NetWorkProvider';
import { LinkWrap } from './Detail';

type Props = {
  hash: string;
  length?: number;
  className?: string;
}

export default function ({ hash, length = 5, className = '' }: Props): React.ReactElement<Props> {
  const { netName } = useContext(NetWorkContext)
  const [url, setUrl] = useState<string>('')
  let result: string = hash
  if (hash.length > 2 * length) {
    result = hash.substring(0, 5) + '...' + hash.substring(hash.length - 5)
  }

  useEffect(() => {
    async function fetchUrl() {
      if (netName === 'Alaya') {
        setUrl(`https://devnetscan.alaya.network/trade-detail?txHash=${hash}`)
      } else {
        setUrl(`https://scan.platon.network/trade-detail?txHash=${hash}`)
      }
    }
    fetchUrl()
  }, [])

  return (
    <>
      <LinkWrap className={`${className}`} href={url} target="_blank">{result}</LinkWrap>
    </>
  );
}
