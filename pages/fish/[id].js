import { useRouter } from "next/router";
import { StyledContainer } from "../../components/StyledContainer";
import { FishCard } from "../../components/FishCard";
import useSWR from "swr";
import { UnauthorizedCard } from "@/components/UnauthorizedCard";

export const FishDetails = () => {
  const router = useRouter();
  const { id } = router.query;

  const { data, isLoading, error } = useSWR(`/api/fish/${id}`);

  if (isLoading) return <p>Loading...</p>;
  if (error) {
    if (error.status === 401) {
      return (
        <StyledContainer>
          <UnauthorizedCard />
        </StyledContainer>
      );
    }
    return <p>Error: {error.message}</p>;
  }

  return (
    <StyledContainer>
      <FishCard fish={data} />
    </StyledContainer>
  );
};

export default FishDetails;
