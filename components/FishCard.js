import styled from "styled-components";

// This is a demo component to demonstrate Styled Components integration

export function FishCard({ fish, isLocked = false }) {
  if (!fish && !isLocked) return null;
  return (
    <StyledCard color={fish?.color}>
      {isLocked ? (
        <h1>🔒 Unauthorized</h1>
      ) : (
        <>
          <h1>🔓 My profile</h1>
          <h2>
            {fish?.icon} {fish?.name}
          </h2>
          <p>{fish?.secret}</p>
        </>
      )}
    </StyledCard>
  );
}

const StyledCard = styled.div`
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
