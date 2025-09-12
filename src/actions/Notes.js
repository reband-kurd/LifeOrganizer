"use server";
import prisma from "@/lib/prisma";
export async function getAllnotess() {
  const notess = await prisma.notes.findMany();
  return notess;
}
export async function createNote(data) {
  await prisma.notes.create({
    data: {
      title: data.title,
      content: data.content,
      isPinned: data.isPinned,
    },
  });
}
export async function deleteNote(id) {
  await prisma.notes.delete({
    where: { id },
  });
}
export async function updateNote(id, data) {
  await prisma.notes.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      isPinned: data.isPinned,
    },
  });
}
export async function togglePin(id, isPinned) {
  await prisma.notes.update({
    where: { id },
    data: { isPinned: !isPinned },
  });
}
export async function getPinnedNotes() {
  const pinnedNotes = await prisma.notes.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: "desc" },
  });
  return pinnedNotes;
}
export async function getUnpinnedNotes() {
  const unpinnedNotes = await prisma.notes.findMany({
    where: { isPinned: false },
    orderBy: { updatedAt: "desc" },
  });
  return unpinnedNotes;
}
export async function searchNotes(query) {
  const notes = await prisma.notes.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ],
    },

    orderBy: { updatedAt: "desc" },
  });
  return notes;
}
export async function getNoteById(id) {
  const note = await prisma.notes.findUnique({
    where: { id },
  });
  return note;
}
