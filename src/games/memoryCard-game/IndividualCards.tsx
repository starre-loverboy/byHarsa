interface emojiProps {
  index: number;
  id: number;
  form: string;
  isOpen: boolean;
  onCardClick: (val: number) => void;
}

function IndividualCards({ index, id, form, isOpen, onCardClick }: emojiProps) {
  return (
    <div
      onClick={() => onCardClick(index)}
      className={isOpen ? "emoji-card-opened emoji-card" : "emoji-card-closed emoji-card"}
      id={`card-${id}`}
    >
      <div className="front-emoji-card">{form}</div>
      <div className="back-emoji-card">?</div>
    </div>
  );
}

export default IndividualCards;
