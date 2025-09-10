"use server";
import prisma from "@/lib/prisma";
export async function getAllJournals() {
  const journals = await prisma.journal.findMany();
  return journals;
}
export async function createJournal(data) {
  await prisma.journal.create({
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood,
    },
  });
}
export async function deleteJournal(id) {
  await prisma.journal.delete({
    where: { id },
  });
}
export async function updateJournal(id, data) {
  await prisma.journal.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood,
    },
  });
}
export async function getJournalsByMood(mood) {
  const journals = await prisma.journal.findMany({
    where: { mood },
  });
  return journals;
}
