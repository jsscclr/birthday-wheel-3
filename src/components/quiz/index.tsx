import { useCallback, useEffect, useState, useMemo } from 'react';
import styles from './quiz.module.css';
import classnames from 'classnames';

const QuizItem = ({
  img,
  points,
  onSelect,
  onDeselect,
  unavailable,
}: {
  img: string;
  points: number;
  onSelect(points: number): void;
  onDeselect(points: number): void;
  unavailable: boolean;
}) => {
  const [selected, setSelected] = useState(false);

  const handleClick = useCallback(() => {
    selected ? onDeselect(points) : onSelect(points);

    setSelected((prev) => !prev);
  }, [onSelect, onDeselect, selected]);

  return (
    <div
      className={classnames(styles.quizItem, {
        [styles.selected]: selected,
        [styles.unavailable]: unavailable && !selected,
      })}
      onClick={handleClick}
    >
      <img src="halftone.png" className={styles.halftone} />
      <img src={img} className={styles.item} />
      {selected ? (
        <div className={styles.overlay}>
          <span>{img.split('.')[0]}</span>
        </div>
      ) : null}
    </div>
  );
};

const items = [
  { img: 'armchair.webp', points: 1 },
  { img: 'donut.webp', points: 3 },
  { img: 'grapes.webp', points: 5 },
  { img: 'flowers.webp', points: 4 },
  { img: 'light-bulb.webp', points: 1 },
  { img: 'sushi.webp', points: 4 },
  { img: 'mango.webp', points: 3 },
  { img: 'popcorn.webp', points: 2 },
  { img: 'tv.webp', points: 2 },
  { img: 'cheese.webp', points: 5 },
];

// 2 points => Book
// 3 - 5 points => Uber eats
// 6 - 7 points => Messina
// 8 points => Provider
// 9 - 14 points => Wine
type Props = {
  continueShowMessage: () => void;
  onPrizeChange: (prize: string) => void;
};

export const Quiz = ({ continueShowMessage, onPrizeChange }: Props) => {
  const [points, setPoints] = useState(0);
  const [counter, setCounter] = useState(0);
  const prize = useMemo(() => {
    if (points === 2) {
      return 'Book';
    }

    if (points > 2 && points < 6) {
      return 'Uber Eats';
    }

    if (points > 5 && points < 8) {
      return 'Messina';
    }

    if (points === 8) {
      return 'Provider';
    }

    if (points > 8) {
      return 'Wine';
    }

    return '';
  }, [points]);

  useEffect(() => {
    if (counter === 2) {
      console.log(prize);
      onPrizeChange(prize);
    }
  }, [counter, prize]);

  const handleSelect = useCallback((points: number) => {
    setCounter((prev) => prev + 1);
    setPoints((prev) => prev + points);
  }, []);

  const handleDeselect = useCallback((points: number) => {
    setCounter((prev) => prev - 1);
    setPoints((prev) => prev - points);
  }, []);

  return (
    <div className={styles.root}>
      <h1>first, we need you to select 2 things here that speak to you...</h1>
      {items.map((item) => (
        <QuizItem
          {...item}
          key={item.img}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          unavailable={counter === 2}
        />
      ))}
      <button
        onClick={continueShowMessage}
        className={classnames(styles.continueButton, { [styles.visible]: counter === 2 })}
      >
        Continue
      </button>
    </div>
  );
};
