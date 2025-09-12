"use server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export async function getHabitsTracker() {
  const habitsTracker = await prisma.habitTracker.findMany({
    include: { habit: true },
  });
  return habitsTracker;
}

export async function createHabit(data) {
  try {
    const habit = await prisma.habits.create({
      data: {
        title: data.title,
        description: data.description,
        frequency: data.frequency,
      },
    });

    await prisma.habitTracker.create({
      data: {
        habitId: habit.id,
        date: data.date,
      },
    });

    return habit;
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
}

export async function deleteHabit(id) {
  await prisma.habitTracker.deleteMany({
    where: { habitId: id },
  });

  await prisma.habits.delete({
    where: { id },
  });
}

export async function updateHabit(id, data) {
  const habit = await prisma.habit.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      frequency: data.frequency,
    },
  });

  await prisma.habitTracker.updateMany({
    where: { habitId: id },
    data: { date: data.date },
  });

  return habit;
}

export async function toggleHabitCompletion(habitId, date, isCompleted) {
  await prisma.habitTracker.updateMany({
    where: { habitId, date },
    data: { isCompleted: isCompleted },
  });
}

export async function getHabitsByDate(date) {
  try {
    const habitsTracker = await prisma.habitTracker.findMany({
      where: { date },
      include: { habit: true },
    });

    return habitsTracker;
  } catch (error) {
    console.error("Error fetching habits by date:", error);
    throw error;
  }
}
