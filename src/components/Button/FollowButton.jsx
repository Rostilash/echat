import { useAuth } from "../../hooks/useAuth";
import { Button } from "./Button";

export const FollowButton = ({ userId }) => {
  const { currentUser, followUser, unfollowUser } = useAuth();

  if (!currentUser || currentUser?.uid === userId) return;
  const isFollowing = currentUser?.following.includes(userId);

  const handleClickFollow = () => {
    if (isFollowing) {
      unfollowUser(userId);
    } else {
      followUser(userId);
    }
  };
  // debugger;
  return (
    <>
      <Button onClick={handleClickFollow} size="small" variant={isFollowing ? "empty" : "default"}>
        {isFollowing ? "Відписатися" : "Підписатися"}
      </Button>
    </>
  );
};
