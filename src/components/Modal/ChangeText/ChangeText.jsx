import React from "react";
import style from "./ChangeText.module.css";
import { Button } from "../../Button/Button";

export const ChangeText = ({ text, setText, handleSave, handleCancel }) => {
  return (
    <div className={style.message_content}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} />

      <div className={style.buttons}>
        {handleSave && text.length > 0 && (
          <Button disabled={!text.trim()} onClick={() => handleSave()} type="submit" size="small" variant="secondary">
            Підтвердити
          </Button>
        )}
        <Button onClick={() => handleCancel(false)} size="small" variant="secondary">
          Відмінити
        </Button>
      </div>
    </div>
  );
};
