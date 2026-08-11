import { ArrowRightIcon } from '@phosphor-icons/react';
import type { RefObject } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useLogin } from '../../features/auth/useAuth';

interface FormData {
  identifier: string;
  password: string;
}

const LoginForm = ({
  setLogin,
  formContainer,
}: {
  setLogin: (value: boolean) => void;
  formContainer: RefObject<HTMLDivElement | null>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const { mutate: loginMutate, isPending } = useLogin();
  const onSubmit: SubmitHandler<FormData> = (data) => {
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.identifier.trim());
    const payload = isEmail
      ? { email: data.identifier.trim(), password: data.password }
      : { username: data.identifier.trim(), password: data.password };
    loginMutate(payload);
  };

  return (
    <form className="loginWrapper flex flex-col gap-0" onSubmit={handleSubmit(onSubmit)}>
      <div className="inputContainer">
        <label htmlFor="identifier">Scholar ID or Email</label>
        <input
          type="text"
          className="inputField w-full"
          id="identifier"
          placeholder="scholar@example.com or raven123"
          {...register('identifier', {
            required: 'Enter your Scholar ID or Email.',
          })}
        />
        {errors.identifier && (
          <span className="fieldError">{errors.identifier.message}</span>
        )}
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

        {errors.password && <span className="fieldError">{errors.password.message}</span>}

        <div className="group relative forgotPass my-5">
          <span className="relative italic cursor-pointer">
            Lost Secret Phrase?
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 group-hover:w-full duration-300 bg-text-primary" />
          </span>
        </div>
      </div>
      <button type="submit" className="btnThird">
        {isPending ? 'Opening the Gates...' : 'Enter the Courtyard'}
      </button>

      <div className="switcherContainer my-3 flex flex-col items-center justify-center gap-1">
        <span className="italic text-text-secondary">New to the Courtyard?</span>
        <span
          className="relative inline-flex items-center gap-2 italic group cursor-pointer"
          onClick={() => {
            formContainer.current?.scrollTo({ top: 0, behavior: 'instant' });
            setLogin(false);
          }}
        >
          Join the Courtyard
          <ArrowRightIcon
            className="group-hover:translate-x-1.5 duration-300"
            weight="bold"
            size={16}
          />
          <span className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-text-primary transition-all duration-300 group-hover:w-full"></span>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;
