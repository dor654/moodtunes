import React from "react";
import styled from "styled-components";

const Container = styled.div`
  text-align: center;
`;

const Dashboard = () => {
  return (
    <Container>
      <h1>User Dashboard</h1>
      <p>This page will display your mood history and preferences.</p>
    </Container>
  );
};

export default Dashboard;
