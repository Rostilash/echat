import style from "./Movies.module.css";
import { Link, useParams } from "react-router-dom";

export const DialogItem = (props) => {
  const path = "/echat/movies/" + props.id;
  return (
    <div className={style.dialog}>
      <Link to={path}>{props.name}</Link>
    </div>
  );
};

export const Messages = (props) => {
  return (
    <>
      <div>{props.name}</div>
    </>
  );
};

const dialogData = [
  { id: 1, name: "Діма" },
  { id: 2, name: "Андрій" },
  { id: 3, name: "Паша" },
  { id: 4, name: "Вася" },
  { id: 5, name: "Петя" },
];

const messagesData = [
  { id: 1, message: "Hi!" },
  { id: 2, message: "How are you?" },
  { id: 3, message: "Yo!" },
  { id: 4, message: "Select" },
  { id: 5, message: "work for today" },
];

export const Movies = () => {
  // const { id: UrlParams } = useParams();

  return (
    <div className={style.movies}>
      <div className={style.item}>
        {dialogData.map((user) => (
          <DialogItem key={user.id} id={user.id} name={user.name} />
        ))}
      </div>

      <div className={style.item}>
        {messagesData.map((answer) => (
          <Messages key={answer.id} id={answer.id} name={answer.message} />
        ))}
      </div>
    </div>
  );
};
