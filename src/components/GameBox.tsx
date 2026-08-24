interface GameBoxProps {
  path: string;
  img?: string;
}

function GameBox({
  path,
  img,
}: GameBoxProps) {
  return (
    <a className="game-box" href={path}>
      <img src={img} alt="no img" />
    </a>
  );
}

export default GameBox;
