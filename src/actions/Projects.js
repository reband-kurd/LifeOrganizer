"use server";
import prisma from "@/lib/prisma";
export async function getAllProjects() {
  const projects = await prisma.projects.findMany();
  return projects;
}
export async function createProject(data) {
  await prisma.projects.create({
    data: {
      title: data.title,
      description: data.description,
      deadline: data.deadline,
      isCompleted: data.isCompleted,
    },
  });
}
export async function deleteProject(id) {
  await prisma.projects.delete({
    where: { id },
  });
}
export async function updateProject(id, data) {
  await prisma.projects.update({
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
  const projects = await prisma.projects.findMany({
    where: { isCompleted },
  });
  return projects;
}
