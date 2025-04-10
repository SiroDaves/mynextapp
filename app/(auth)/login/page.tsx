"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/state/auth/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { RefreshCwIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const loginFormSchema = z.object({
  email: z.string().email(),
  password: z.string().max(160).min(4),
});

type ProfileFormValues = z.infer<typeof loginFormSchema>;

const defaultValues: Partial<ProfileFormValues> = {
  email: "",
  password: "",
};

export default function Login() {
  const { login, loading } = useAuthStore();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const router = useRouter();
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      await login(data);
      router.push("/dashboard");
    } catch (error: any) {
      await toast.error("Something went wrong!", {
        description: error?.response?.data?.description,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="email"
                  type="email"
                  {...field}
                  size={6}
                  className=""
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  placeholder="***********"
                  {...field}
                  type="password"
                  size={2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-white" disabled={loading}>
          {loading && <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />}{" "}
          Submit
        </Button>
      </form>
    </Form>
  );
}
