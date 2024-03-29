import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { GoogleButton } from '../components/Common';
import { HandleAccountContainer, HandleAccountCard, HandleAccountErrorMessage, StyledButton, CaptionTextBox } from '../components/CommonStyles';
import { auth } from '../firebase/firebase';
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from '../firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';



function Register(){
  const [ user ] = useAuthState(auth);
  const [ isRegistering, setIsRegistering ] = useState(false);
  const [ isSigningIn , setIsSigningIn ] = useState(false);
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');
  const [ errorMessage, SetErrorMessage ] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

    SetErrorMessage('');

    if(!isRegistering) {
      setIsRegistering(true);
      await doCreateUserWithEmailAndPassword(email, password).catch((error) => {
        if(error.code === "auth/email-already-in-use") SetErrorMessage('帳號已使用！');
        if(error.code === "auth/invalid-email" ) SetErrorMessage('無效的帳號！');
        if(error.code === "auth/weak-password" ) SetErrorMessage('密碼需至少6個字元！');
        setIsRegistering(false);
      });
      return;
    }
  }

  const handleErrorMessage = () => {
    SetErrorMessage('');
  }

  const onGoogleSignIn = (e) => {
    e.preventDefault();

    if (!isSigningIn) {
        setIsSigningIn(true);
        doSignInWithGoogle().catch(err => {
            setIsSigningIn(false);
            console.log(err);
        })
    }
  }


  return (
    <>
      {user && (<Navigate to={'/home'} replace={true} />)}
      <HandleAccountContainer>
        <img src='../../images/postbox.png'></img>
        <HandleAccountCard>
            <h2>建立新帳戶</h2>
            <form onSubmit={onSubmit}>
              <div>
                <label>
                  電子信箱或使用者名稱
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="電子信箱或使用者名稱"
                  required
                  value={email}
                  onClick={ handleErrorMessage }
                  onChange={(e) => { setEmail(e.target.value)}}
                />
              </div>
              <div>
                <label>
                  密碼
                </label>
                <input 
                  type="password"
                  autoComplete="new-password"
                  placeholder="密碼" 
                  required
                  value={password}
                  onClick={ handleErrorMessage }
                  onChange={(e) => { setPassword(e.target.value) }}
                />
              </div>
              {errorMessage && (<HandleAccountErrorMessage>{errorMessage}</HandleAccountErrorMessage>)}
              <StyledButton 
                type="submit"
                // isDisabled={isRegistering} 
                bg="success" 
                width="50%" 
                borderRadius="5px"
                mx="auto"
                my="2em"
                p="0.8em"
              >
                註冊
              </StyledButton>
            </form>
            <p>已經有帳戶？<Link to={'/login'}>登入</Link></p>
            <CaptionTextBox>
              <hr/>
              <p>或是使用其他方式</p>
              <hr/>
            </CaptionTextBox>
            <GoogleButton onClick={onGoogleSignIn} m="auto">
              Google 登入
            </GoogleButton>
        </HandleAccountCard>
      </HandleAccountContainer>
    </>
  )
}

export default Register;