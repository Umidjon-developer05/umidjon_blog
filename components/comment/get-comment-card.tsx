"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Author = {
  name: string;
  email: string;
  image?: string;
};

type CommentT = {
  _id: string;
  content: string;
  author: Author;
  createdAt?: string;
};

type Props = {
  comments: CommentT[]; // getCommentsByPostId dan kelgan ro'yxat
};

const initials = (name?: string, email?: string) => {
  if (name && name.trim().length > 0) {
    return name
      .split(" ")
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("");
  }
  return email?.[0]?.toUpperCase() || "U";
};

const fmt = (d?: string) => (d ? new Date(d).toLocaleString() : "");

export default function GetCommentCard({ comments }: Props) {
  if (!comments?.length) {
    return (
      <Card className="mt-10">
        <CardContent className="p-6 text-muted-foreground">
          Hali komment yo‘q. Birinchi bo‘ling!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      <div className="flex items-center gap-3">
        <h3 className="text-2xl font-creteRound">Kommentlar</h3>
        <Badge variant="secondary">{comments.length}</Badge>
      </div>
      <Separator />
      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c._id}>
            <CommentItem comment={c} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentItem({ comment }: { comment: CommentT }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={comment.author?.image}
                alt={comment.author?.name}
              />
              <AvatarFallback>
                {initials(comment.author?.name, comment.author?.email)}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <CardTitle className="text-base">
                {comment.author?.name || "No name"}
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                {comment.author?.email}
              </p>
              {comment.createdAt && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {fmt(comment.createdAt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
