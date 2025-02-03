import LoginUser from '../components/LogIn';

const LoginPage: React.FC = () => {
  return (
    <div >
      <div >
        <p >
          Rate My Flick!
        </p>
        <p >
          What did you watch today?
        </p>
      </div>
      <LoginUser />
    </div>
  );
};

export default LoginPage;