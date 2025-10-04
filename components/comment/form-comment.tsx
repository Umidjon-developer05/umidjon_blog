"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createComment } from "@/actions/commit.actions";
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

function SubmitBtn() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="px-4 py-2 rounded-md bg-primary text-primary-foreground disabled:opacity-60"
    >
      {pending ? "Yuborilmoqda…" : "Komment yozish"}
    </button>
  );
}

export default function FormComment({
  postId,
  slug,
  authorId,
}: {
  postId: string;
  slug: string;
  authorId?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(createComment, { ok: false });
  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      router.refresh();
    }
  }, [state?.ok, router]);
  return (
    <form action={action} className="mt-10 space-y-3">
      <textarea
        name="content"
        placeholder="Fikringizni yozing…"
        className="w-full min-h-[120px] rounded-md border bg-background p-3 outline-none"
      />
      {/* yashirin maydonlar */}
      <input type="hidden" name="postId" value={postId} />
      <input
        type="hidden"
        name="authorId"
        value={authorId /* user's Mongo _id */}
      />

      <input type="hidden" name="slug" value={slug} />
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitBtn />
    </form>
  );
}
