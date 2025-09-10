"use server";
import prisma from "@/lib/prisma";
export async function getAllProjects() {
  const projects = await prisma.project.findMany();
  return projects;
}
export async function createProject(data) {
  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      isCompleted: data.isCompleted,
    },
  });
}
export async function deleteProject(id) {
  await prisma.project.delete({
    where: { id },
  });
}
export async function updateProject(id, data) {
  await prisma.project.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      isCompleted: data.isCompleted,
    },
  });
}
export async function getProjectsByCompletion(isCompleted) {
  const projects = await prisma.project.findMany({
    where: { isCompleted },
  });
  return projects;
}
