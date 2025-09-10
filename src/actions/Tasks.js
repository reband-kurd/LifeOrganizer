"use server";
import prisma from "@/lib/prisma";
import { Inclusive_Sans } from "next/font/google";
export async function getAllTasks() {
  const tasks = await prisma.task.findMany({
    include: { calendersDated: true },
  });
  return tasks;
}
export async function createTask(data) {
  const calendersDated = await prisma.calendersDated.create({
    data: {
      date: data.date,
    },
  });
  await prisma.task.create({
    data: {
      title: data.title,
      StartsAt: data.startAt,
      endAt: data.endAt,
      calendersDatedId: calendersDated.id,
    },
  });
}
export async function deleteTask(id) {
  await prisma.task.delete({
    where: { id },
  });
  await prisma.calendersDated.delete({
    where: {
      tasks: {
        id,
      },
    },
  });
}
export async function updateTask(id, data) {
  const task = await prisma.task.update({
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
