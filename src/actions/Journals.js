"use server";
import prisma from "@/lib/prisma";
export async function getAllJournals() {
  const journals = await prisma.journals.findMany();
  return journals;
}
export async function createJournal(data) {
  await prisma.journals.create({
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood,
    },
  });
}
export async function deleteJournal(id) {
  await prisma.journals.delete({
    where: { id },
  });
}
export async function updateJournal(id, data) {
  await prisma.journals.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
      mood: data.mood,
    },
  });
}
export async function getJournalsByMood(mood) {
  const journals = await prisma.journals.findMany({
    where: { mood },
  });
  return journals;
}
