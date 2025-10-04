"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

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
  onEdit?: (id: string, content: string) => Promise<void> | void; // optional: agar actions o'rniga props ishlatsangiz
  onDelete?: (id: string) => Promise<void> | void; // optional
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

export default function GetCommentCard({ comments, onEdit, onDelete }: Props) {
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
            <CommentItem comment={c} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function CommentItem({
  comment,
  onEdit,
  onDelete,
}: {
  comment: CommentT;
  onEdit?: (id: string, content: string) => Promise<void> | void;
  onDelete?: (id: string) => Promise<void> | void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [val, setVal] = React.useState(comment.content);
  const [pending, setPending] = React.useState(false);

  const submitEdit = async () => {
    if (!val.trim()) return;
    try {
      setPending(true);
      if (onEdit) {
        await onEdit(comment._id, val);
      }
      // Agar Server Actions ishlatsangiz:
      // const fd = new FormData();
      // fd.set("commentId", comment._id);
      // fd.set("content", val);
      // await updateCommentAction(null as any, fd);
      setEditing(false);
    } finally {
      setPending(false);
    }
  };

  const confirmDelete = async () => {
    setPending(true);
    try {
      if (onDelete) {
        await onDelete(comment._id);
      }
      // Agar Server Actions ishlatsangiz:
      // const fd = new FormData();
      // fd.set("commentId", comment._id);
      // await deleteCommentAction(null as any, fd);
    } finally {
      setPending(false);
    }
  };

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

      <CardContent className="pt-0">
        {editing ? (
          <div className="space-y-3">
            <Textarea
              value={val}
              onChange={(e) => setVal(e.target.value)}
              className="min-h-[110px]"
            />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={submitEdit} disabled={pending}>
                <Check className="h-4 w-4 mr-1" /> Saqlash
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setEditing(false);
                  setVal(comment.content);
                }}
              >
                <X className="h-4 w-4 mr-1" /> Bekor qilish
              </Button>
            </div>
          </div>
        ) : (
          <p className="leading-7">{comment.content}</p>
        )}
      </CardContent>
    </Card>
  );
}
