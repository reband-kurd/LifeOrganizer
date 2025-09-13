"use server";
import prisma from "@/lib/prisma";
import { Inclusive_Sans } from "next/font/google";
export async function getAllTasks() {
  const tasks = await prisma.tasks.findMany({
    include: { Calenderdays: true },
  });
  return tasks;
}
export async function createTask(data) {
  const calendersDated = await prisma.calenderdays.create({
    data: {
      date: data.date,
    },
  });
  await prisma.tasks.create({
    data: {
      title: data.title,
      StartsAt: data.startAt,
      EndsAt: data.endAt,
      calenderdaysId: calendersDated.id,
    },
  });
}
export async function deleteTask(id) {
  await prisma.tasks.delete({
    where: { id },
  });
}
export async function updateTask(id, data) {
  const task = await prisma.tasks.update({
    where: { id },
    data: {
      title: data.title,
      StartsAt: data.startAt,
      endAt: data.endAt,
      calendersDated: {
        update: {
          date: data.date,
        },
      },
    },
    include: { calendersDated: true },
  });
  return task;
}
