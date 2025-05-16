import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

export const FollowButton = ({ nickname }) => {
  const { currentUser, followUser, unfollowUser } = useAuth();

  if (!currentUser || currentUser.nickname === nickname) return;
  const isFollowing = currentUser.following.includes(nickname);

  const handleClickFollow = () => {
    if (isFollowing) {
      unfollowUser(nickname);
    } else {
      followUser(nickname);
    }
  };

  return (
    <>
      <Button onClick={handleClickFollow} size="small" variant={isFollowing ? "empty" : "default"}>
        {isFollowing ? "Відписатися" : "Підписатися"}
      </Button>
    </>
  );
};
