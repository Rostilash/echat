import style from "./Movies.module.css";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";

export const DialogItem = (props) => {
  const path = "/echat/movies/" + props.id;
  return (
    <div className={style.dialog}>
      <Link to={path}>{props.name}</Link>
    </div>
  );
};

export const Messages = (props) => {
  if (props.length === 0) return;

  const isMe = props.from === "me";

  return (
    <>
      <div className={`${style.chat_messages} ${isMe ? style.from_me : style.from_other}`}>
        {props.message}
        <button className={style.delete} onClick={props.handleDeleteMessage}>
          Видалити
        </button>
      </div>
    </>
  );
};

export const Movies = (props) => {
  if (props.length === 0) return;

  const { id: UrlParams } = useParams();
  const dialogId = parseInt(UrlParams, 10);
  const [message, setMessage] = useState("");

  const filteredByUrl = props.state.filter((d) => d.dialogId === dialogId);

  const handleChange = (e) => {
    const value = e.target.value;
    setMessage(value);
  };

  const handleClickAddMessage = () => {
    const id = `id_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    fetch("http://localhost:3001/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        message: message,
        dialogId: dialogId,
        from: "me",
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Помилка при відправці повідомлення");
        }
        return res.json();
      })
      .then((newMessage) => {
        props.setMessagesData((prev) => [...prev, newMessage]);
        setMessage("");
      })
      .catch((error) => {
        console.error("Помилка:", error);
      });
  };

  const handleDeleteMessage = async (messageToDelete) => {
    try {
      const response = await fetch(`http://localhost:3001/messages/${messageToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        console.log("Повідомлення видалено");
        props.setMessagesData((prevMessages) => prevMessages.filter((msg) => msg.id !== messageToDelete));
      } else {
        console.error("Не вдалося видалити повідомлення");
      }
    } catch (error) {
      console.error("Помилка при видаленні:", error);
    }
  };

  return (
    <div className={style.movies}>
      <div className={style.item}>
        {props.dialogData.map((user) => (
          <DialogItem key={user.id} id={user.id} name={user.name} />
        ))}
      </div>

      <div className={style.chat_container}>
        {(filteredByUrl ? filteredByUrl : props.state).map((answer) => (
          <Messages
            key={answer.id}
            id={answer.id}
            message={answer.message}
            from={answer.from}
            handleDeleteMessage={() => handleDeleteMessage(answer.id)}
          />
        ))}

        <textarea name="text" value={message} onChange={handleChange}></textarea>
        <button onClick={handleClickAddMessage} disabled={message.trim() === ""}>
          Надіслати
        </button>
      </div>
    </div>
  );
};
