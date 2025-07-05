import React from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--surface);
  border-radius: 0.5rem;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: var(--primary);
  color: white;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--secondary);
  }
`;

const Login = () => {
  return (
    <Container>
      <Title>Log In</Title>
      <Form>
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <Button type="submit">Log In</Button>
      </Form>
    </Container>
  );
};

export default Login;
