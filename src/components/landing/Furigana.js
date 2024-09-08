import './Furigana.css';

const Furigana = ({ furigana, kanji }) => {
  return (
    <div className="furigana-container">
      <div className="furigana">{furigana}</div>
      <div className="kanji">{kanji}</div>
    </div>
  );
};

export default Furigana;
