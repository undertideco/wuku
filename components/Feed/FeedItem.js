import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 5px 5px 0px 0px;
`
const MetaContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  background: ${props => props.theme.colors.primary};
  padding: 0.5rem 1rem;
  border-radius: 0px 0px 5px 5px;

  & * {
    color: white;
  }
`;

const AttributeContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const MetaHeader = styled.span`
  font-family: ${props => props.theme.sansSerifFontStack[0]};
  color: ${props => props.theme.colors.minorHeader};
  font-weight: bold;
  font-size: 0.7em;
`

const MetaValue = styled.span`
  font-family: ${props => props.theme.sansSerifFontStack[0]};
  font-size: 1.25em;
`

const DaysLeftContainer = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: 0.5rem 1rem;
  font-weight: bold;
  align-self: flex-end;
  border-radius: 0px 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`

const ClockIcon = styled(FontAwesomeIcon)`
  width: 16px;
  height: 16px;

  path {
    fill: white;
  }
`;

const DaysLeftText = styled.small`
  font-family: ${props => props.theme.sansSerifFontStack[0]};
  font-size: 0.75em;
  color: white;
`

const HaikuText = styled.p`
  font-weight: bold;
  font-size: 1.5em;
  line-height: 2em;
  padding: 0 1.875rem 1.875rem 1.875rem;
  margin: 0;
`

function FeedItem({ story }) {
  return (
    <Container>
      <ContentContainer>
        <DaysLeftContainer>
          <ClockIcon icon={faClock} style={{marginRight: "8px"}}/>
          <DaysLeftText>1 DAY LEFT</DaysLeftText>
        </DaysLeftContainer>
        <HaikuText>"An old silent pond, A frog jumps into the pond</HaikuText>
      </ContentContainer>
      <MetaContainer>
        <AttributeContainer>
          <MetaHeader>JOIN</MetaHeader>
          <MetaValue>0.05 ETH</MetaValue>
        </AttributeContainer>
        <AttributeContainer>
          <MetaHeader>PRIZE POOL</MetaHeader>
          <MetaValue>2.5 ETH</MetaValue>
        </AttributeContainer>
      </MetaContainer>
    </Container>
  );
}

export default FeedItem;
