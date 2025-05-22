import style from "./InputField.module.css";

export const InputField = ({ text, handleSubmit, setText }) => {
  return (
    <div className={style.home_text}>
      <input
        type="text"
        placeholder="Що відбувається ?"
        value={text}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
        onChange={(e) => setText(e.target.value)}
      />
    </div>
  );
};
