import React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const Recommendations = () => {
  return (
    <Container>
      <h1>Music Recommendations</h1>
      <p>This page will display music recommendations based on your mood.</p>
    </Container>
  );
};

export default Recommendations;
