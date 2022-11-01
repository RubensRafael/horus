import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faXmark,
  faEye,
  faEyeSlash,
  faCircleQuestion,
} from '@fortawesome/free-solid-svg-icons';
import { FormEvent, useState } from 'react';
import styles from './Auth.module.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import Request from '../../../lib/resquest';

const popover = (
  <Tooltip id='password-rules'>
    <h6>Password must contain</h6>
    <p>A lowercase letter</p>
    <p>A uppercase letter</p>
    <p>A number</p>
    <p>Minimum 8 characters</p>
  </Tooltip>
);
export async function getServerSideProps(context) {
  return {
    props: { ctx: context }, // will be passed to the page component as props
  };
}
const Auth = (props) => {
  const [displayForm, setDisplayForm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const togglePasswordView = () => setShowPassword(!showPassword);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    switch (displayForm) {
      case 'sign up':
        Request.post({
          path: '/auth/sign-up',
          data: { name, email, password },
          successCallback: (a) => console.log(a),
          failCalback: setError,
        });
        break;
      case 'sign in':
        Request.post({ path: '/auth/sign-in', data: { email, password } });
        break;
    }
  };
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
};

export default Auth;
