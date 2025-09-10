"use server";
import prisma from "@/lib/prisma";
export async function getAllNotes() {
  const notes = await prisma.note.findMany();
  return notes;
}
export async function createNote(data) {
  await prisma.note.create({
    data: {
      title: data.title,
      content: data.content,
      isPinned: data.isPinned,
    },
  });
}
export async function deleteNote(id) {
  await prisma.note.delete({
    where: { id },
  });
}
export async function updateNote(id, data) {
  await prisma.note.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      isPinned: data.isPinned,
    },
  });
}
export async function togglePin(id, isPinned) {
  await prisma.note.update({
    where: { id },
    data: { isPinned: !isPinned },
  });
}
