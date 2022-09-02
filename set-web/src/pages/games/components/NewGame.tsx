import React, { CSSProperties, useRef } from "react";
import { FiChevronRight, FiPlusCircle } from "react-icons/fi";
import Button from "../../../components/button/Button";
import Checkbox from "../../../components/fields/Checkbox";
import NumberField from "../../../components/fields/NumberField";
import "./NewGame.scss";

const NewGame = () => {
  const [newGameMenuOpened, setNewGameMenuOpened] = React.useState(false);
  const error = useRef<string>(null);

  const [limit, setLimit] = React.useState(5);
  const [isPublic, setPublic] = React.useState(false);

  const content = useRef<HTMLDivElement>(null);

  return (
    <form
      className={`new-game ${newGameMenuOpened ? "opened" : ""}`}
      onSubmit={(e) => {
        e.preventDefault();
        setNewGameMenuOpened(false);
      }}
    >
      <div className="new-game-wrapper" style={{ "--height": content.current?.offsetHeight } as CSSProperties}>
        <div className="new-game-content text" ref={content}>
          <div className="new-game-header">Create new game</div>

          <div className="new-game-field">
            <span className="new-game-field-text">Player limit: </span>
            <NumberField min={2} max={64} value={limit} onChange={setLimit} />
          </div>

          <div className="new-game-field">
            <span className="new-game-field-text">Public: </span>
            <Checkbox checked={isPublic} onChange={setPublic} />
          </div>
        </div>
      </div>

      <Button
        submit={newGameMenuOpened}
        onClick={() => setTimeout(() => setNewGameMenuOpened(true), 10)}
        fullwidth
        leftIcon={FiPlusCircle}
        text="Create new game"
        rightIcon={FiChevronRight}
      />
    </form>
  );
};

export default NewGame;
