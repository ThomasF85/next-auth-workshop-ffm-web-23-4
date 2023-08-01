import styled from "styled-components";
import Link from "next/link";
import { StyledContainer } from "../components/StyledContainer";
import useSWR from "swr";
import { StyledButton } from "../components/StyledButton";

export default function Home() {
  const { data, isLoading, error } = useSWR("/api/fish");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <StyledContainer>
      <StyledList>
        {data.map((fish) => {
          return (
            <StyledListItem key={fish.id} $fishIcon={fish.icon}>
              <StyledLink href={`/fish/${fish.id}`}>{fish.name}</StyledLink>
            </StyledListItem>
          );
        })}
      </StyledList>
    </StyledContainer>
  );
}

const StyledLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;

  &:link,
  &:visited {
    color: #edf2f4;
  }
  &:hover {
    color: darkgoldenrod;
  }
  &:active {
    color: #edf2f4;
  }
`;

const StyledSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;

const StyledList = styled.ul`
  list-style: none;
  margin: 20px 0;
  padding: 0;
`;

const StyledListItem = styled.li`
  ::before {
    ${({ $fishIcon }) =>
      $fishIcon ? `content: "${$fishIcon}";` : `"content: "🐬";`};

    margin-right: 10px;
  }
`;
