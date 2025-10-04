"use server";

import { z } from "zod";
import Comment from "@/models/Comment";
import "@/lib/db"; // ensures a single, cached mongoose connect

const CreateSchema = z.object({
  content: z.string().min(1, "Matn kerak").max(5_000),
  postId: z.string().min(1),
  authorId: z.string().optional(), // guest bo'lsa bo'sh
});

export async function createComment(_prev: any, formData: FormData) {
  try {
    const parsed = CreateSchema.parse({
      content: formData.get("content"),
      postId: formData.get("postId"),
      authorId: formData.get("authorId") || undefined,
    });

    await Comment.create({
      content: parsed.content,
      postId: parsed.postId, // ✅ to'g'ri field nomi
      author: parsed.authorId, // ObjectId (string ko'rinishida)
    });

    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e.message || "Xatolik" };
  }
}
export async function getCommentsByPostId(postId: string) {
  try {
    const comments = await Comment.find({ postId })
      .populate({
        path: "author",
        select: "name image email",
      })
      .lean();

    return comments;
  } catch (e: any) {
    return { ok: false, error: e.message || "Xatolik" };
  }
}
export async function UserIdAuthorId(authorId: string, slug: string) {
  try {
    const comments = await Comment.find({ author: authorId, postId: slug });

    return { ok: true, comments };
  } catch (e: any) {
    return { ok: false, error: e.message || "Xatolik" };
  }
}
