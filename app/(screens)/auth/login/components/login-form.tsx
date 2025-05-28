import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Form as ShadcnForm,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SocialLoginButtons } from "./input-components/SocialLoginButtons";
import { FooterLinks } from "./input-components/FooterLinks";
import { TermsServices } from "@/components/auth/TermsServices";
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

interface LoginFormProps {
  onSubmit: (values: { email: string; password: string }) => Promise<void>;
  onFacebookSignIn: () => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  loginError: string;
  validationError?: string;
  isLoading: boolean;
}

export const LoginForm = ({
  onSubmit,
  onFacebookSignIn,
  onGoogleSignIn,
  loginError,
  validationError,
  isLoading,
}: LoginFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  return (
    <div className="flex flex-col items-center z-20 w-full max-w-11/12">
      {/* --- Login Form Card --- */}
      <Card className="w-full max-w-md bg-neutral-white border border-blue-400 shadow-xl rounded-xl z-30 relative">
        <CardHeader>
          <CardTitle className="text-blue-400">Login</CardTitle>
          <CardDescription className="text-gray-500">
            Log through your social media account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-full">
          <SocialLoginButtons
            onFacebookSignIn={onFacebookSignIn}
            onGoogleSignIn={onGoogleSignIn}
          />

          <ShadcnForm {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-400 font-semibold">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-blue-400 font-semibold">
                      Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          className="bg-neutral-white border border-blue-400 focus:border-blue-400 focus:ring-blue-400 text-neutral-black"
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute inset-y-0 right-3 flex items-center text-blue-400"
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeClosed className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Error Messages */}
              {validationError && (
                <p className="text-red-500 bg-red-100 mb-4">
                  {validationError}
                </p>
              )}
              {loginError && (
                <p className="text-red-800 border border-red-700 bg-red-100 rounded px-2 py-1 mb-2 text-xs font-medium animate-shake">
                  {loginError}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-400 text-neutral-white hover:bg-blue-500 transition font-bold py-2 rounded-lg shadow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoadingSpinner loadingText="Logging in..." />
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </ShadcnForm>
        </CardContent>
      </Card>
      <FooterLinks />
      <TermsServices
        mode="info"
        checked={termsChecked}
        onCheckedChange={(checked) => setTermsChecked(checked)}
      />
    </div>
  );
};
