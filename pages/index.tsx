import { GetServerSideProps, NextPage } from "next";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { prisma } from "../lib/prisma";

interface Notes {
  notes: {
    id: string;
    title: string;
    content: string;
  }[];
}

interface FormData {
  title: string;
  content: string;
  id: string;
}

export default function Home({ notes }: Notes) {
  const [form, setForm] = useState<FormData>({
    title: "",
    content: "",
    id: "",
  });

  const router = useRouter();
  const refreshData = () => {
    router.replace(router.asPath);
  };

  async function create(data: FormData) {
    try {
      fetch("http://localhost:3000/api/create", {
        body: JSON.stringify(data),
        headers: {
          "content-Type": "application/json",
        },
        method: "POST",
      }).then(() => {
        setForm({ title: "", content: "", id: "" });
        refreshData();
      });
    } catch (error) {
      console.log("failure");
    }
  }

  async function deleteNote(id: string) {
    try {
      fetch(`http://localhost:3000/api/note/${id}`, {
        headers: {
          "content-Type": "application/json",
        },
        method: "DELETE",
      }).then(() => {
        refreshData();
      });
    } catch (error) {
      console.log("error deleting the note");
    }
  }

  const handleSubmit = async (data: FormData) => {
    try {
      create(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1 className="">Les choses a faire !!</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault(), handleSubmit(form);
        }}
      >
        <input
          type="text"
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Description"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
        />

        <button type="submit">Add +</button>
      </form>
      <div>
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <div>{note.title}</div>
              <div>{note.content}</div>
              <button onClick={() => deleteNote(note.id)}>X</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const notes = await prisma.note.findMany({
    select: {
      title: true,
      content: true,
      id: true,
    },
  });

  return {
    props: {
      notes,
    },
  };
};
