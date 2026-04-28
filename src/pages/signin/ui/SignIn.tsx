import { AuthForm, AuthVariants } from "@/widgets/auth-form";

export const SignIn = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <AuthForm authVariant={AuthVariants.SIGNIN} />
    </div>
  );
};
