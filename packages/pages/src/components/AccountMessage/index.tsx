import React  from "react";
import styled from "styled-components";

const Messages = React.memo(styled.section`
  display: flex;
  position: relative;
  background: #f1f4f4;
  border-radius: 28px;
  width: 576px;
  height: 56px;
  .middle-icon {
    width: 20px;
    height: 13px;
    // margin: 9px;
    position: absolute;
    align-self: center;
    left: 50%;
    margin-left: -10px;
  }
  .cells {
    width: 544px;
    display: flex;
    position: absolute;
    align-self: center;
    left: 50%;
    margin-left: -272px;
    justify-content: space-between;
    align-items: center !important;
  }
`);

const Cell = React.memo(styled.section`
  width: 236px;
  height: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    width: 24px;
    height: 24px;
  }
  .content {
    width: 204px;
    height: 32px;
    overflow: hidden;
    font-family: PingFangSC-Regular;
    font-size: 12px;
    color: #6f7c7c;
    line-height: 16px;
    white-space: normal;
    word-break: break-all;
  }
`);

interface AccountMessageProps {
  isReverse?: boolean;
  polkadotAddress: string;
  platonAddress: string;
}

interface addressInfo{
  iconUrl: unknown;
  content: string;
}

export default function AccountMessage({ isReverse, polkadotAddress, platonAddress }: AccountMessageProps): React.ReactElement<AccountMessageProps> {

  const transactionAddresses: addressInfo[] = [
    {
      iconUrl: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/27/10/52/5c133837-2b1c-4e86-a84d-e4c2f186066a.svg',
      content: polkadotAddress
    },
    {
      iconUrl: 'https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/28/14/38/a2e15cb7-3e87-40aa-9279-4c1885618b11.svg',
      content: platonAddress
    }
  ];

  return (
    <Messages>
      <div className="middle-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14">
          <path
            fill="#51ABAD"
            d="M16.3731785,1.01644173 L16.4513654,1.12756743 L19.7431298,6.31718871 C20.0065449,6.73247491 20.0280791,7.24883011 19.8086694,7.68036785 L19.7356191,7.80709876 L16.4438547,12.8841442 C16.0207308,13.5367482 15.1378843,13.7296389 14.4719618,13.3149776 C13.8452111,12.9247081 13.6339913,12.1353547 13.9640717,11.4997597 L14.0323358,11.3825225 L15.9289888,8.45447603 L1.42301308,8.3999894 C0.634040841,8.39698101 -0.0030589763,7.76774562 -2.33740906e-07,6.99455282 C0.00290002717,6.26684195 0.571830168,5.67097106 1.29652441,5.60589476 L1.43412977,5.6000106 L15.9579888,5.65447603 L14.0248251,2.6057659 C13.6328028,1.9877243 13.791813,1.18669819 14.3705188,0.754285024 L14.4839123,0.677661906 C15.114567,0.293480037 15.9319406,0.449310061 16.3731785,1.01644173 Z"
          />
        </svg>
      </div>
      <div className="cells">
        {isReverse ?
          <>
            {transactionAddresses.reverse().map((item: any) => (
              <Cell key={item.content}>
                <img src={item.iconUrl} />
                <div className="content">{item.content}</div>
              </Cell>
            ))}
          </>
         :
          <>
          {transactionAddresses.map((item: any) => (
              <Cell key={item.content}>
                <img src={item.iconUrl} />
                <div className="content">{item.content}</div>
              </Cell>
            ))}

          </>
        }
      </div>
    </Messages>
  );
}
