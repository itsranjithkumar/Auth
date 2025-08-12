"use client";
import React from "react";
import { GoogleAuthButton } from "../../components/GoogleAuthButton";
import { Label } from "../../components/ui/label";
import {Input} from '../../components/ui/input';
import { cn } from "@/lib/utils";
import {
  IconBrandGithub,
  IconBrandGoogle,
  IconBrandOnlyfans,
} from "@tabler/icons-react";

function SignupFormDemo() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      email: form.email.value,
      password: form.password.value,
      first_name: form.firstname.value,
      last_name: form.lastname.value,
    };
    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        alert("Signup successful!");
        // Optionally redirect or update UI
      } else {
        const err = await res.json();
        alert(err.detail || "Signup failed");
      }
    } catch (error) {
      alert("Signup failed: " + error);
    }
  };

  return (
    <div className="bg-black min-h-screen flex items-center justify-center">
      <div className="shadow-input w-full max-w-md rounded-none bg-black border border-white p-4 md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to Aceternity
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Login to aceternity if you can because we don&apos;t have a login flow
          yet
        </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input id="firstname" placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input id="lastname" placeholder="Durden" type="text" />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input id="password" placeholder="••••••••" type="password" />
        </LabelInputContainer>

        <button
          className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
          type="submit"
        >
          Sign up &rarr;
          <BottomGradient />
        </button>

        <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <div className="flex flex-col space-y-4">

          <div className="my-4">
  <GoogleAuthButton
    onSuccess={async (idToken: string) => {
      try {
        const res = await fetch("http://127.0.0.1:8000/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id_token: idToken }),
        });
        if (res.ok) {
          const result = await res.json();
          localStorage.setItem("access_token", result.access_token);
          alert("Google Sign-up successful!");
          // Optionally redirect or update UI
        } else {
          const err = await res.json();
          alert(err.detail || "Google Sign-up failed");
        }
      } catch (error) {
        alert("Google Sign-up failed: " + error);
      }
    }}
  />
</div>

        </div>
      </form>
      </div>
    </div>
  );
}

export default SignupFormDemo;

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};

