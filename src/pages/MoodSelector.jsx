import React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const MoodSelector = () => {
  return (
    <Container>
      <h1>Mood Selector</h1>
      <p>This page will contain the mood selection interface.</p>
    </Container>
  );
};

export default MoodSelector;
