import { AuthForm, AuthVariants } from "@/widgets/auth-form";

export const SignUp = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <AuthForm authVariant={AuthVariants.SIGNUP} />
    </div>
  );
};
