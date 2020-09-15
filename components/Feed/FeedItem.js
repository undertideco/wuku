import { faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { add, formatDistance } from 'date-fns';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Web3 from 'web3';

import Story from '../../ethereum/story';
import web3 from '../../ethereum/web3';
import { Link } from '../../routes';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 7px 7px 0px 0px;
  border: #e5e5e5 2px solid;
  border-bottom: none;
`;

const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  background: ${(props) => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 0px 0px 5px 5px;

  & * {
    color: white;
  }
`;

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaHeader = styled.span`
  font-family: ${(props) => props.theme.sansSerifFontStack[0]};
  color: ${(props) => props.theme.colors.minorHeader};
  font-weight: bold;
  font-size: 0.7em;
`;

const MetaValue = styled.span`
  font-family: ${(props) => props.theme.sansSerifFontStack[0]};
  font-size: 1.25em;
`;

const DaysLeftContainer = styled.div`
  background: ${(props) => props.theme.colors.secondary};
  padding: 0.5rem 1rem;
  font-weight: bold;
  align-self: flex-end;
  border-radius: 0px 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ClockIcon = styled(FontAwesomeIcon)`
  width: 16px;
  height: 16px;

  path {
    fill: white;
  }
`;

const DaysLeftText = styled.small`
  font-family: ${(props) => props.theme.sansSerifFontStack[0]};
  font-size: 0.75em;
  color: white;
`;

const HaikuText = styled.p`
  font-weight: bold;
  font-size: 1.5em;
  line-height: 2em;
  padding: 0 1.875rem 1.875rem 1.875rem;
  margin: 0;
`;

function FeedItem({ storyId }) {
  const [storySoFar, setStorySoFar] = useState('');
  const [minContribution, setMinContribution] = useState('');
  const [prizePool, setPrizePool] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const loadStoryData = async () => {
      const story = Story(storyId);
      const storySummary = await story.methods.getSummary().call();
      const prizePool = await web3.eth.getBalance(story.options.address);

      setStorySoFar(
        storySummary[0].map((summary) => summary.description).join(' ')
      );
      setMinContribution(storySummary[1]);
      setPrizePool(prizePool);
      setTimeLeft(storySummary[3]);
    };

    loadStoryData();
  });

  return (
    <Link route={`/stories/${storyId}`} passHref>
      <Container>
        <ContentContainer>
          <DaysLeftContainer>
            <ClockIcon icon={faClock} style={{ marginRight: '8px' }} />
            <DaysLeftText>
              {`${formatDistance(
                new Date(),
                add(new Date(), { seconds: timeLeft }),
                { includeSeconds: true, addSuffix: true }
              )}`}
            </DaysLeftText>
          </DaysLeftContainer>
          <HaikuText>{`"${storySoFar}`}</HaikuText>
        </ContentContainer>
        <MetaContainer>
          <AttributeContainer>
            <MetaHeader>JOIN</MetaHeader>
            <MetaValue>
              {Web3.utils.fromWei(minContribution, 'ether')} ETH
            </MetaValue>
          </AttributeContainer>
          <AttributeContainer>
            <MetaHeader>PRIZE POOL</MetaHeader>
            <MetaValue>
              {Web3.utils.fromWei(prizePool.toString(), 'ether')} ETH
            </MetaValue>
          </AttributeContainer>
        </MetaContainer>
      </Container>
    </Link>
  );
}

export default FeedItem;
