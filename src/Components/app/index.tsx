import { useState } from 'react';
import { BirthdayMessage } from '../BirthdayMessage/BirthdayMessage';
import { Quiz } from '../quiz';
import styles from './styles.module.css';
import type { prizeItem } from '../wheel-canvas';
import { WheelCanvas } from '../wheel-canvas';
import Confetti from 'react-confetti';
import { LogIn } from '../log-in';
import { SendGift } from '../send-gift';

const prizes: prizeItem[] = [
  {
    value: 'Book',
    picked: false,
  },
  {
    value: 'Uber Eats',
    picked: false,
  },
  {
    value: 'Messina',
    picked: false,
  },
  {
    value: 'Provider',
    picked: false,
  },
  {
    value: 'Wine',
    picked: false,
  },
];

// #E7ED6E, #C674DE, #DC5F43

const segColors = ['#BE8FFA', '#E2CFFA', '#4F445D', '#E7ED6E'];

export const App = () => {
  const [prize, setPrize] = useState<string>('');
  const [showWheel, setShowWheel] = useState(false);
  const [showChoices, setShowChoices] = useState(false);
  const [wheelSpinned, setWheelSpinned] = useState(false);
  const [name, setName] = useState('');
  const [confirmGift, setConfirmGift] = useState(false);
  const continueShowChoices = () => {
    setShowChoices(true);
  };
  const onFinished = (winner: string, index: number) => {
    removePrize(index);
    setWheelSpinned(true);
  };

  const removePrize = (index: number) => {
    prizes[index].picked = true;
  };

  const continueShowWheel = () => {
    setShowWheel(true);
  };

  const continueConfirmGift = () => {
    setConfirmGift(true);
  };

  return (
    <div className={styles.app}>
      {!showChoices && <LogIn setName={setName} />}
      {name !== '' && !showChoices && (
        <BirthdayMessage name={name} continueShowChoices={continueShowChoices} />
      )}
      {showChoices && !showWheel && (
        <Quiz continueShowMessage={continueShowWheel} onPrizeChange={setPrize} />
      )}
      {showWheel && (
        <WheelCanvas
          segments={prizes}
          segColors={segColors}
          winningSegment={prize}
          onFinished={(winner: string, index: number) => onFinished(winner, index)}
          onConfirmed={continueConfirmGift}
          primaryColor="black"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={false}
          size={290}
          upDuration={100}
          downDuration={1000}
          fontFamily="Gatwick Bold"
        />
      )}
      <Confetti
        run={wheelSpinned}
        tweenDuration={100}
        onConfettiComplete={() => {
          setWheelSpinned(false);
        }}
      />
      {confirmGift && <SendGift />}
    </div>
  );
};
