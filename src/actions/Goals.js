"use server";
import prisma from "@/lib/prisma";
export async function getAllGoals() {
  const goals = await prisma.goal.findMany();
  return goals;
}
export async function createGoal(data) {
  await prisma.goal.create({
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      isAchieved: data.isAchieved,
    },
  });
}
export async function deleteGoal(id) {
  await prisma.goal.delete({
    where: { id },
  });
}
export async function updateGoal(id, data) {
  await prisma.goal.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      isAchieved: data.isAchieved,
    },
  });
}
