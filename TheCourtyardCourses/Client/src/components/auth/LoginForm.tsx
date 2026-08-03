import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';

interface FormData {
  usernameOrEmail: string;
  password: string;
}

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = (data) => {};

  return (
    <form className="loginWrapper flex flex-col gap-0" onSubmit={handleSubmit(onSubmit)}>
      <div className="inputContainer">
        <label htmlFor="usernameOrEmail">Scholar ID or Email</label>
        <input
          type="text"
          className="inputField w-full"
          id="usernameOrEmail"
          placeholder="scholar@example.com or raven123"
          {...register('usernameOrEmail', {
            required: 'Please enter your Scholar ID or Email.',
          })}
        />
        <span className="fieldError">{errors && errors.usernameOrEmail?.message}</span>
      </div>
      <div className="inputContainer">
        <label htmlFor="password">Secret Phrase</label>
        <input
          type="password"
          className="inputField w-full"
          id="password"
          placeholder="••••••••"
          {...register('password', { required: 'Please enter your Secret Phrase.' })}
        />

        <span className="fieldError">{errors && errors.password?.message}</span>

        <div className="forgotPass my-5">
          <span className="italic hover:underline cursor-pointer">Lost Secret Phrase?</span>
        </div>
      </div>
      <button type="submit" className="btnThird">
        Enter the Courtyard
      </button>
    </form>
  );
};

export default LoginForm;
