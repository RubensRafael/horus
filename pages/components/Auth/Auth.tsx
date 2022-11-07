import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faEye,
  faEyeSlash,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FormEvent, useEffect, useState } from 'react';
import styles from './Auth.module.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Request from '../../../lib/resquest';
import { RootPageProps } from '../../index';
import Router from 'next/router';
import { signIn } from 'next-auth/react';

type UserAuthInfo = {
  name: string;
  password: string;
  email: string;
};

const popover = (
  <Tooltip id='password-rules'>
    <h6>Password must contain</h6>
    <p>A lowercase letter</p>
    <p>A uppercase letter</p>
    <p>A number</p>
    <p>Minimum 8 characters</p>
  </Tooltip>
);

export default function Auth(props: RootPageProps) {
  const [displayForm, setDisplayForm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordView = () => setShowPassword(!showPassword);

  const redirect = (data: { userToken: string }) => {
    Router.push('/home');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    switch (displayForm) {
      case 'sign up':
        Request.post<UserAuthInfo, { userToken: string }>({
          path: '/auth/sign-up',
          data: { name, email, password },
          successCallback: () => Router.push('/home'),
          failCalback: setError,
        });
        break;
      case 'sign in':
        const result = await signIn('credentials', {
          redirect: false,
          email: email,
          password: password,
        });
        if (result && result.ok) {
          Router.push('/home');
        } else {
          setError('There is a problem with your credentials.');
        }
        break;
    }
  };
  useEffect(() => {
    if (props.redirect_reason) {
      setError(props.redirect_reason);
    }
  }, []);
  return (
    <div className={styles.container}>
      {displayForm ? (
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <div className={styles.formHeader}>
            <FontAwesomeIcon
              onClick={() => setDisplayForm('')}
              icon={faXmark}
            />
            {error ? (
              <p style={{ color: 'red' }}>{error}</p>
            ) : (
              <p>Fill in the fields</p>
            )}
          </div>
          {displayForm === 'sign up' && (
            <div className={styles.field}>
              <input
                value={name}
                onChange={({ target }) => setName(target.value)}
                required
                placeholder='Your username'
                type='text'
              ></input>
            </div>
          )}
          <div className={styles.field}>
            <input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              required
              placeholder='your@email.com'
              type='email'
            ></input>
          </div>
          <div className={styles.field}>
            <input
              pattern='(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              required
              placeholder='Your password'
              type={showPassword ? 'text' : 'password'}
            ></input>
            <FontAwesomeIcon
              color='#7d7d7d'
              onClick={togglePasswordView}
              icon={showPassword ? faEye : faEyeSlash}
            />
            <OverlayTrigger placement='auto' trigger='click' overlay={popover}>
              <FontAwesomeIcon color='#7d7d7d' icon={faCircleQuestion} />
            </OverlayTrigger>
          </div>
          {displayForm === 'sign in' && (
            <a
              onClick={() => setDisplayForm('sign up')}
              className={styles.displayToggle}
            >
              Are you new here? Create an account.
            </a>
          )}
          {displayForm === 'sign up' && (
            <a
              onClick={() => setDisplayForm('sign in')}
              className={styles.displayToggle}
            >
              Already have an account? Click here.
            </a>
          )}
          <button className={styles.button}>{displayForm}</button>
        </form>
      ) : (
        <>
          <button
            style={{ border: 'solid 1px white' }}
            onClick={() => setDisplayForm('sign up')}
            className={styles.button}
          >
            sign up
          </button>
          <hr />
          <button
            style={{ border: 'solid 1px white' }}
            onClick={() => setDisplayForm('sign in')}
            className={styles.button}
          >
            sign in
          </button>
        </>
      )}
    </div>
  );
}
