import LoginUser from '../components/LogIn.js';

const LoginPage: React.FC = () => {
  return (
    <div >
      <div >
        <h2 >
          What did you watch today? 🍿
        </h2>
      </div>
      <LoginUser />
    </div>
  );
};

export default LoginPage;