"use server";
import prisma from "@/lib/prisma";
export async function getHabitsTracker() {
  const habitsTracker = await prisma.habitsTracker.findMany();
  return habitsTracker;
}
export async function createHabit(data) {
  const habit = await prisma.habits.create({
    data: {
      title: data.title,
      description: data.description,
      frequency: data.frequency,
    },
  });
  await prisma.habitsTracker.create({
    data: {
      habitId: habit.id,
      date: data.date,
    },
  });
  return habit;
}
export async function deleteHabit(id) {
  await prisma.habits.delete({
    where: { id },
  });
  await prisma.habitsTracker.deleteMany({
    where: { habitId: id },
  });
}
export async function updateHabit(id, data) {
  const habit = await prisma.habits.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      frequency: data.frequency,
    },
  });
  await prisma.habitsTracker.updateMany({
    where: { habitId: id },
    data: { date: data.date },
  });
  return habit;
}
export async function toggleHabitCompletion(habitId, date, isCompleted) {
  await prisma.habitsTracker.updateMany({
    where: { habitId, date },
    data: { isCompleted: isCompleted },
  });
}
export async function getHabitsByDate(date) {
  const habitsTracker = await prisma.habitsTracker.findMany({
    where: { date },
    include: { habit: true },
  });
  return habitsTracker;
}
