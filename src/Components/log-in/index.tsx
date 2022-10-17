import { useState } from 'react';
import styles from './styles.module.css';

type Props = {
  setName: (name: string) => void;
};

export const LogIn = ({ setName }: Props) => {
  const [nameInput, setNameInput] = useState<string>('');
  const [fadeOut, setFadeOut] = useState<boolean>(false);
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setName(nameInput);
    setFadeOut(true);
  };

  const handleChange = (event: React.FormEvent) => {
    const element = event.currentTarget as HTMLInputElement;
    setNameInput(element.value);
  };
  return (
    <div className={fadeOut ? styles.fadeout : styles.root}>
      <h1>Who are you?</h1>
      <form onSubmit={handleSubmit}>
        <label>Enter your name: </label>
        <input className={styles.input} type="text" value={nameInput} onChange={handleChange} />
      </form>
      <a href="https://canva.okta.com/login/login.htm" target="_blank">
        {' '}
        or Log In with Okta
      </a>
    </div>
  );
};
