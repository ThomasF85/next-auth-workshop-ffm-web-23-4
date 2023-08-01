import styled from "styled-components";

export const StyledButton = styled.button`
  border: none;
  padding: 8px;
  background-color: darkgoldenrod;
  color: white;
  box-shadow: 3px 3px 1px 0 black;
  max-height: 32px;
  cursor: pointer;
  &:active {
    box-shadow: 1px 1px 1px 0 black;
  }
`;
