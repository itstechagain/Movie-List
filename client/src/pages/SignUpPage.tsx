import SignUpUser from '../components/SignUp.js';

const SignUpPage: React.FC = () => {
  return (
    <div className = "form-container">
      <div >
        <p >
          Sign Up and Get Started 🍿
        </p>
      </div>
      <SignUpUser />
    </div>
  );
};

export default SignUpPage;