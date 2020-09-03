import React from 'react';
import styled from 'styled-components';

import FeedItem from './FeedItem';

const FeedContainer = styled.div`
  display: inline-grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

function Section({ stories }) {
  return (
    <FeedContainer>
      {stories.map((storyId) => {
        return <FeedItem key={storyId} storyId={storyId} />;
      })}
    </FeedContainer>
  );
}

export default Section;
