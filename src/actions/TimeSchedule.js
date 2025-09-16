"use server";
import prisma from "@/lib/prisma";
export async function getTimeSchedules() {
  const timeSchedules = await prisma.timeSchedule.findMany();
  return timeSchedules;
}
export async function createTimeSchedule(data) {
  try {
    const timeSchedule = await prisma.timeSchedule.create({
      data: {
        title: data.title,
        description: data.description,
        startTime: data.startTime,
        endTime: data.endTime,
        dayOfWeek: data.dayOfWeek,
      },
    });
    return timeSchedule;
  } catch (error) {
    console.error("Error creating time schedule:", error);
    throw error;
  }
}
export async function deleteTimeSchedule(id) {
  await prisma.timeSchedule.delete({
    where: { id },
  });
}
export async function updateTimeSchedule(id, data) {
  const timeSchedule = await prisma.timeSchedule.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      dayOfWeek: data.dayOfWeek,
    },
  });
  return timeSchedule;
}
