import { StyledCard } from "./StyledCard";

export function FishCard({ fish }) {
  return (
    <StyledCard color={fish?.color}>
      <h1>🔓 My profile</h1>
      <h2>
        {fish?.icon} {fish?.name}
      </h2>
      <p>{fish?.secret}</p>
    </StyledCard>
  );
}
