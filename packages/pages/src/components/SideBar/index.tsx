// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0
import React  from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import SideItem from "./SideItem";
import Languages from "./Languages";
import { useTranslation } from '@polkadot/pages/components/translate';
import NetWorkList from '@polkadot/pages/components/SideBar/NetWorkList';

export interface NodeItem {
  index: number | undefined;
  nodeName: string;
  link: string;
  icon: React.ReactElement;
  icon_after: React.ReactElement;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;
  width: 256px;
  font-size: 16px;
  background: #fff;
  // box-shadow: 6px 0 20px 0 rgba(0, 0, 0, 0.1);
  &::-webkit-scrollbar {
    display: none;
  }

  .wrappers {
    margin: 0 56px 0 52px;

    ul,li{
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .navLists {
      padding-top: 23px;
      .navItem {
        margin: 25px 0;
        a {
          display: flex;
          align-items: center;
          padding: 15px 0;
          span {
            padding-left: 16px;
            color: #6f7c7c;
          }
        }
      }

      .statusRisk > a {
        background: #51abad;
        border-radius: 0 10px 10px 0;
        margin: 25px -26px 25px -52px;
        padding-left: 52px;
        transition: all .7s;
        span {
          color: #ffffff;
        }
      }
    }
  }
`;

function Sidebars(): React.ReactElement {
  const {t} = useTranslation();

  const nodeList: NodeItem[] = [
    {
      index: 0,
      nodeName: t("Publish"),
      link: "/",
      icon: <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/17/49/6ec51546-7373-421e-b9ec-50783e33bb65.svg' alt="publish" />,
      icon_after: <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/17/49/284426a6-6435-49f7-a9e6-a8f969befeba.svg' alt="publish" />
    },
    {
      index: 1,
      nodeName: t("Redeem"),
      link: "/redeem",
      icon: <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/17/47/f8a907dd-fad1-46a7-bc0b-79d0a9b14163.svg' alt="redeem" />,
      icon_after: <img src='https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/28/14/38/38b5c017-c5f6-4816-a44e-753ce0c86c83.svg' alt="redeem" />
    },
    {
      index: 2,
      nodeName: t("Transfer"),
      link: "/transfer",
      icon: <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/17/49/633a7daf-b3cc-4cb7-947c-9c2d2bb238ca.svg' alt="transfer" />,
      icon_after: <img src='https://pic.stackoverflow.wiki/uploadImages/115/195/145/17/2021/05/28/14/38/88ef5209-6157-4a75-8f7e-a15af3b45f28.svg' alt="transfer" />
    }
  ];

  const { pathname } = useLocation();

  return (
    <Wrapper>
      <div className="wrappers">
        <img src='https://pic.stackoverflow.wiki/uploadImages/115/194/7/100/2021/05/26/19/58/34dc4865-9e7c-4e58-adc4-0e9a7b1a29d8.svg' alt="PlatDot" />
        <NetWorkList/>
        <ul className="navLists">
          {nodeList.map((node: NodeItem, index: number) => (
            <SideItem node={node} key={index} pathname={pathname} />
          ))}
        </ul>
      </div>
      <Languages />
    </Wrapper>
  );
}

export default Sidebars;
