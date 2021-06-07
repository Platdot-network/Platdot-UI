import React, { useContext } from 'react';
import styled from 'styled-components';
import uiSettings from '@polkadot/ui-settings';
import { saveAndReload } from '@polkadot/pages/components/ToolTipConfig/components/Cell/Cell';
import { NetWorkContext } from '@polkadot/pages/components/NetWorkProvider';

interface Props{
  name: string;
  icon: string;
  isSelected: boolean;
  matchingNode: string;
  whiteIcon: string;
}

const Wrapper = styled.div`
 cursor: pointer;
  display: flex;
  align-items: center;
  padding: 20px;
  background: rgba(255, 255, 255, 0.96);
  width: 100%;
  border-bottom: 1px solid #efefef;
  .isBasic {
    width: 100%;
    border: 1px solid #efefef;
  }

  .left {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    img {
      width: 32px;
      height: 32px;
    }
  }

  .title {
    flex: 1;
    padding-left: 20px;
    font-family: PingFangSC-Semibold;
    font-size: 16px;
    color: #3f3f3f;
    line-height: 32px;
  }
  .right {
    width: 24px;
    height: 24px;
    border-radius: 12px;
    margin-left: 20px;
    background: #d9d9d9;
    cursor: pointer;
  }
`

function CoinInfo({name, icon, isSelected, matchingNode, whiteIcon}: Props): React.ReactElement<Props>{
  const {setCurrentCoinType} = useContext(NetWorkContext);

  const modifyCoin = (): void => {
    setCurrentCoinType({
      coinName: name,
      whiteIcon,
      matchingNode
    });
    saveAndReload({...uiSettings.get(), apiUrl: matchingNode});
  }

  return (
    <Wrapper onClick={() => modifyCoin()}>
      <div className="left">
        <img src={icon} alt={name}/>
      </div>
      <div className="title">{name}</div>

      <div className="right">
        {isSelected?(
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill="#51ABAD"
              fillRule="evenodd"
              d="M280,20 C286.627417,20 292,25.372583 292,32 C292,38.627417 286.627417,44 280,44 C273.372583,44 268,38.627417 268,32 C268,25.372583 273.372583,20 280,20 Z M285.113301,27.8843721 C284.460622,27.4870256 283.600475,27.6438775 283.133515,28.2682769 L283.133515,28.2682769 L278.67184,34.2327881 L276.074801,32.1505567 L275.957812,32.0655297 C275.318958,31.6463175 274.453994,31.7739631 273.966166,32.3821979 C273.447848,33.0284473 273.551557,33.9725155 274.197807,34.4908331 L274.197807,34.4908331 L278.005643,37.5448684 L278.11866,37.6272917 C278.77376,38.0602338 279.665538,37.9147007 280.145377,37.2730797 L280.145377,37.2730797 L285.535987,30.0649758 L285.617005,29.9451764 C286.014352,29.2924971 285.8575,28.4323499 285.2331,27.9653902 L285.2331,27.9653902 Z"
              transform="translate(-268 -20)"
            />
          </svg>
        ): null}
      </div>
    </Wrapper>
  )
}

export default CoinInfo
