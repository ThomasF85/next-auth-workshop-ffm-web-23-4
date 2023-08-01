import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { StyledContainer } from "../../components/StyledContainer";
import { FishCard } from "../../components/FishCard";

export const FishDetails = () => {
  const [fish, setFish] = useState(null);
  const [locked, setLocked] = useState(false);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    const loadFishDetails = async () => {
      try {
        const response = await fetch(`/api/fish/${id}`);
        if (!response.ok) {
          if (response.status === 401) {
            setLocked(true);
            return;
          } else {
            throw new Error(`status: ${response.status}`);
          }
        }
        const data = await response.json();
        setFish(data);
      } catch (error) {
        console.log(error);
        alert(error);
      }
    };
    if (id) {
      loadFishDetails();
    }
  }, [id]);

  return (
    <StyledContainer>
      <FishCard fish={fish} isLocked={locked} />
    </StyledContainer>
  );
};

export default FishDetails;
