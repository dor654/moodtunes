import React from "react";
import styled from "styled-components";
import { FaExclamationTriangle } from "react-icons/fa";

const ErrorContainer = styled.div`
  background-color: rgba(239, 68, 68, 0.1);
  border-left: 4px solid #ef4444;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  color: #ef4444;
  margin-right: 0.75rem;
  font-size: 1.25rem;
`;

const ErrorText = styled.p`
  color: var(--text-primary);
  margin: 0;
`;

const ErrorMessage = ({ message }) => {
  return (
    <ErrorContainer>
      <IconWrapper>
        <FaExclamationTriangle />
      </IconWrapper>
      <ErrorText>{message || "An error occurred. Please try again."}</ErrorText>
    </ErrorContainer>
  );
};

export default ErrorMessage;
