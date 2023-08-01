import styled from "styled-components";

export const StyledCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${({ color }) => color};
  border: 1px solid black;
  border-radius: 5px;
  width: 400px;
  height: 400px;
`;
